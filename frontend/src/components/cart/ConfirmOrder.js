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

const ConfirmOrder = () => {
    const dispatch = useDispatch();
    const { loading: orderloading, orderDetail, error } = useSelector(state => state.orderState);
    const { shippingInfo, items: cartItems } = useSelector(state => state.cartState);
    const { user } = useSelector(state => state.authState);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const shippingCharge = 30.0;
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.productWeight, 0).toFixed(2);
    const total = (parseFloat(subtotal) + shippingCharge).toFixed(2);
    // console.log(total)

    const initPayment = async (data) => {
        // try {
        //     const response = await axios.post('http://localhost:5000/initiateJuspayPayment');
        //     const result = response.data.sessionResponse;
        //        console.log(result)
        //     if (result && result.payment_links && result.payment_links.web) {
        //         window.open(result.payment_links.web, '_blank');
        //     } else {
        //         alert('Failed to initiate payment: ' + (result.message || 'Unknown error'));
        //     }
        // } catch (error) {
        //     console.error('Error initiating payment:', error);
        //     alert('Error initiating payment: ' + error.message);
        // }

        if (data && data.payment_links && data.payment_links.web) {
                    // window.open(data.payment_links.web, '_blank');
                    window.location.href = data.payment_links.web;

                } else {
                    alert('Failed to initiate payment: ' + (data.message || 'Unknown error'));
                }
    };

    const processPayment = async () => {
        setLoading(true);
        const reqdata = {
            subtotal,
            shippingCharge,
            total,
            shippingInfo,
            user
        };
        console.log(reqdata);
        sessionStorage.setItem('orderInfo', JSON.stringify(reqdata));
        try {
            const orderUrl = '/api/v1/payment/orders';
            const {data} = await axios.post(orderUrl, reqdata, { withCredentials: true });
            console.log(data)
            if (data && data.sessionResponse && data.sessionResponse.id) {
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
                    paymentStatus:data.sessionResponse.status
                };
                dispatch(createOrder(order));
            } else {
                toast.error('Failed to Create the Order');
            }
            setLoading(false);
            if (data && data.sessionResponse) {
                initPayment(data.sessionResponse);
            }
        } catch (error) {
            console.log(error);
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
    }, [shippingInfo, navigate, error]);

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
                            <p><b>Name:</b> {user.name}</p>
                            <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                            <p className="mb-4"><b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.state}, ${shippingInfo.country}`}</p>
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
                                <p>Shipping: <span className="order-summary-values">Rs.{shippingCharge.toFixed(2)}</span></p>
                                <hr />
                                <p>Total: <span className="order-summary-values">Rs.{total}</span></p>
                                <hr />
                                <button id="checkout_btn" className="btn btn-primary btn-block" onClick={processPayment} disabled={loading}>
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default ConfirmOrder;
