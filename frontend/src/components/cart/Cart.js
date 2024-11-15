import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { decreaseCartItemQty, increaseCartItemQty, removeItemFromCart, updateCartItemPrice, updateCartItemWeight } from '../../slices/cartSlice';
import MetaData from '../Layouts/MetaData';
import { Slide, toast } from 'react-toastify';
import { getUserAddresses } from '../../actions/addressAction';
import store from '../../store';
import { loadUser } from '../../actions/userActions';
import { getProduct } from '../../actions/productAction';
import axios from 'axios';
import LoaderButton from '../Layouts/LoaderButton';
import NumberInput from '../Layouts/NumberInput';

const Cart = () => {
    const [items, setItems] = useState(() => {
        return JSON.parse(localStorage.getItem("cartItems")) || [];
    });
    const [weight, setWeight] = useState({});
    console.log("weight", weight)
    const [weightError, setWeightError] = useState({});
    const { isAuthenticated, user } = useSelector(state => state.authState);
    const { products } = useSelector((state) => state.productsState);
    const { getdata, geterror } = useSelector(state => state.addressState);
    const [shippingAmount, setShippingAmount] = useState(null);
    const [weighttoast,setWeightToast]=useState(false);
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const [errorText, setErrorText] = useState(null);
    const [nextPage, setnextPage] = useState(true);
    const [closeToast, setCloseToast] = useState(false);
    const [weightvalue, setweightvalue] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [getshipping, setGetshipping] = useState(false);
    console.log("user addresss", getdata);

    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const shippingCharge = shippingAmount / 100;
    // const shippingCharge = 1.00;
    const subtotal = items.reduce((acc, item) => acc + item.price * item.productWeight, 0).toFixed(2);
    const total = (parseFloat(subtotal) + shippingCharge).toFixed(2);


    // useEffect(() => {
    //     if (isAuthenticated && !getdata) {
    //         dispatch(getUserAddresses({ userId: user && user._id })); // Fetch user addresses when the component mounts
    //     }
    // }, []);
    useEffect(() => {
        // Check weights on initial render to set error messages
        const initialErrors = {};
        items.forEach(item => {
            if (!item.productWeight || item.productWeight <= 0) {
                initialErrors[item.product] = "Required";
            }
        });
        setWeightError(initialErrors);
    }, [items]);


    const defaultAddress = getdata && getdata.addresses && getdata.addresses.find(address => address.defaultAddress) || null;

    useEffect(() => {
        if (!user) {
            store.dispatch(loadUser());
            store.dispatch(getProduct());
        }

        // if (user) {
        //     setDummyUser(true);
        // }
    }, []);
    useEffect(() => {
        // Compare and update prices
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        const updatedItems = cartItems.map(cartItem => {
            const currentItem = products.find(item => item._id === cartItem.product);
            if (currentItem && currentItem.price !== cartItem.price) {
                dispatch(updateCartItemPrice({ productId: cartItem.product, newPrice: currentItem.price }));
                return { ...cartItem, price: currentItem.price };
            }
            return cartItem;
        });

        // Update local storage
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    }, [items, dispatch]);

    const [pickupDetails, setPickupDetails] = useState({
        lat: 13.0671844,
        lng: 80.1775087
    });

    const [dropDetails, setDropDetails] = useState(null);

    const [customerDetails, setCustomerDetails] = useState(null);

    useEffect(() => {
        if(defaultAddress && isAuthenticated){
            setCustomerDetails({
                name: defaultAddress && defaultAddress.name && defaultAddress.name,
                countryCode: '+91',
                phoneNumber: defaultAddress && defaultAddress.phoneNo
            })
            setDropDetails({
                lat: defaultAddress && defaultAddress.latitude && defaultAddress.latitude,
                lng: defaultAddress && defaultAddress.longitude && defaultAddress.longitude
            })
        }
        
    }, [defaultAddress,isAuthenticated])

    useEffect(() => {
        const fetchdata = async () => {
            setGetshipping(true);
            const requestData = {
                pickup_details: pickupDetails,
                drop_details: dropDetails,
                customer: {
                    name: customerDetails.name,
                    mobile: {
                        country_code: customerDetails.countryCode,
                        number: customerDetails.phoneNumber
                    }
                }
            };
            // console.log(requestData)
            try {
                const response = await axios.post('/api/v1/get-quote', requestData);
                // console.log("getQuote Response", response.data)
                // if (response && response.data && response.data.vehicles[3] && response.data.vehicles[3].fare) {
                //     setShippingAmount(response.data.vehicles[3].fare.minor_amount);
                //     setDummyUser(false);
                // }
                const twoWheelerVehicle = response.data.vehicles.find(vehicle =>
                    vehicle.type && vehicle.type.includes("2 Wheeler")
                );

                if (twoWheelerVehicle && twoWheelerVehicle.fare) {
                    // Set the shipping amount for "2 Wheeler"
                    setShippingAmount(twoWheelerVehicle.fare.minor_amount);
                    setGetshipping(false);
                    setnextPage(true);
                    setErrorText(null);
                    // setDummyUser(false);
                }
                else {

                    // toast.error(`No 2 Wheeler found in the vehicle list.`, {
                    //     position: "bottom-center",
                    // });
                    toast.dismiss();
                    setTimeout(() => {
                        toast.error('No 2 Wheeler found in the vehicle list', {
                            position: 'bottom-center',
                            type: 'error',
                            autoClose: 700,
                            transition: Slide,
                            hideProgressBar: true,
                            className: 'small-toast',
                        });
                    }, 300);
                    setGetshipping(false);
                    setErrorText('No 2 Wheeler found in the vehicle list');
                    setnextPage(false);
                    // navigate("/cart")
                }

                //    toast.error('Response:', response.data);
                // Handle response as needed
            } catch (error) {
                console.log("requesting data", error)
                // navigate("/cart")
                // toast.error(error.response.data.message);
                toast.dismiss();
                setTimeout(() => {
                    toast.error(error.response.data.message, {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
                setGetshipping(false);
                setnextPage(false);
                setErrorText(error.response.data.message);
                // Handle error as needed
            }
        }
        if (defaultAddress && dropDetails && customerDetails) {
        fetchdata()
        }

    }, [dropDetails])

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        dispatch(removeItemFromCart(productToDelete));
        setShowModal(false);
        // toast.success('Item removed from Cart', {
        //     position: "bottom-center",
        //     type: 'success',
        //     autoClose: 500, 
        // });
        toast.dismiss();
        setTimeout(() => {
            toast.success('Item removed from Cart', {
                position: 'bottom-center',
                type: 'success',
                autoClose: 700,
                transition: Slide,
                hideProgressBar: true,
                className: 'small-toast',
                onOpen: () => { setItems(JSON.parse(localStorage.getItem("cartItems")) || []); }
            });
        }, 300);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    const capitalizeFirstLetter = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };


    const handelAddAddress = () => {
        if (user && isAuthenticated) {
            navigate('/shipping');
        }
        else {
            navigate('/login');
        }
    }

    const checkOutHandler = (e) => {
        e.preventDefault();
        const invalidItems = items.filter(item => !item.productWeight || item.productWeight <= 0);
        const invalidquantity = items.filter(item => item.measurement === 'Kg' && item.productWeight < 0.25);
        console.log(invalidItems);
        if (invalidItems.length > 0 && !closeToast) {
            setErrorText("Please set a valid quantity for all products in the cart.");
            setCloseToast(true);
            toast.dismiss();
            setTimeout(() => {
                toast.error("Please set a valid quantity for all products in the cart.", {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
                setCloseToast(false);
            }, 300);
            return; // Stop checkout
        }
        else if(invalidquantity.length >0 && !closeToast){
            setErrorText("Weight should Not be Less than 0.25kg.");
            setCloseToast(true);
            toast.dismiss();
            setTimeout(() => {
                toast.error("Weight should Not be Less than 0.25kg.", {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
                setCloseToast(false);
            }, 300);
            return; // Stop checkout
        }
        else if (!nextPage && !closeToast) {
            setCloseToast(true);
            toast.dismiss();
            setTimeout(() => {
                toast.error(errorText, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
                setCloseToast(false);
            }, 300);
            return;
        }
        else if (nextPage) {
            if (isAuthenticated && user && defaultAddress) {
                navigate('/order/confirm', { state: { shippingCharge, defaultAddress, subtotal, total ,items} });
            }
            else if (isAuthenticated && user && !defaultAddress) {
                navigate('/address');
            }
            else {
                navigate('/login');
            }
        }

        // sessionStorage.setItem('redirectPath', '/shipping');
        // navigate('/shipping');
    };

    const handleWeightChange = (productId, value, productCategory, productMeasurement,item) => {
        // Allow clearing the input
        if (value === '' || value === null || value === 0) {
            setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));

            // setWeightError(prevErrors => ({ ...prevErrors, [productId]: "Required" }));
            if (weight[productId] === null || weight[productId] === 0 || weight[productId] === '') {
                setWeightError(prevErrors => ({ ...prevErrors, [productId]: "Required" }));
            }

            // Update localStorage with the empty value for real-time sync
            const updatedItems = items.map(item =>
                item.product === productId ? { ...item, productWeight: '' } : item
            );
            setItems(updatedItems);
            localStorage.setItem("cartItems", JSON.stringify(updatedItems));

            return;
        }

        // Validate value format based on category and measurement
        let validValue;
        if (productMeasurement === 'Piece' || productMeasurement === 'Box' || productMeasurement === 'Grams') {
            validValue = value.match(/^\d*$/) ? value : weight[productId]; // Only whole numbers allowed
            setWeightError(prevErrors => ({ ...prevErrors, [productId]: '' }));
        } else {
            validValue = value.match(/^\d*\.?\d{0,2}$/) ? value : weight[productId];
            setWeightError(prevErrors => ({ ...prevErrors, [productId]: '' }));
        }

        const weightValue = parseFloat(validValue);
        if (weightValue < 0) return;

        if (productMeasurement === 'Piece' || productMeasurement === 'Grams') {
            if (weightValue > 10) {
                setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
                if ( item.productWeight === null || item.productWeight === '' || item.productWeight === 0) {
                    setWeightError(prevErrors => ({ ...prevErrors, [productId]: "Required" }));
                }
                // toast.error("Piece count cannot exceed 10");
                if(!weighttoast){
                    setWeightToast(true);
                    toast.dismiss();
                    setTimeout(() => {
                        toast.error("Piece count cannot exceed 10", {
                            position: 'bottom-center',
                            type: 'error',
                            autoClose: 700,
                            transition: Slide,
                            hideProgressBar: true,
                            className: 'small-toast',
                        });
                        setCloseToast(false);
                        setWeightToast(false);
                    }, 300);
                }
                
                return;
            }
        } else if (productMeasurement === 'Box') {
            if (weightValue > 10) {
                setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
                if ( item.productWeight === null || item.productWeight === '' || item.productWeight === 0) {
                    setWeightError(prevErrors => ({ ...prevErrors, [productId]: "Required" }));
                }
                // toast.error("Box count cannot exceed 10");
                if(!weighttoast){
                    setWeightToast(true);
                toast.dismiss();
                setTimeout(() => {
                    toast.error("Box count cannot exceed 10", {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                    setCloseToast(false);
                    setWeightToast(false);
                }, 300);
            }
                return;
            }
        }
        if ( item.productWeight < 0.25 ) {
            setWeightError(prevErrors => ({ ...prevErrors, [productId]: "Minimum 0.25" }));
        }
         else if (weightValue > 5) {
            setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
            if ( item.productWeight === null || item.productWeight === '' || item.productWeight === 0) {
                setWeightError(prevErrors => ({ ...prevErrors, [productId]: "Required" }));
            }
           
            // toast.error("Weight cannot exceed 5Kg");
            if(!weighttoast){
                setWeightToast(true);
            toast.dismiss();
                setTimeout(() => {
                    toast.error("Weight cannot exceed 5Kg", {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                    setCloseToast(false);
                    setWeightToast(false);
                }, 300);
            }
            return;
        }

        // Update weight in state and local storage
        // setWeight(prevWeights => ({ ...prevWeights, [productId]: weightValue }));
        const updatedItems = items.map(item =>
            item.product === productId ? { ...item, productWeight: weightValue } : item
        );
        setItems(updatedItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        setItems(JSON.parse(localStorage.getItem("cartItems")) || []);
    };

    // const handleWeightChange = (productId, value, productCategory, productMeasurement) => {
    //     // Allow clearing the input
    //     if (value === '') {
    //         setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //         setWeightError(prevErrors => ({ ...prevErrors, [productId]: "Quantity cannot be empty" }));

    //         // Update localStorage with the empty value for real-time sync
    //         const updatedItems = items.map(item =>
    //             item.product === productId ? { ...item, productWeight: '' } : item
    //         );
    //         setItems(updatedItems);
    //         localStorage.setItem("cartItems", JSON.stringify(updatedItems));

    //         return;
    //     }

    //     let validValue;
    //     if (productCategory === 'Keerai' || productMeasurement === 'Box' || productMeasurement === 'Grams') {
    //         validValue = value.match(/^\d*$/) ? value : weight[productId];
    //     } else {
    //         validValue = value.match(/^\d*\.?\d{0,2}$/) ? value : weight[productId];
    //     }

    //     const weightValue = parseFloat(validValue);
    //     if (weightValue < 0) return;

    //     let errorMessage = "";

    //     if (productCategory === 'Keerai' || productMeasurement === 'Grams') {
    //         if (weightValue > 10) errorMessage = "Piece count cannot exceed 10";
    //     } else if (productMeasurement === 'Box') {
    //         if (weightValue > 10) errorMessage = "Box count cannot exceed 10";
    //     } else if (weightValue > 5) {
    //         errorMessage = "Weight cannot exceed 5Kg";
    //     }

    //     setWeightError(prevErrors => ({ ...prevErrors, [productId]: errorMessage }));
    //     if (errorMessage) return;

    //     // Update weight and localStorage
    //     setWeight(prevWeights => ({ ...prevWeights, [productId]: weightValue }));
    //     const updatedItems = items.map(item =>
    //         item.product === productId ? { ...item, productWeight: weightValue } : item
    //     );
    //     setItems(updatedItems);
    //     localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    // };


    return (
        <Fragment>
            {/* <MetaData title={"Cart"} /> */}
            <MetaData
                title="Your Shopping Cart"
                description="Review the items in your shopping cart. Adjust quantities, remove products, or proceed to checkout for a seamless shopping experience."
            />
            <div style={{ display: 'flex', position: 'relative', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', top: '0px', width: '100%', zIndex: '990', height: '100px', marginBottom: '20px' }}>
                    {defaultAddress ? (
                        // <div className="row wrapper">
                        // <div className="col-12 col-lg-12 mt-10"  >
                        <div className="shadow-sm default-address">

                            <h5>Deliver To</h5>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ marginLeft: '20px' }}>
                                    <div>{defaultAddress.name}</div>
                                    <div>+91 {defaultAddress.phoneNo}</div>
                                    <div>{defaultAddress.formattedAddress}</div>
                                </div>

                                <Link to='/address'>Manage Address</Link>
                            </div>



                            {/* </div> */}
                        </div>
                        // </div>
                    ) : (
                        <div className="shadow-sm default-address">

                            <h5>Shipping Address</h5>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '5px' }}>

                                <button onClick={handelAddAddress} >+ Add Address</button>
                            </div>



                            {/* </div> */}
                        </div>
                    )}
                </div>
                <div>

                    {items && items.length === 0 ? (
                        <h2 className="cart_text mt-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', postion: 'relative', height: '20vh' }}>
                            Your Cart is Empty
                        </h2>
                    ) : (
                        <Fragment>
                            <div className="products_heading">Cart</div>
                            <div className="container cart-detail-container mt-5 " >
                                <div className="" >
                                    <h2 className="cart_text mt-5">Your Cart: <b>{items.length}</b></h2>
                                    <div className="updatetable-responsive">
                                        <table className="updatetable updatetable-bordered">
                                            <thead>
                                                <tr>
                                                    <th>S.No</th>
                                                    <th>Image</th>
                                                    <th>Name</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {items.map((item, index) => (

                                                    <tr key={item.product}>
                                                        <td>{index + 1}</td>
                                                        {/* <td>{capitalizeFirstLetter(item.name)} </td> */}
                                                        <td><img src={item.image} alt={item.name} height="45" width="65" /></td>
                                                        <td>{item && item.range ? `${capitalizeFirstLetter(item.name)} (${item.range})` : `${capitalizeFirstLetter(item.name)}`} </td>
                                                        <td>RS.{(item.price).toFixed(2)}</td>

                                                        {/* <td>{item.productWeight} ({item.measurement})</td> */}
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                                {/* <NumberInput
                                                            type="number"
                                                            min={item.measurement === 'Piece' || item.measurement === 'Box' ? "1" : "0.25"}
                                                            step={item.measurement === 'Piece' || item.measurement === 'Box' ? "1" : "0.01"}
                                                            value={item.productWeight}
                                                            onChange={(e) => handleWeightChange(item.product, e.target.value, item.measurement)}
                                                            onFocus={(e) => {
                                                                e.target.setAttribute('list', `weight-options-${item.product}`);
                                                            }}
                                                            onBlur={(e) => {
                                                                setTimeout(() => e.target.removeAttribute('list'), 100);
                                                            }}
                                                            className="form-select no-arrow-input form-control custom-placeholder"
                                                            list={`weight-options-${item.product}`} 
                                                            style={{   flex: '1 1 150px',
                                                            minWidth: '80px',
                                                            maxWidth: '100px' }}
                                                        /> */}
                                                                <NumberInput
                                                                    type="number"
                                                                    // min={item.measurement === 'Piece' || item.measurement === 'Box' ? "1" : "0.25"}
                                                                    // step={item.measurement === 'Piece' || item.measurement === 'Box' ? "1" : "0.01"}
                                                                    value={weight[item.product] || item.productWeight}
                                                                    onChange={(e) => handleWeightChange(item.product, e.target.value, item.category, item.measurement,item)}
                                                                    onFocus={(e) => {
                                                                        e.target.setAttribute('list', `weight-options-${item.product}`);
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        setTimeout(() => e.target.removeAttribute('list'), 100);
                                                                    }}
                                                                    className="responsive-weightChangeInput no-arrow-input"
                                                                    list={`weight-options-${item.product}`}
                                                                    style={{
                                                                        flex: '1 1 150px',
                                                                        minWidth: '80px',
                                                                        maxWidth: '100px'
                                                                    }}
                                                                />
                                                                <span style={{ whiteSpace: 'nowrap' }}>
                                                                    {item.measurement && item.measurement == 'Grams' ? 'Piece' : item.measurement}
                                                                </span>
                                                            </div>
                                                            <datalist id={`weight-options-${item.product}`}>
                                                                {item && item.measurement === 'Kg'
                                                                    ? [...Array(3).keys()].map(i => (                                
                                                                        <option key={i} value={(i + 1) * 0.5}></option>
                                                                    ))
                                                                    : [...Array(3).keys()].map(i => (
                                                                        <option key={i} value={i + 1}>{i + 1}</option>
                                                                    ))}
                                                            </datalist>
                                                            {weightError[item.product] && (
                                                                <div className="error-message">{weightError[item.product]}</div>
                                                            )}
                                                        </td>
                                                        
                                                        <td>Rs.{(item.price * item.productWeight).toFixed(2)}</td>
                                                        <td>
                                                            <i
                                                                id="delete_cart_item"
                                                                className="fa fa-trash btn btn-danger"
                                                                onClick={() => handleDeleteClick(item.product)}
                                                            ></i>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>
                                    </div>
                                    <div className="row justify-content-end">
                                            <div className="col-12 col-md-6 col-lg-4 my-4 d-flex justify-content-md-end align-items-center">
                                                <span style={{ marginRight: '10px' }}><b>Missed Something?</b> </span>
                                               <Link to ="/"> <button className="btn ms-2" style={{backgroundColor:'#02441E',color:'white'}}>+ Add more items</button> </Link>
                                            </div>
                                        </div>

                                    <div className="row" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <div className="col-12 col-lg-8 my-4 float-left">
                                <div id="order_summary">
                                    <h4>Delivery Offers<span><i className='fa fa-truck' style={{ paddingLeft: '20px' }}></i></span></h4>
                                    <hr />
                                    <p>50% discount on delivery for all orders above Rs.500</p>
                                    <hr />
                                    <p>Free delivery for all orders above Rs.1000</p>
                                </div>
                            </div> */}
                            
                                        <div className="col-12 col-lg-4 my-4">
                                            <div id="order_summary">
                                                <h4 className="cart_text">Cart Totals</h4>
                                                <hr />
                                                {/* <p>Subtotal:  <span className="order-summary-values">Rs.{subtotal}</span></p> */}
                                                <p>Subtotal: <span className="order-summary-values">Rs.{subtotal}</span></p>
                                                <p>Shipping: <span className="order-summary-values">Rs.{shippingCharge && shippingCharge.toFixed(2)}</span></p>
                                                <hr />
                                                <p>Total: <span className="order-summary-values">Rs.{total}</span></p>
                                                <hr />
                                                <button id="checkout_btn" className="btn btn-block" disabled={getshipping} onClick={checkOutHandler}>
                                                    {getshipping ? <LoaderButton fullPage={false} size={20} /> : (
                                                        <span>Check Out</span>
                                                    )
                                                    }

                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {showModal && (
                                <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Confirm Delete</h5>
                                                <button type="button" className="close" onClick={handleCancelDelete}>
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <p>Are you sure you want to delete this item?</p>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>OK</button>
                                                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    )}
                </div>
            </div>


            {/* {defaultAddress && (
             
                    <div className="default-address">
                        <h5>Default Shipping Address</h5>
                        <p>{defaultAddress.name}</p>
                        <p>{defaultAddress.formattedAddress}</p>
                        <Link to="/manage-address" className="btn btn-link">Manage Address</Link>
                    </div>


            )} */}

        </Fragment>
    );
};

const modalStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)'
};

export default Cart;
