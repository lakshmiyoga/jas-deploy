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
        // lat: 12.947146336879577,
        // lng: 77.62102993895199
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
                const response = await axios.post('/api/v1/get-quote', requestData);
                console.log("getQuote Response", response.data)
                if(response && response.data && response.data.vehicles[3] && response.data.vehicles[3].fare)
                setShippingAmount(response.data.vehicles[3].fare.minor_amount)
                //    toast.error('Response:', response.data);
                // Handle response as needed
            } catch (error) {
                console.log(error)
                toast.error(error.response.data.message);
                // Handle error as needed
            }
        }
        if (user) {
            fetchdata()
        }

    }, [])
    useEffect(() => {
        if (!shippingInfo || !cartItems.length) {
            navigate('/shipping');
        }
    }, [shippingInfo, cartItems, navigate]);

    const initPayment = async (data) => {
        if (data && data.payment_links && data.payment_links.web) {
            window.location.href = data.payment_links.web;
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
        const encryptData = (data,randomKey) => {
            return CryptoJS.AES.encrypt(data.toString(), randomKey).toString();
        };
        const generateSignature = (data,randomKey) => {
            return CryptoJS.HmacSHA256(data, randomKey).toString();
        };
        const encryptedItemsPrice = encryptData(subtotal,randomKey);
        const encryptedShippingPrice = encryptData(shippingCharge,randomKey);
        const encryptedTotalPrice = encryptData(total,randomKey);
        const signature = generateSignature(`${subtotal}${shippingCharge}${total}`,randomKey);
         // Encrypt the selected random key with your master encryption key
         const plainText = CryptoJS.AES.encrypt(randomKey, encryptionKey).toString();

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
            plainText,
        };

        sessionStorage.setItem('orderInfo', JSON.stringify(reqdata));

        try {
            const orderUrl = '/api/v1/payment/orders';
            const { data } = await axios.post(orderUrl, reqdata, { withCredentials: true });
            console.log("response data",data.sessionResponse)
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
                const payloadAmount = parseFloat(data.sessionResponse.sdk_payload.payload.amount).toFixed(2);
                const totalAmount = parseFloat(total).toFixed(2);
            
                if (payloadAmount === totalAmount) {
                    initPayment(data.sessionResponse);
                } else {
                    toast.error('Mismatch initial Amount, possible data tampering detected');
                    setLoading(false);
                }
            }
        } catch (error) {
            // console.log(error)
            if(error && error.response && error.response.data  && error.response.data.message){
                toast.error(error && error.response.data.message)
             }
            setLoading(false);
        }
    };

    
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
                                    <button id="checkout_btn" className="btn btn-block" disabled>
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
