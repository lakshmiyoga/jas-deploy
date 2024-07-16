import React, { Fragment, useEffect, useState } from 'react';
import MetaData from '../Layouts/MetaData';
import { validateShipping } from './Shipping';
import { Link, useNavigate } from 'react-router-dom';
import StepsCheckOut from './StepsCheckOut';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../Layouts/Loader'; // Ensure this path is correct based on your project structure
import { createOrder } from '../../actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';
import { orderCompleted } from '../../slices/cartSlice';
import { useLocation } from 'react-router-dom';
import { loadUser } from '../../actions/userActions';
import store from '../../store';
import { getProducts } from '../../actions/productsActions';
import CryptoJS from 'crypto-js';


const ConfirmOrder = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        store.dispatch(loadUser());
        store.dispatch(getProducts());
    }, []);
    const { loading: orderLoading, orderDetail, error } = useSelector(state => state.orderState);
    const { shippingInfo, items: cartItems } = useSelector(state => state.cartState);
    const { user } = useSelector(state => state.authState);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [shippingAmount, setShippingAmount] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get('message');

    // console.log("shippingAmount",shippingAmount)
    const shippingCharge = shippingAmount / 100;
    console.log("shippingCharge", shippingCharge)
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.productWeight, 0).toFixed(2);
    const total = (parseFloat(subtotal) + shippingCharge).toFixed(2);

    const [pickupDetails, setPickupDetails] = useState({
        lat: 12.935025018880504,
        lng: 77.6092605236106
    });

    const [dropDetails, setDropDetails] = useState({
        lat: shippingInfo && shippingInfo.latitude && shippingInfo.latitude,
        lng: shippingInfo && shippingInfo.longitude && shippingInfo.longitude
    });

    const [customerDetails, setCustomerDetails] = useState({
        name: user && user.name && user.name,
        countryCode: '+91',
        phoneNumber: shippingInfo.phoneNo
    });
    // console.log(latitude,longitude)
    useEffect(() => {
        setCustomerDetails({
            name: user && user.name && user.name,
            countryCode: '+91',
            phoneNumber: shippingInfo.phoneNo
        })
    }, [user])

    useEffect(() => {
        const fetchdata = async () => {

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
            console.log(requestData)
            try {
                const response = await axios.post('/api/v1/get-quote', requestData, { withCredentials: true });
                console.log("getQuote Response", response.data)
                setShippingAmount(response.data.vehicles[3].fare.minor_amount)
                //    toast.error('Response:', response.data);
                // Handle response as needed
            } catch (error) {
                toast.error('Error sending data:', error.message);
                // Handle error as needed
            }
        }
        if (user) {
            fetchdata()
        }

    }, [pickupDetails,dropDetails,customerDetails])

    useEffect(() => {
        if (!shippingInfo || !cartItems.length) {
            navigate('/shipping');
        }
    }, [shippingInfo, cartItems, navigate]);

    const initPayment = async (data) => {
        if (data && data.payment_links && data.payment_links.web) {
            window.location.href = data.payment_links.web;
            // window.open(data.payment_links.web, '_blank');
            // setLoading(false);
        } else {
            alert('Failed to initiate payment: ' + (data.message || 'Unknown error'));
            setLoading(false);
        }
    };

    // Encryption key - ensure you keep this secure and do not expose it in the frontend
    const encryptionKey = 'Jas@12345#';

    const encryptData = (data) => {
        return CryptoJS.AES.encrypt(data.toString(), encryptionKey).toString();
    };

    const generateSignature = (data) => {
        console.log("generateSignature", data)
        return CryptoJS.HmacSHA256(data, encryptionKey).toString();
    };


    const processPayment = async () => {
        setLoading(true);
        const encryptedItemsPrice = encryptData(subtotal);
        const encryptedShippingPrice = encryptData(shippingCharge);
        const encryptedTotalPrice = encryptData(total);
        const signature = generateSignature(`${subtotal}${shippingCharge}${total}`);
        // console.log("encrypt data",encryptedItemsPrice,encryptedShippingPrice,encryptedTotalPrice)
        console.log("signature", signature)

        const reqdata = {
            shippingInfo,
            user,
            user_id: user._id,
            cartItems,
            itemsPrice: encryptedItemsPrice,
            taxPrice: 0.0,
            shippingPrice: encryptedShippingPrice,
            totalPrice: encryptedTotalPrice,
            signature,
        };

        sessionStorage.setItem('orderInfo', JSON.stringify(reqdata));

        try {
            const orderUrl = '/api/v1/payment/orders';
            const { data } = await axios.post(orderUrl, reqdata, { withCredentials: true });
console.log("data", data)
            if (data && data.sessionResponse) {
                const order = {
                    order_id: data.sessionResponse.order_id,
                    user_id: user._id,
                    user: user,
                    cartItems,
                    shippingInfo,
                    itemsPrice: parseFloat(subtotal),
                    taxPrice: 0.0,
                    shippingPrice: parseFloat(shippingCharge),
                    totalPrice: parseFloat(total),
                    paymentStatus: data.sessionResponse.status
                };

                dispatch(createOrder(order));
            } else {
                toast.error('Failed to Create the Order');
            }

            if (data && data.sessionResponse) {
                if(data && data.sessionResponse && data.sessionResponse.sdk_payload && data.sessionResponse.sdk_payload.payload && data.sessionResponse.sdk_payload.payload.amount === total){
                    initPayment(data.sessionResponse);
                }else{
                    toast.error('Mismatch initial Amount, possible data tampering detected');
                }
                
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // const processPayment = async () => {
    //     setLoading(true);
    //     const reqdata = {
    //         shippingInfo,
    //         user,
    //         user_id: user._id,
    //         cartItems,
    //         itemsPrice: parseFloat(subtotal),
    //         taxPrice: 0.0,
    //         shippingPrice: parseFloat(shippingCharge),
    //         totalPrice: parseFloat(total),
    //     };
    //     sessionStorage.setItem('orderInfo', JSON.stringify(reqdata));
    //     try {
    //         const orderUrl = '/api/v1/payment/orders';
    //         const { data } = await axios.post(orderUrl, reqdata, { withCredentials: true });
    //         if (data && data.sessionResponse) {
    //             const order = {
    //                 order_id: data.sessionResponse.order_id,
    //                 user_id: user._id,
    //                 user: user,
    //                 cartItems,
    //                 shippingInfo,
    //                 itemsPrice: parseFloat(subtotal),
    //                 taxPrice: 0.0,
    //                 shippingPrice: parseFloat(shippingCharge),
    //                 totalPrice: parseFloat(total),
    //                 paymentStatus: data.sessionResponse.status
    //             };
    //             dispatch(createOrder(order));
    //         } else {
    //             toast.error('Failed to Create the Order');
    //         }
    //         setLoading(false);
    //         if (data && data.sessionResponse) {
    //             initPayment(data.sessionResponse);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        if (shippingInfo) {
            validateShipping(shippingInfo, navigate);
        }
        if (error) {
            toast.error(error);
        }
        if (message) {
            toast.error(message, { position: "bottom-center" });
        }
    }, [shippingInfo, navigate, error, message]);

    return (
        <Fragment>
            <MetaData title="Confirm Order" />
            <div className="products_heading">Confirm Order</div>
            <StepsCheckOut shipping confirmOrder />
            <div className="container confirm-order-container">
                {loading ? <Loader /> : (
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-8 mt-5 order-confirm" id='order_summary'>
                            <h4 className="mb-3">Shipping Info</h4>
                            <p><b>Name:</b> {user && user.name}</p>
                            <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                            <p className="mb-4"><b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}- ${shippingInfo.postalCode}`}</p>
                            <hr />
                            <h4 className="mt-4">Your Cart Items:</h4>
                            <hr />
                            {cartItems.map(item => (
                                <Fragment key={item.product}>
                                    <div className="cart-item my-1">
                                        <div className="row">
                                            <div className="col-4 col-lg-2">
                                                <img src={item.image} alt={item.name} height="45" width="65" />
                                            </div>
                                            <div className="col-4 col-lg-4">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </div>
                                            <div className="col-4 col-lg-5">
                                                <p>{item.productWeight} x Rs.{item.price} = <b>Rs.{(item.productWeight * item.price).toFixed(2)}</b></p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </Fragment>
                            ))}
                        </div>
                        <div className="col-12 col-lg-3 my-4">
                            <div id="order_summary">
                                <h4>Order Summary</h4>
                                <hr />
                                <p>Subtotal: <span className="order-summary-values">Rs.{subtotal}</span></p>
                                <p>Shipping: <span className="order-summary-values">Rs.{shippingCharge && shippingCharge.toFixed(2)}</span></p>
                                <hr />
                                <p>Total: <span className="order-summary-values">Rs.{total}</span></p>
                                <hr />
                                {shippingCharge ? (
                                    <button id="checkout_btn" className="btn btn-primary btn-block" onClick={processPayment} disabled={loading}>
                                        Proceed to Payment
                                    </button>
                                ) : (
                                    <button id="checkout_btn" className="btn btn-primary btn-block" disabled>
                                        Proceed to Payment
                                    </button>
                                )}

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default ConfirmOrder;
