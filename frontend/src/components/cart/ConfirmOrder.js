import React, { Fragment, useEffect, useState } from 'react';
import MetaData from '../Layouts/MetaData';
// import { validateShipping } from './Shipping';
import { Link, useNavigate } from 'react-router-dom';
import StepsCheckOut from './StepsCheckOut';
import axios from 'axios';
import { Slide, toast } from 'react-toastify';
import Loader from '../Layouts/Loader'; // Ensure this path is correct based on your project structure
import { createOrder } from '../../actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';
import { orderCompleted } from '../../slices/cartSlice';
import { useLocation } from 'react-router-dom';
import { loadUser } from '../../actions/userActions';
import store from '../../store';
import { getProducts } from '../../actions/productsActions';
import CryptoJS from 'crypto-js';
import LoaderButton from '../Layouts/LoaderButton';
import { getAnnouncements } from '../../actions/announcementAction';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes, addDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



const ConfirmOrder = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const {
        shippingCharge = 0,
        defaultAddress = null,
        subtotal = 0,
        total = 0,
        items = [] } = location.state || {};
    // sessionStorage.setItem('redirectPath', location.pathname);
    // const { loading: orderLoading, orderDetail, error } = useSelector(state => state.orderState);
    // const {items: cartItems } = useSelector(state => state.cartState);
    const [cartItems, setItems] = useState(() => {
        return JSON.parse(localStorage.getItem("cartItems")) || [];
    });
    const { user } = useSelector(state => state.authState);
    console.log("user", user)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [OrderedDateUF, setOrderedDateUF] = useState(null);
    const [OrderedDate, setOrderedDate] = useState(null);
    console.log("OrderedDate", OrderedDate)
    console.log("OrderedDateUF", OrderedDateUF)
    console.log("deliveryDate", deliveryDate)

    // const [shippingAmount, setShippingAmount] = useState(null);
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get('message');
    const [showModal, setShowModal] = useState(false);
    const [orderDescription, setOrderDescription] = useState('');
    const {
        getAnnouncement,
        getAnnouncementLoading
    } = useSelector(state => state.announcementState);
    console.log("getAnnouncement", getAnnouncement)
    console.log("orderDescription", orderDescription)
    const [disabledDates, setDisabledDates] = useState([]);
    useEffect(() => {
        if (!getAnnouncement) {
            dispatch(getAnnouncements())
        }
    }, [])


    useEffect(() => {
        if (!defaultAddress && !shippingCharge) {

            navigate('/cart');
        }
        if (!cartItems.length) {
            toast.dismiss();
            setTimeout(() => {
                toast.error('Cart is empty. Please add at least one item to proceed! ', {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
            navigate('/cart');
        }
    }, [defaultAddress, shippingCharge, cartItems, navigate]);

    const initPayment = async (data) => {
        if (data && data.payment_links && data.payment_links.web) {
            window.location.href = data.payment_links.web;
            // setLoading(false);
            // window.open(data.payment_links.web, '_blank');
        } else {
            alert('Failed to initiate payment: ' + (data.message || 'Unknown error'));
            setLoading(false);
        }
    };

    // Encryption key - ensure you keep this secure and do not expose it in the frontend
    const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;
    const staticKeys = [
        process.env.REACT_APP_ENCRYPTION_KEY_1,
        process.env.REACT_APP_ENCRYPTION_KEY_2,
        process.env.REACT_APP_ENCRYPTION_KEY_3,
        process.env.REACT_APP_ENCRYPTION_KEY_4,
        process.env.REACT_APP_ENCRYPTION_KEY_5,
        process.env.REACT_APP_ENCRYPTION_KEY_6,
        process.env.REACT_APP_ENCRYPTION_KEY_7,
        process.env.REACT_APP_ENCRYPTION_KEY_8,
        process.env.REACT_APP_ENCRYPTION_KEY_9,
        process.env.REACT_APP_ENCRYPTION_KEY_10
    ];


    const processPayment = async () => {
        setLoading(true);
        const randomKey = staticKeys[Math.floor(Math.random() * staticKeys.length)];
        const encryptData = (data, randomKey) => {
            return CryptoJS.AES.encrypt(data.toString(), randomKey).toString();
        };
        const generateSignature = (data, randomKey) => {
            return CryptoJS.HmacSHA256(data, randomKey).toString();
        };
        const encryptedItemsPrice = encryptData(subtotal, randomKey);
        const encryptedShippingPrice = encryptData(shippingCharge, randomKey);
        const encryptedTotalPrice = encryptData(total, randomKey);
        const signature = generateSignature(`${subtotal}${shippingCharge}${total}`, randomKey);
        // Encrypt the selected random key with your master encryption key
        const plainText = CryptoJS.AES.encrypt(randomKey, encryptionKey).toString();

        const reqdata = {
            shippingInfo: defaultAddress && defaultAddress,
            user,
            user_id: user._id,
            cartItems,
            itemsPrice: encryptedItemsPrice,
            taxPrice: 0.0,
            shippingPrice: encryptedShippingPrice,
            totalPrice: encryptedTotalPrice,
            signature,
            plainText,
            OrderedDate,
            orderDescription,
        };

        sessionStorage.setItem('orderInfo', JSON.stringify(reqdata));

        try {
            const orderUrl = '/api/v1/payment/orders';
            const { data } = await axios.post(orderUrl, reqdata, { withCredentials: true });
            console.log("response data", data.sessionResponse)
            if (data && data.sessionResponse) {
                const order = {
                    order_id: data.sessionResponse.order_id,
                    user_id: user._id,
                    user: user,
                    cartItems,
                    shippingInfo: defaultAddress && defaultAddress,
                    itemsPrice: parseFloat(subtotal),
                    taxPrice: 0.0,
                    shippingPrice: parseFloat(shippingCharge),
                    totalPrice: parseFloat(total),
                    paymentStatus: data.sessionResponse.status
                };

                dispatch(createOrder(order));
            } else {
                // toast.error('Failed to Create the Order');
                toast.dismiss();
                setTimeout(() => {
                    toast.error('Failed to Create the Order', {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
            }

            if (data && data.sessionResponse) {
                const payloadAmount = parseFloat(data.sessionResponse.sdk_payload.payload.amount).toFixed(2);
                const totalAmount = parseFloat(total).toFixed(2);

                if (payloadAmount === totalAmount) {
                    initPayment(data.sessionResponse);
                } else {
                    // toast.error('Mismatch initial Amount, possible data tampering detected');
                    toast.dismiss();
                    setTimeout(() => {
                        toast.error('Mismatch initial Amount, possible data tampering detected', {
                            position: 'bottom-center',
                            type: 'error',
                            autoClose: 700,
                            transition: Slide,
                            hideProgressBar: true,
                            className: 'small-toast',
                        });
                    }, 300);
                    setLoading(false);
                }
            }
        } catch (error) {
            // console.log(error)
            if (error && error.response && error.response.data && error.response.data.message) {
                // toast.error(error && error.response.data.message)
                toast.dismiss();
                setTimeout(() => {
                    toast.error(error && error.response.data.message, {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
            }
            setLoading(false);
            setShowModal(false);
        }
    };
    // const handelopenModal = () => {
    //     const currentDate = new Date();
    //     const currentHour = currentDate.getHours();
    //     let orderDate;
    //     let orderDescription;
    //     if (currentHour < 21) { // Before 9 PM
    //         orderDate = new Date(currentDate);
    //         orderDate.setDate(orderDate.getDate() + 1); // Next day
    //         setOrderDescription(`The order will be delivered on : ${orderDate.toDateString()}`);
    //     } else { // After 9 PM
    //         orderDate = new Date(currentDate);
    //         orderDate.setDate(orderDate.getDate() + 2); // Day after tomorrow
    //         setOrderDescription(`The order will be delivered on : ${orderDate.toDateString()}`);
    //     }

    //     setShowModal(true);
    // };

    // const handelopenModal = (getAnnouncement) => {
    //     const currentDate = new Date();
    //     const currentHour = currentDate.getHours();
    //     let orderDate;

    //     // Determine initial delivery date
    //     if (currentHour < 21) {
    //         orderDate = new Date(currentDate);
    //         orderDate.setDate(orderDate.getDate() + 1); // Next day
    //     } else {
    //         orderDate = new Date(currentDate);
    //         orderDate.setDate(orderDate.getDate() + 2); // Day after tomorrow
    //     }

    //     // Function to check if the date falls within a leave period
    //     const isWithinLeaveDate = (date) => {
    //         return getAnnouncement.some(({ startDate, endDate }) => {
    //             const leaveStart = new Date(startDate);
    //             const leaveEnd = new Date(endDate);
    //             return date >= leaveStart && date <= leaveEnd;
    //         });
    //     };

    //     // Adjust delivery date if it falls within leave dates
    //     while (isWithinLeaveDate(orderDate)) {
    //         orderDate.setDate(orderDate.getDate() + 1); // Move to next day
    //     }

    //     // Set the description with the adjusted date
    //     setOrderDescription(`The order will be delivered on: ${orderDate.toDateString()}`);
    //     setShowModal(true);
    // };



    useEffect(() => {
        const formatDateToCustomFormat = (OrderedDateUF) => {
            // // e.preventDefault();
            // const isoString = OrderedDateUF.toISOString(); // Converts to "2024-12-09T00:00:00.000Z"

            // // Replace the 'Z' with the required offset (you can manually set it to "+00:00")
            // const formattedDate = isoString.replace('Z', '+00:00');

            // return formattedDate;
            const year = OrderedDateUF.getFullYear();
        const month = String(OrderedDateUF.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(OrderedDateUF.getDate()).padStart(2, '0');
        const hours = String(OrderedDateUF.getHours()).padStart(2, '0');
        const minutes = String(OrderedDateUF.getMinutes()).padStart(2, '0');
        const seconds = String(OrderedDateUF.getSeconds()).padStart(2, '0');

        // Create a custom format similar to ISO without altering timezone
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;
        };
        if (OrderedDateUF) {
            setOrderedDate(formatDateToCustomFormat(OrderedDateUF))
        }
    }, [OrderedDateUF])

    const handelopenModal = (getAnnouncement) => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        let orderDate;

        // Determine initial delivery date
        if (currentHour < 21) {
            orderDate = new Date(currentDate);
            orderDate.setDate(orderDate.getDate() + 1); // Next day
        } else {
            orderDate = new Date(currentDate);
            orderDate.setDate(orderDate.getDate() + 2); // Day after tomorrow
        }

        console.log(`Initial orderDate: ${orderDate.toDateString()}`);

        // Function to reset the time to 00:00:00 for accurate date comparison
        const resetTime = (date) => {
            const resetDate = new Date(date);
            resetDate.setHours(0, 0, 0, 0); // Set time to midnight
            return resetDate;
        };

        // Function to check if the date falls within a leave period
        const isWithinLeaveDate = (date) => {
            let isLeave = false;
            getAnnouncement && getAnnouncement.forEach(({ startDate, endDate,type }) => {
                if(type ==='Announcement'){
                    const leaveStart = resetTime(new Date(startDate));
                    const leaveEnd = resetTime(new Date(endDate));
                    const checkDate = resetTime(date); // Reset the time of the check date
    
                    console.log(`Checking date ${checkDate.toDateString()} against leave period: ${leaveStart.toDateString()} to ${leaveEnd.toDateString()}`);
    
                    if (checkDate >= leaveStart && checkDate <= leaveEnd) {
                        isLeave = true;
                    }
                }

                
            });
            return isLeave;
        };

        // Check if orderDate is within leave periods and log the result
        console.log(`Is the initial orderDate (${orderDate.toDateString()}) within leave date? ${isWithinLeaveDate(orderDate)}`);

        // Adjust delivery date if it falls within leave periods
        while (isWithinLeaveDate(orderDate)) {
            console.log(`Order date ${orderDate.toDateString()} is within a leave period.`);

            const conflictingLeave = getAnnouncement && getAnnouncement.find(({ startDate, endDate }) => {
                const leaveStart = resetTime(new Date(startDate));
                const leaveEnd = resetTime(new Date(endDate));
                const checkDate = resetTime(orderDate);

                return checkDate >= leaveStart && checkDate <= leaveEnd;
            });

            if (conflictingLeave) {
                const leaveEnd = new Date(conflictingLeave.endDate);
                leaveEnd.setHours(0, 0, 0, 0); // Set leaveEnd time to midnight for consistency

                console.log(`Conflicting leave period ends on: ${leaveEnd.toDateString()}`);

                // Skip to the day after the conflicting leave's `endDate`
                if (orderDate.getDate() === leaveEnd.getDate() && orderDate.getMonth() === leaveEnd.getMonth() && orderDate.getFullYear() === leaveEnd.getFullYear()) {
                    // If the orderDate is the same as leaveEnd, move it to the next day
                    orderDate = new Date(leaveEnd);
                    orderDate.setDate(orderDate.getDate() + 1); // Skip to the day after

                    console.log(`Adjusted orderDate due to same date as leaveEnd: ${orderDate.toDateString()}`);
                } else {
                    // Regular case: just skip to the day after leaveEnd
                    orderDate = new Date(leaveEnd);
                    orderDate.setDate(orderDate.getDate() + 1); // Skip to the day after
                }
            }
        }



        console.log(`Final orderDate: ${orderDate.toDateString()}`);
        // const formattedOrderDate = formatDateToCustomFormat(orderDate);
        setOrderedDateUF(orderDate);

        // Set the description with the adjusted date
        setOrderDescription(`The order will be delivered on: ${orderDate.toDateString()}`);
        setShowModal(true);
    };







    const handleCancelModal = () => {
        setShowModal(false);
    }

    useEffect(() => {
        // if (shippingInfo) {
        //     validateShipping(shippingInfo, navigate);
        // }
        // if (error) {
        //     toast.error(error);
        // }
        if (message) {
            // toast.error(message, { position: "bottom-center" });
            toast.dismiss();
            setTimeout(() => {
                toast.error(message, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
        }
    }, [navigate, message]);

    const capitalizeFirstLetter = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const openModalWithValidation = () => {
        handelopenModal(getAnnouncement && getAnnouncement);
    };


    // Dynamically calculate disabled date intervals
    // useEffect(() => {
    //     const disabled = getAnnouncement && getAnnouncement.map((announcement) => ({
    //         start: startOfDay(new Date(announcement.startDate)), // Start of the day for startDate
    //         end: endOfDay(new Date(announcement.endDate)), // End of the day for endDate
    //     }));
    //     setDisabledDates(disabled);
    // }, []);
    useEffect(() => {
        const disabled = getAnnouncement && getAnnouncement.map((announcement) => {
            if (announcement.type === 'Announcement') {
                return {
                    start: startOfDay(new Date(announcement.startDate)), // Start of the day for startDate
                    end: endOfDay(new Date(announcement.endDate)), // End of the day for endDate
                };
            }
            return null; // Optional, if you want to filter out non-matching announcements
        }).filter(item => item !== null); // Optional: to remove `null` values
    
        setDisabledDates(disabled);
    }, []);
    

    // Calculate tomorrow's date and 14 days from tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Tomorrow

    const maxDate = addDays(tomorrow, 13); // 14 days from tomorrow

    // Disable dates between announcement's start and end date (inclusive)
    const isDisabledDate = (date) => {
        const currentDate = startOfDay(date); // Strip time for comparison
        return disabledDates.some(({ start, end }) =>
            isWithinInterval(currentDate, { start, end })
        );
    };

    // Separate handler for delivery date changes
    const handleDeliveryDate = (date) => {
        // Adjust the time for 12:00 PM
        const adjustedDate = setHours(setMinutes(date, 0), 12);
        console.log("adjustedDate", adjustedDate)
        setDeliveryDate(adjustedDate);
        setOrderedDateUF(adjustedDate);
        const formattedDate = adjustedDate.toDateString();
        setOrderDescription(`The order will be delivered on: ${formattedDate}`);

    };

    return (
        <Fragment>
            {/* { shippingAmount ? ( */}
            <Fragment>
                {/* <MetaData title="Confirm Order" /> */}
                <MetaData
                    title="Confirm Your Order"
                    description="Verify your order details before finalizing your purchase. Review your selected items, shipping information, and total cost before confirming."
                />

                <div className="products_heading">Confirm Order</div>
                <div className="back-button" onClick={() => navigate(-1)}>
                    <ArrowBackIcon fontSize="small" />
                    <span>Back</span>
                </div>
                <StepsCheckOut shipping confirmOrder />
                <div className="container confirm-order-container">
                    {/* {!shippingAmount ? <div style={{ marginTop: '4rem' }}>
                        <Loader />
                    </div> : ( */}
                    <div className="row justify-content-center">
                        <div className="col-10 col-md-10 col-lg-8 order-confirm" id='order_summary'>
                            <h4 className="mb-3 confirmorder_title">Shipping Info</h4>
                            <div className="confirmorder_name"><b>Name:</b> {defaultAddress && defaultAddress.name}</div>
                            <div className="confirmorder_phone"><b>Phone:</b> {defaultAddress && defaultAddress.phoneNo}</div>
                            {/* <p className="mb-4"><b>Address:</b> {`${shippingInfo.address},${shippingInfo.landmark},${shippingInfo.area}, ${shippingInfo.city}- ${shippingInfo.postalCode}`}</p> */}
                            {
                                defaultAddress && (
                                    <div className="mb-4 address-formatted confirmorder_address">
                                        <b>Address:</b>
                                        {defaultAddress.address && `${defaultAddress.address},`}
                                        {defaultAddress.area && `${defaultAddress.area},`}
                                        {defaultAddress.landmark && `${defaultAddress.landmark},`}
                                        {defaultAddress.city && `${defaultAddress.city}`}
                                        {defaultAddress.postalCode && `-${defaultAddress.postalCode}`}
                                    </div>
                                )
                            }

                            <hr />
                            <h4 className="mt-4 confirmorder_title">Your Cart Items:</h4>
                            <hr />
                            {cartItems && cartItems.map(item => (
                                <Fragment key={item.product}>
                                    <div className="cart-item my-1">
                                        <div className="row">
                                            <div className="col-4 col-lg-2">
                                                <img src={item.image} alt={item.name} height="45" width="65" />
                                            </div>
                                            {/* <div className="col-4 col-lg-4">
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </div> */}
                                            <div className="col-4 col-lg-4 confirmorder_name">
                                                {/* <Link to={/product/${item.product}}>{item.name}</Link> */}
                                                {item && item.range ? `${capitalizeFirstLetter(item.name)} (${item.range})` : `${capitalizeFirstLetter(item.name)}`}
                                            </div>
                                            <div className="col-4 col-lg-5 confirmorder_price">
                                                <div>{item.productWeight} x Rs.{item.price} = <b>Rs.{(item.productWeight * item.price).toFixed(2)}</b></div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </Fragment>
                            ))}
                        </div>
                        <div className="col-10 col-md-10  col-lg-3 my-4">
                            <div id="order_summary">
                                <h4 className="confirmorder_title">Order Summary</h4>
                                <hr />
                                <p className="confirmorder_name">Subtotal: <span className="order-summary-values">Rs.{subtotal}</span></p>
                                <p className="confirmorder_name">Shipping: <span className="order-summary-values">Rs.{shippingCharge && shippingCharge.toFixed(2)}</span></p>
                                <hr />
                                <p className="confirmorder_name">Total: <span className="order-summary-values">Rs.{total}</span></p>
                                <p className="confirmorder_name" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                                    (Inclusive of all taxes)
                                </p>
                                <hr />
                                {shippingCharge ? (
                                    <button id="checkout_btn" className="btn btn-primary btn-block" onClick={openModalWithValidation} disabled={loading}>
                                        {loading ? <LoaderButton fullPage={false} size={20} /> : (
                                            <span>  Proceed to Payment</span>
                                        )

                                        }
                                        {/* Proceed to Payment */}
                                    </button>
                                ) : (
                                    <button id="checkout_btn" className="btn btn-block" disabled>
                                        Proceed to Payment
                                    </button>
                                )}
                                {showModal && (
                                    <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Confirm Order</h5>
                                                    {
                                                        !loading ? (
                                                            <button type="button" className="close" onClick={handleCancelModal} disabled={loading}>
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        ) : <></>
                                                    }

                                                </div>
                                                <div className="modal-body">
                                                    <p>{orderDescription && orderDescription}</p>
                                                    <div style={{ display: 'flex', flexDirection: 'row', marginRight: '20px' }}>
                                                        <label htmlFor="deliveryDate" style={{ marginRight: '10px' }}> Select Delivery Date:</label>
                                                        <DatePicker
                                                            selected={deliveryDate}
                                                            onChange={handleDeliveryDate}
                                                            dateFormat="dd/MM/yyyy"
                                                            className="form-control date-input"
                                                            placeholderText="dd/mm/yyyy"
                                                            minDate={tomorrow}
                                                            maxDate={maxDate}
                                                            filterDate={(date) => !isDisabledDate(date)}

                                                        />
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" onClick={handleCancelModal} disabled={loading}>Cancel</button>
                                                    <button type="button" className="btn btn-success" onClick={processPayment} disabled={loading}>
                                                        {loading ? <LoaderButton fullPage={false} size={20} /> : (
                                                            <span>  Continue</span>
                                                        )

                                                        }

                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                    {/* )} */}
                </div>
            </Fragment>
            {/* ) : (
            <div className="container" style={{minHeight:'25vh'}}>
        <Loader/>
        </div>
        )

        } */}
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

export default ConfirmOrder;
