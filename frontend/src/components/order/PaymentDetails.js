import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import  Loader from '../Layouts/MetaData';
import {orderDetail as orderDetailAction } from '../../actions/orderActions';
import axios from 'axios';
import PaymentConfirm from './PaymentConfirm';
export default function PaymentDetails () {
    const { orderDetail, loading } = useSelector(state => state.orderState)
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const { shippingInfo={}, user={}, orderStatus="Processing", orderItems=[], totalPrice=0, paymentInfo={} } = orderDetail;
    const isPaid = paymentInfo && paymentInfo.status === "succeeded" ? true: false;
    const dispatch = useDispatch();
    const {id } = useParams();
    const [payment,setPayment] = useState(null)
    console.log(orderDetail)
       
    useEffect(() => {
        dispatch(orderDetailAction(id));
       
        // async function fetchdata(){
        //     const url =` /api/v1/handleJuspayResponse/${id}`;
        //     const {data} = await  axios.get(url,{ withCredentials: true });
        //     // console.log(data)
        //     if(data){
        //         setPayment(data.statusResponse);
        //     }
        // }
        // fetchdata()
        
    },[id])
    return (
        <Fragment>
            {   loading ? <Loader/> :
                <Fragment>
                    <div className="products_heading">Order Details</div>
                    <div className="container ">
                    
                    <div className="row d-flex justify-content-between" id='order_summary'>
                        <div className="col-12 col-lg-12 mt-5 order-details">
    
                            <h1 className="my-5">Order # {orderDetail.order_id}</h1>
    
                            <h4 className="mb-4">Shipping Info</h4>
                            <p><b>Name:</b> {user.name}</p>
                            <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                            <p className="mb-4"><b>Address:</b>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}</p>
                            <p><b>Amount:</b> {totalPrice} Rs</p>
    
                            <hr />
    
                            <h4 className="my-4">Payment</h4>
                            <p className={orderDetail && orderDetail.paymentStatus  && orderDetail.paymentStatus === 'CHARGED'? 'greenColor' : 'redColor' } ><b>{orderDetail ? orderDetail.paymentStatus : 'Pending'}</b></p>
    
    
                            <h4 className="my-4">Order Status:</h4>
                            <p className={orderStatus&&orderStatus.includes('Delivered') ? 'greenColor' : 'redColor' } ><b>{orderStatus}</b></p>
    
                             <PaymentConfirm/>
                            <h4 className="my-4">Order Items:</h4>
    
                            <hr />
                            <div className="cart-item my-1">
                                {orderItems && orderItems.map(item => (
                                    <div className="row my-5">
                                        <div className="col-4 col-lg-2">
                                            <img src={item.image} alt={item.name} height="45" width="65" />
                                        </div>

                                        <div className="col-5 col-lg-5">
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </div>


                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                            <p>Rs.{item.price}</p>
                                        </div>

                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                            <p>{item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                                    
                            </div>
                            <hr />
                        </div>
                    </div>
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}