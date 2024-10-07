import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import Loader from '../Layouts/Loader';
import { orderDetail as orderDetailAction } from '../../actions/orderActions';
import { CancelOrderResponse, createPorterOrderResponse, getPackedOrder, getporterOrder, packedOrder } from "../../actions/porterActions";
import axios from 'axios';
import JasInvoice from '../Layouts/JasInvoice';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ReactDOM from 'react-dom';
import { porterClearData } from '../../slices/porterSlice';
import { toast } from 'react-toastify';
import { clearError } from '../../slices/orderSlice';


export default function OrderDetail() {
    const {error, orderDetail, loading } = useSelector(state => state.orderState)
    const { shippingInfo = {}, user = {}, orderStatus = "Processing", orderItems = [], totalPrice = 0, paymentInfo = {} } = orderDetail;
    const { porterOrderData, porterOrderResponse, porterCancelResponse, porterCancelError, portererror, getpackedOrderData } = useSelector((state) => state.porterState);
    const isPaid = paymentInfo && paymentInfo.status === "succeeded" ? true : false;
    const dispatch = useDispatch();
    const { id } = useParams();
    const [payment, setPayment] = useState(null)
    const invoiceRef = useRef();
    const location = useLocation();
    const [refreshData, setRefreshData] = useState(false)
    sessionStorage.setItem('redirectPath', location.pathname);


    useEffect(() => {
        dispatch(orderDetailAction(id));
        dispatch(getPackedOrder({ order_id: id }))
        dispatch(getporterOrder({ order_id: id }))
        setRefreshData(true)
    }, [id])
    useEffect(() => {
        if (porterOrderData && refreshData) {
            dispatch(createPorterOrderResponse({ order_id: porterOrderData && porterOrderData.order_id, porterOrder_id: porterOrderData?.porterOrder?.order_id }))
        }
        if(error){
            toast.error(error, {
                position: 'bottom-center',
            });
            dispatch(clearError())

        }
    }, [porterOrderData,error])

    useEffect(() => {
        if (refreshData && porterOrderResponse) {
            // dispatch(porterClearData())
            dispatch(getporterOrder({ order_id: id }))
            setRefreshData(false)
        }
    }, [refreshData, porterOrderResponse])

    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
    });


const [trackurl,setTrackurl]=useState(false);
  const handleClick = (tracking_url) => {
    setTrackurl(true)
    window.location.href = tracking_url;
  }
    console.log("porterOrderData", porterOrderData)

    return (
        <Fragment>
            {/* {loading ? <Loader /> : ( */}
            <Fragment>
                <div className="products_heading">Order Details</div>
                {loading ? <Loader /> : (
                    <div className="container order-detail-container">

                        <div className="row d-flex justify-content-between" id='order_summary'>
                            <div className="col-12 col-lg-12 mt-5 order-details">

                            <div className="my-5" style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap' }}>
                                    <h1 >Order # {orderDetail.order_id}</h1>
                                    {
                                        porterOrderData && porterOrderData.tracking_url && (
                                            <button onClick={()=>handleClick(porterOrderData.tracking_url)} disabled={trackurl}   className='tracking-btn' >
                                            Track Order
                                        </button>
                                        )
                                    }
                                    </div>

                                <h4 className="mb-4">Shipping Info</h4>
                                <div><b>Name:</b> {user.name}</div>
                                <div><b>Phone:</b>+91 {shippingInfo.phoneNo}</div>
                                <div>
                                    <b>Address:</b>
                                    {shippingInfo.address && `${shippingInfo.address},`}
                                    {shippingInfo.area && `${shippingInfo.area},`}
                                    {shippingInfo.landmark && `${shippingInfo.landmark},`}
                                    {shippingInfo.city && `${shippingInfo.city}`}
                                    {shippingInfo.postalCode && `-${shippingInfo.postalCode}`}
                                </div>

                                <div><b>Amount:</b> {totalPrice} Rs</div>
                                {orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.payment_method && (
                                    <div><b>Payment Mode:</b> {orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.payment_method}</div>

                                )

                                }

                                <hr />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                                        <p><b>Payment Status:</b></p>
                                        <p className={orderDetail && orderDetail.paymentStatus && orderDetail.paymentStatus === 'CHARGED' ? 'greenColor' : 'redColor'} style={{ marginLeft: '10px' }}><b>{orderDetail ? orderDetail.paymentStatus : 'Pending'}</b></p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                                        <p><b>Order Status:</b></p>
                                        <p className={orderStatus && orderStatus.includes('Delivered') ? 'greenColor' : 'redColor'} style={{ marginLeft: '10px' }}><b>{orderDetail && orderDetail.paymentStatus && orderDetail.paymentStatus === 'CHARGED' ? orderStatus : 'Cancelled'}</b></p>
                                    </div>
                                    {getpackedOrderData && getpackedOrderData.totalRefundableAmount > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                                            <p><b>Refund Status:</b></p>
                                            <p className={getpackedOrderData.refundStatus && getpackedOrderData.refundStatus.includes('SUCCESS') ? 'greenColor' : 'redColor'} style={{ marginLeft: '10px' }}><b>{getpackedOrderData.refundStatus}</b></p>
                                        </div>
                                    )}
                                </div>
                                <hr />
                                <h4 className="my-4">Order Items:</h4>
                                {/* <div className="cart-item my-1">
{orderItems && orderItems.map((item, index) => (
<div className="row my-5" key={index}>
   <div className="col-4 col-lg-2">
       <img src={item.image} alt={item.name} height="45" width="65" />
   </div>

   <div className="col-5 col-lg-2">
       <Link to={`/product/${item.product}`}>{item.name}</Link>
   </div>


   <div className="col-4 col-lg-4 mt-4 mt-lg-0">
       <p> Rs.{item.price} x {item.productWeight}  = Rs.{(item.productWeight * item.price).toFixed(2)}</p>
   </div>
</div>
))}

</div> */}

                                <div className="invoice-table-container">
                                    <div className="updatetable-responsive">
                                        <table className="updatetable updatetable-bordered">
                                            <thead>
                                                <tr>
                                                    {getpackedOrderData && getpackedOrderData.dispatchedTable ? (
                                                        <>
                                                            <th>S.No</th>
                                                            <th>Image</th>
                                                            <th>Name</th>
                                                            <th>Ordered Weight</th>
                                                            <th>Price per kg</th>
                                                            <th>Dispatched Weight</th>
                                                            <th>Refundable Weight</th>
                                                            <th>Refundable Amount</th>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <th>S.No</th>
                                                            <th>Image</th>
                                                            <th>Name</th>
                                                            <th>Price per kg</th>
                                                            <th>Ordered Weight</th>
                                                            {/* <th>Dispatch Weight</th> */}
                                                            <th>Total Price</th>
                                                            {/* <th>Status</th> */}
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getpackedOrderData && getpackedOrderData.dispatchedTable ? (
                                                    getpackedOrderData.dispatchedTable.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <img src={item.image} alt={item.name} className="updateTableproduct-image" />
                                                            </td>
                                                            <td>{item.name}</td>
                                                            <td>{item.orderedWeight} kg</td>
                                                            <td>Rs. {item.pricePerKg}</td>
                                                            <td>{item.dispatchedWeight} kg</td>
                                                            <td>{item.refundableWeight} kg</td>
                                                            <td>Rs. {parseFloat(item.pricePerKg * item.refundableWeight).toFixed(2)}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    orderItems.map((item, index) => {
                                                        // const product = products.find((product) => product.englishName === item.name);
                                                        // if (!product) return null;

                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <img src={item.image} alt={item.name} className="updateTableproduct-image" />
                                                                </td>
                                                                <td>{item.name}</td>
                                                                <td>Rs. {(item.price).toFixed(2)}</td>
                                                                <td>{item.productWeight} kg</td>
                                                                <td>Rs.{(item.productWeight * item.price).toFixed(2)}</td>

                                                                {/* <td>{product.stocks ? <p>{product.stocks}</p> : <p>Out of Stock</p>}</td> */}
                                                            </tr>
                                                        );
                                                    })
                                                )}

                                            </tbody>
                                            <tfoot>
                                                {getpackedOrderData && getpackedOrderData.dispatchedTable ? (
                                                    <tr>
                                                        <td colSpan="7" style={{ textAlign: 'right' }}>
                                                            <strong>Total Refund Amount</strong>
                                                        </td>
                                                        <td>
                                                            Rs. {getpackedOrderData.dispatchedTable.reduce((total, item) => total + parseFloat(item.pricePerKg * item.refundableWeight), 0).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <>
                                                        <tr>
                                                            <td colSpan="5" style={{ textAlign: 'right' }}>
                                                                <strong>Subtotal</strong>
                                                            </td>
                                                            <td>
                                                                Rs. {orderItems.reduce((total, item) => total + parseFloat(item.productWeight * item.price), 0).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan="5" style={{ textAlign: 'right' }}>
                                                                <strong>Shipping</strong>
                                                            </td>
                                                            <td>
                                                                Rs. {parseFloat(orderDetail.shippingPrice).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan="5" style={{ textAlign: 'right' }}>
                                                                <strong>Total Amount</strong>
                                                            </td>
                                                            <td>
                                                                Rs. {(orderItems.reduce((total, item) => total + parseFloat(item.productWeight * item.price), 0) + parseFloat(orderDetail.shippingPrice)).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )}
                                            </tfoot>


                                        </table>
                                    </div>
                                </div>
                                <div>
                                   
                                    {orderStatus && orderStatus === 'Delivered' && (
                                        <div style={{ marginTop: '20px' }}>
                                            <button onClick={handlePrint} className='btn btn-primary'>Download Invoice</button>
                                            {ReactDOM.createPortal(
                                                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: '-9999999999' }}>
                                                    <JasInvoice ref={invoiceRef} invoice={getpackedOrderData} />
                                                </div>,
                                                document.body
                                            )}
                                        </div>

                                    )

                                    }
                                </div>


                            </div>
                        </div>
                    </div>
                )}

            </Fragment>
            {/* )

            } */}
        </Fragment>
    )
}