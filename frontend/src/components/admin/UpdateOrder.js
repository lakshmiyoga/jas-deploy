import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction, updateOrder } from "../../actions/orderActions";
import { toast } from "react-toastify";
import { clearOrderUpdated, clearError } from "../../slices/orderSlice";
import { Link } from "react-router-dom";


const UpdateOrder = () => {
    const { loading, isOrderUpdated, error, orderDetail } = useSelector(state => state.orderState)
    const { products } = useSelector((state) => state.productsState);
    // console.log(products)
    const { user = {}, orderItems = [], shippingInfo = {}, totalPrice = 0 } = orderDetail;
    // const isPaid = paymentInfo.status === 'succeeded' ? true : false;
    const [orderStatus, setOrderStatus] = useState("Processing");
    const { id } = useParams();
    console.log(id)
    // console.log(orderDetail)

       
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler =async (e) => {
        e.preventDefault();

        // if (orderStatus === "Shipped") {
        //     let outOfStockItems = [];
        //     let refundAmount = 0;
    
        //     orderItems.forEach(item => {
        //         const product = products.find(product => product.englishName === item.name);
        //         if (!product || product.stocks === 0) {
        //             outOfStockItems.push(item);
        //             refundAmount += item.price * item.productWeight;
        //         }
        //     });
    
        //     if (outOfStockItems.length > 0) {
        //         // Initiate refund
        //         try {
        //             const response = await fetch('/api/v1/refund', {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                 },
        //                 body: JSON.stringify({ orderId: orderDetail.order_id, amount: refundAmount }),
        //             });
    
        //             const data = await response.json();
        //             if (response.ok) {
        //                 toast('Refund Initiated Successfully!', {
        //                     type: 'success',
        //                     position: "bottom-center",
        //                 });
        //             } else {
        //                 toast(`Refund Failed: ${data.message}`, {
        //                     type: 'error',
        //                     position: "bottom-center",
        //                 });
        //                 return;
        //             }
        //         } catch (error) {
        //             toast(`Refund Failed: ${error.message}`, {
        //                 type: 'error',
        //                 position: "bottom-center",
        //             });
        //             return;
        //         }
        //     }
        // }

        const orderData = {};
        orderData.orderStatus = orderStatus;
        dispatch(updateOrder({id: orderDetail.order_id, orderData}))
    }

    useEffect(() => {
        if (isOrderUpdated) {
            toast('Order Updated Succesfully!', {
                type: 'success',
                position: "bottom-center",
                onOpen: () => dispatch(clearOrderUpdated())
            })

            return;
        }

        if (error) {
            toast(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }

        dispatch(orderDetailAction(id))
    }, [isOrderUpdated, error, dispatch])


    useEffect(() => {
        if (orderDetail.order_id) {
            setOrderStatus(orderDetail.orderStatus);
        }
    }, [orderDetail])


    return (
        <div className="row">
        <div className="col-12 col-md-2">
                <Sidebar/>
        </div>
        <div className="col-12 col-md-10">
            <Fragment>
            <div className="row d-flex justify-content-around">
                    <div className="col-12 col-lg-8 mt-5 order-details">

                        <h1 className="my-5">Order # {orderDetail.order_id}</h1>

                        <h4 className="mb-4">Shipping Info</h4>
                        <p><b>Name:</b> {user.name}</p>
                        <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                        <p className="mb-4"><b>Address:</b>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}</p>
                        <p><b>Amount:</b> ${totalPrice}</p>

                        <hr />

                        <h4 className="my-4">Payment</h4>
                        <p className={orderDetail && orderDetail.paymentStatus  && orderDetail.paymentStatus === 'CHARGED'? 'greenColor' : 'redColor' } ><b>{orderDetail ? orderDetail.paymentStatus : 'Pending'}</b></p>


                        <h4 className="my-4">Order Status:</h4>
                        <p className={orderStatus&&orderStatus.includes('Delivered') ? 'greenColor' : 'redColor' } ><b>{orderStatus}</b></p>


                        <h4 className="my-4">Order Items:</h4>

                        <hr />
                        <div className="cart-item my-1">
                            {/* {orderItems && orderItems.map(item => (
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
                            ))} */}
                             {orderItems && orderItems.map((item, index) => {
                                console.log(item)
                const product = products.find(product => product.englishName === item.name);
                 console.log(product)
                if (!product) {
                    return null; // Skip if no matching product is found
                }

                return (
                    <div className="row my-5" key={index}>
                        <div className="col-4 col-lg-2">
                            <img src={item.image} alt={item.name} height="45" width="65" />
                        </div>

                        <div className="col-5 col-lg-2">
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </div>

                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                            <p>Rs.{item.price}</p>
                        </div>

                        <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                            <p>{item.productWeight}</p>
                        </div>

                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                            { product && product.stocks  ? (
                                <p> {product.stocks}</p>
                            ) : (
                                <p>Out of Stock</p>
                            )}
                        </div>
                    </div>
                );
            })}
                                
                        </div>
                        <hr />
                    </div>
                    <div className="col-12 col-lg-3 mt-5">
                        <h4 className="my-4">Order Status</h4>
                        <div className="form-group">
                            <select 
                            className="form-control"
                            onChange={e => setOrderStatus(e.target.value)}
                            value={orderStatus}
                            name="status"
                            >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                          
                        </div>
                        <button
                            disabled={loading}
                            onClick={submitHandler}
                            className="btn btn-primary btn-block"
                            >
                                Update Status
                        </button>

                    </div>
                </div>
            </Fragment>
        </div>
    </div>
    )
}


export default UpdateOrder
