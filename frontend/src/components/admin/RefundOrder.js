import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction, updateOrder, porterOrder, RemoveOrderResponse } from "../../actions/orderActions";
import { CancelOrderResponse, createPorterOrderResponse, getPackedOrder, getporterOrder, initRefund, packedOrder } from "../../actions/porterActions";
import { toast } from "react-toastify";
import { clearOrderUpdated, clearError, adminOrderRemoveClearError, orderDetailClear } from "../../slices/orderSlice";
import { clearRefundError } from "../../slices/porterSlice";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import {
    porterClearData,
    porterClearResponse,
    porterCancelClearError,
} from '../../slices/porterSlice';
import Stepper from "../Layouts/Stepper";
import Invoice from "../Layouts/Invoice";
import NumberInput from "../Layouts/NumberInput";
import Loader from "../Layouts/Loader";
import MetaData from "../Layouts/MetaData";

const RefundOrder = () => {
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const { loading, isOrderUpdated, error, orderDetail, porterOrderDetail, orderRemoveResponse, orderRemoveError } = useSelector(state => state.orderState);
    const { products } = useSelector((state) => state.productsState);
    const { porterOrderData, porterOrderResponse, porterCancelResponse, porterCancelError, portererror, getpackedOrderData ,refundData,refundError} = useSelector((state) => state.porterState);
    const { user = {}, orderItems = [], shippingInfo = {}, totalPrice = 0, statusResponse = {} } = orderDetail;
    const [orderStatus, setOrderStatus] = useState("Processing");
    const [dropStatus, setDropStatus] = useState("");
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [editableWeights, setEditableWeights] = useState(orderDetail && orderItems && orderItems.map(item => item.productWeight)); // Initial state for weights
    const [originalWeights, setOriginalWeights] = useState(orderItems.map(item => item.productWeight)); // Original weights
    const [selectedItems, setSelectedItems] = useState([]);
    const { id } = useParams();
    const [refreshData, setRefreshData] = useState(false)
    const [removalReason, setRemovalReason] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log("orderDetail", orderDetail)


    useEffect(() => {
        if (orderDetail.order_id) {
            setOrderStatus(orderDetail.orderStatus);
            setDropStatus(orderDetail.orderStatus);
        }
        if (orderItems) {
            setEditableWeights(orderItems.map(item => item.productWeight))
        }
    }, [orderDetail]);

   


    // const handleItemSelection = (index) => {
    //     const newSelectedItems = [...selectedItems];
    //     newSelectedItems[index] = !newSelectedItems[index];

    //     if (newSelectedItems[index]) {
    //         // If the checkbox is checked, set the weight to zero
    //         const newWeights = [...editableWeights];
    //         newWeights[index] = 0;
    //         setEditableWeights(newWeights);
    //     } else {
    //         // If the checkbox is unchecked, reset the weight to the original value
    //         const newWeights = [...editableWeights];
    //         newWeights[index] = orderItems[index].productWeight;
    //         setEditableWeights(newWeights);
    //     }

    //     setSelectedItems(newSelectedItems);
    // };


    // const submitHandler = async (e) => {
    //     e.preventDefault();
    //     // setRefreshData(false)
    //     const requestId = `TEST_0_${uuidv4()}`;
    //     const porterData = {
    //         "request_id": requestId,
    //         "delivery_instructions": {
    //             "instructions_list": [
    //                 {
    //                     "type": "text",
    //                     "description": "handle with care"
    //                 }
    //             ]
    //         },
    //         "pickup_details": {
    //             "address": {
    //                 "apartment_address": "27",
    //                 "street_address1": "Sona Towers",
    //                 "street_address2": "Krishna Nagar Industrial Area",
    //                 "landmark": "Hosur Road",
    //                 "city": "Bengaluru",
    //                 "state": "Karnataka",
    //                 "pincode": "560029",
    //                 "country": "India",
    //                 "lat": 12.935025018880504,
    //                 "lng": 77.6092605236106,
    //                 "contact_details": {
    //                     "name": "admin",
    //                     "phone_number": "+919876543210"
    //                 }
    //             }
    //         },
    //         "drop_details": {
    //             "address": {
    //                 "apartment_address": "this is apartment address",
    //                 "street_address1": shippingInfo.address,
    //                 "street_address2": "This is My Order ID",
    //                 "landmark": "BTM Layout",
    //                 "city": shippingInfo.city,
    //                 "state": shippingInfo.state || "TamilNadu",
    //                 "pincode": shippingInfo.postalCode,
    //                 "country": shippingInfo.country,
    //                 "lat": 12.947146336879577,
    //                 "lng": 77.62102993895199,
    //                 "contact_details": {
    //                     "name": user.name,
    //                     "phone_number": shippingInfo.phoneNo
    //                 }
    //             }
    //         },
    //         "additional_comments": "This is a test comment",
    //     };

    //     // Create an array to store status for each item
    //     // const updatedItems = orderItems.map((item, index) => ({
    //     //     ...item,
    //     //     status: editableWeights[index] > 0 ? 'confirm' : 'cancel',
    //     //     productWeight: editableWeights[index]
    //     // }));

    //     // let totalRefundableAmount = 0;

    //     // const detailedTable = orderItems.map((item, index) => {
    //     //     const orderedWeight = parseFloat(item.productWeight);
    //     //     const dispatchedWeight = parseFloat(updatedItems[index].productWeight);
    //     //     const refundableWeight = parseFloat((orderedWeight - dispatchedWeight).toFixed(2)); // Keeping two decimal places
    //     //     const pricePerKg = parseFloat((item.price).toFixed(2)); // Keeping two decimal places
    //     //     const refundableAmount = parseFloat((refundableWeight * pricePerKg).toFixed(2)); // Keeping two decimal places

    //     //     totalRefundableAmount += refundableAmount;

    //     //     return {
    //     //         image: item.image,
    //     //         name: item.name,
    //     //         orderedWeight,
    //     //         pricePerKg,
    //     //         dispatchedWeight,
    //     //         refundableWeight,
    //     //         refundableAmount,
    //     //     };
    //     // });

    //     // totalRefundableAmount = parseFloat(totalRefundableAmount.toFixed(2)); // Keeping two decimal places


    //     // console.log("detailedTable", detailedTable);
    //     // console.log(`Total Refundable Amount: ₹${totalRefundableAmount}`);

    //     // console.log("updatedItems", updatedItems)

       
    //     const reqPorterData = {
    //         user: user,
    //         request_id: requestId,
    //         user_id: user._id,
    //         order_id: orderDetail.order_id,
    //         porterData: porterData,
    //         updatedItems:  getpackedOrderData.updatedItems,
    //         detailedTable: getpackedOrderData && getpackedOrderData.dispatchedTable,
    //         totalRefundableAmount: Number(getpackedOrderData && getpackedOrderData.totalRefundableAmount)
    //     };
    //     console.log('reqPorterData', reqPorterData);

    //     try {
    //         await dispatch(porterOrder({ id: orderDetail.order_id, reqPorterData }));
    //         // setShowDispatchModal(false);
    //         // setRefreshData(true)
    //         // await dispatch(getporterOrder({ order_id: id }));
    //     } catch (error) {
    //         toast.error(error);
    //         // setRefreshData(true)
    //     }

    //     setRefreshData(true)
    // };


    // const changeWeight = (e, index) => {
    //     const value = e.target.value;
    //     if (value === '' || !isNaN(value)) {
    //         const numericValue = parseFloat(value);
    //         if (numericValue < 0) {
    //             // If the entered value is negative, reset to the original weight and show an error
    //             toast.error("Weight cannot be negative. Reverting to original weight.");
    //             const newWeights = [...editableWeights];
    //             newWeights[index] = originalWeights[index]; // Reset to original weight
    //             setEditableWeights(newWeights);
    //             return;
    //         }

    //         if (numericValue > orderItems[index].productWeight) {
    //             toast.error("Entered Kg is greater than requested Kg. Reverting to original weight.");
    //         }

    //         const weight = Math.min(numericValue, orderItems[index].productWeight); // Ensure weight does not exceed initially ordered weight
    //         const newWeights = [...editableWeights];
    //         newWeights[index] = value === '' ? 0 : weight; // Allow empty value temporarily for editing
    //         setEditableWeights(newWeights);
    //     }

    // };

    // const handleBlur = (index) => {
    //     if (editableWeights[index] === '' || editableWeights[index] === null) {
    //         const newWeights = [...editableWeights];
    //         newWeights[index] = orderItems[index].productWeight;
    //         setEditableWeights(newWeights);
    //     }
    // };

    // const submitHandlerPacked =async (e) =>{
    //     e.preventDefault();

    //     const updatedItems = orderItems.map((item, index) => ({
    //         ...item,
    //         status: editableWeights[index] > 0 ? 'confirm' : 'cancel',
    //         productWeight: editableWeights[index]
    //     }));

    //     let totalDispatchedAmount = 0;
    //     let totalRefundableAmount = 0;

    //     const dispatchedTable = orderItems.map((item, index) => {
    //         const orderedWeight = parseFloat(item.productWeight);
    //         const dispatchedWeight = parseFloat(updatedItems[index].productWeight);
    //         const refundableWeight = parseFloat((orderedWeight - dispatchedWeight).toFixed(2)); // Keeping two decimal places
    //         const pricePerKg = parseFloat((item.price).toFixed(2)); // Keeping two decimal places
    //         const totalAmount = parseFloat((dispatchedWeight * pricePerKg).toFixed(2)); 
    //         const refundableAmount = parseFloat((refundableWeight * pricePerKg).toFixed(2)); // Keeping two decimal places

    //         totalRefundableAmount += refundableAmount;

    //         totalDispatchedAmount += totalAmount;

    //         return {
    //             image: item.image,
    //             name: item.name,
    //             orderedWeight,
    //             pricePerKg,
    //             dispatchedWeight,
    //             refundableWeight,
    //             // totalRefundableAmount,
    //             // totalDispatchedAmount,
    //         };
    //     });

    //     totalDispatchedAmount = parseFloat(totalDispatchedAmount.toFixed(2)); // Keeping two decimal places
    //     totalRefundableAmount = parseFloat(totalRefundableAmount.toFixed(2)); // Keeping two decimal places


    //     console.log("dispatchedTable", dispatchedTable);
    //     console.log(`Total Amount: ₹${totalDispatchedAmount}`);

    //     const reqPackedData = {
    //         user: user,
    //         // request_id: requestId,
    //         user_id: user._id,
    //         order_id: orderDetail.order_id,
    //         // porterData: porterData,
    //         // updatedItems: updatedItems,
    //         dispatchedTable: dispatchedTable,
    //         totalDispatchedAmount: totalDispatchedAmount,
    //         totalRefundableAmount:totalRefundableAmount
    //     };
    //     console.log('reqPackedData', reqPackedData);

    //     try {
    //         await dispatch(packedOrder({reqPackedData }));
    //         // setShowDispatchModal(false);
    //         // setRefreshData(true)
    //         // await dispatch(getporterOrder({ order_id: id }));
    //     } catch (error) {
    //         toast.error(error);
    //         // setRefreshData(true)
    //     }



    // }

    const submitRefundHandler = () =>{
        const RefundableAmount = Number(getpackedOrderData.totalRefundableAmount);
        // console.log("RefundableAmount",RefundableAmount)
        dispatch(initRefund({ order_id: id,  RefundableAmount }))
    }

    useEffect(() => {
        if (refundData) {
            toast(refundData, {
                type: 'success',
                position: "bottom-center",
                onOpen: () => dispatch(clearRefundError())
            });

        }
        if (error) {
            toast(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            });
        }
        if (refundError) {
            toast(refundError, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => { dispatch(clearRefundError()) }
            });
        }
        // dispatch(porterClearData())
        // dispatch(porterClearResponse());
        dispatch(orderDetailAction(id));
        dispatch(getPackedOrder({ order_id: id }))
        dispatch(getporterOrder({ order_id: id }))

        // dispatch(createPorterOrderResponse({ order_id: id, porterOrder_id: porterOrderData?.porterOrder?.order_id }))
        setRefreshData(true)
        // dispatch(getporterOrder({ order_id: id }))

    }, [dispatch, id, porterOrderDetail, error,refundData,refundError]);

    useEffect(()=>{
        if(porterOrderData && refreshData){
        dispatch(createPorterOrderResponse({ order_id: porterOrderData && porterOrderData.order_id, porterOrder_id: porterOrderData?.porterOrder?.order_id }))
        }
    },[porterOrderData])

    useEffect(()=>{
    if(refreshData && porterOrderResponse){
        dispatch(porterClearData())
        dispatch(getporterOrder({ order_id: id }))
        setRefreshData(false)
    }
        },[refreshData,porterOrderResponse])
    return (
        <div>
            <MetaData title={`Refund Order`} />
      
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            {
                loading ? <Loader /> : (
                    <div className="col-12 col-md-10 smalldevice-space container order-detail-container">
                        <Fragment>
                            {/* <div className="row d-flex justify-content-around"> */}
                            <div className="col-12 col-lg-12 mt-5 order-details">
                                <h1 className="my-5">Order # {orderDetail.order_id}</h1>

                                <h4 className="mb-4">Shipping Info</h4>
                                <p><b>Name:</b> {user.name}</p>
                                <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                                <p><b>Address:</b>{shippingInfo.address},{shippingInfo.area},{shippingInfo.landmark},{shippingInfo.city}-{shippingInfo.postalCode}</p>
                                <p><b>Amount:</b> Rs.{parseFloat(totalPrice).toFixed(2)}</p>
                                <p><b>Payment Mode:</b> {orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.payment_method}</p>

                                <hr />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <p><b>Payment Status:</b></p>
                                        <p className={orderDetail && orderDetail.paymentStatus && orderDetail.paymentStatus === 'CHARGED' ? 'greenColor' : 'redColor'} style={{ marginLeft: '10px' }}><b>{orderDetail ? orderDetail.paymentStatus : 'Pending'}</b></p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}>
                                        {
                                            orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.refunds && (
                                                <>
                                                    <p><b>Refund Status:</b></p>
                                                    <p className={orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.refunds && orderDetail.statusResponse.refunds[0].status === 'SUCCESS' ? 'greenColor' : 'redColor'}><b>{orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.refunds && orderDetail.statusResponse.refunds[0].status}</b></p>
                                                </>
                                            )
                                        }
                                    </div>

                                </div>

                                {/* <h4 className="my-4">Payment status</h4>
                                <p className={orderDetail.paymentStatus === 'CHARGED' ? 'greenColor' : 'redColor'}><b>{orderDetail.paymentStatus || 'Pending'}</b></p>
                                {
                                    orderDetail && orderDetail.statusResponse &&  orderDetail.statusResponse.refunds && (
                                        <>
                                         <h4 className="my-4">Refund status</h4>
                                <p className={orderDetail && orderDetail.statusResponse &&  orderDetail.statusResponse.refunds && orderDetail.statusResponse.refunds[0].status === 'SUCCESS' ? 'greenColor' : 'redColor'}><b>{orderDetail && orderDetail.statusResponse &&  orderDetail.statusResponse.refunds && orderDetail.statusResponse.refunds[0].status}</b></p>
                                        </>
                                    )
                                } */}
                               
                                {/* <hr /> */}
                                {/* <h4 className="my-4">Order Status:</h4>
                                <p className={dropStatus.includes('Delivered') ? 'greenColor' : 'redColor'}><b>{dropStatus}</b></p> */}

                                {/* {porterOrderData && porterOrderData.porterResponse && (
                                    <Fragment>
                                        <hr />
                                        <h4 className="my-4">Delivery Details:</h4>
                                        <div className="delivery-details">
                                            <div className="detail-column">
                                                <div className="detail-row">
                                                    <h6>Order ID:</h6>
                                                    <p>{porterOrderData.porterResponse.order_id && porterOrderData.porterResponse.order_id}</p>
                                                </div>
                                                <div className="detail-row">
                                                    <h6>Estimated Fair details:</h6>
                                                    <p>Currency: {porterOrderData.porterResponse.fare_details && porterOrderData.porterResponse.fare_details.estimated_fare_details && porterOrderData.porterResponse.fare_details.estimated_fare_details.currency && porterOrderData.porterResponse.fare_details.estimated_fare_details.currency || "INR"}</p>
                                                    <p>Minor Amount: {porterOrderData.porterResponse.fare_details && porterOrderData.porterResponse.fare_details.estimated_fare_details && porterOrderData.porterResponse.fare_details.estimated_fare_details.minor_amount && porterOrderData.porterResponse.fare_details.estimated_fare_details.minor_amount || "N/A"}</p>
                                                </div>


                                                <div className="detail-row">
                                                    <h6>Order Timings:</h6>

                                                    {porterOrderData.porterResponse && porterOrderData.porterResponse.order_timings && porterOrderData.porterResponse.order_timings.pickup_time ?
                                                        (
                                                            <p>Pickup Time:  {new Date(porterOrderData.porterResponse.order_timings.pickup_time * 1000).toLocaleString()}</p>
                                                        ) : (<p>Pickup Time:  N/A</p>)
                                                    }

                                                    {porterOrderData.porterResponse && porterOrderData.porterResponse.order_timings && porterOrderData.porterResponse.order_timings.order_accepted_time ?
                                                        (
                                                            <p>Order Accepted Time:  {new Date(porterOrderData.porterResponse.order_timings.order_accepted_time * 1000).toLocaleString()}</p>
                                                        ) : (<p>Order Accepted Time:  N/A</p>)
                                                    }

                                                    {porterOrderData.porterResponse && porterOrderData.porterResponse.order_timings && porterOrderData.porterResponse.order_timings.order_started_time ?
                                                        (
                                                            <p>Order Started Time:  {new Date(porterOrderData.porterResponse.order_timings.order_started_time * 1000).toLocaleString()}</p>
                                                        ) : (<p>Order Started Time:  N/A</p>)
                                                    }
                                                    {porterOrderData.porterResponse && porterOrderData.porterResponse.order_timings && porterOrderData.porterResponse.order_timings.order_ended_time ?
                                                        (
                                                            <p>Order Ended Time:  {new Date(porterOrderData.porterResponse.order_timings.order_ended_time * 1000).toLocaleString()}</p>
                                                        ) : (<p>Order Ended Time:  N/A</p>)
                                                    }
                                                    
                                                </div>


                                            </div>
                                            <div className="detail-column">
                                                <div className="detail-row">
                                                    <h6>Delivery Status:</h6>
                                                    <p>{porterOrderData.porterResponse.status}</p>
                                                </div>

                                                <div className="detail-row">
                                                    <h6>Actual Fare Details:</h6>
                                                    <p>Currency: {porterOrderData.porterResponse.fare_details && porterOrderData.porterResponse.fare_details.actual_fare_details && porterOrderData.porterResponse.fare_details.actual_fare_details.currency && porterOrderData.porterResponse.fare_details.actual_fare_details.currency || "INR"}</p>
                                                    <p>Minor Amount: {porterOrderData.porterResponse.fare_details && porterOrderData.porterResponse.fare_details.actual_fare_details && porterOrderData.porterResponse.fare_details.actual_fare_details.minor_amount && porterOrderData.porterResponse.fare_details.actual_fare_details.minor_amount || "N/A"}</p>
                                                </div>

                                                {
                                                    porterOrderData.porterResponse.partner_info && (
                                                        <div className="detail-row">
                                                            <h5>Delivery Partner:</h5>
                                                           
                                                            <p>Name: {porterOrderData.porterResponse.partner_info.name}</p>

                                                            <p>Mobile: {porterOrderData.porterResponse.partner_info.mobile.country_code} {porterOrderData.porterResponse.partner_info.mobile.mobile_number}</p>
                                                            {porterOrderData.porterResponse.partner_info.partner_secondary_mobile && (
                                                                <>
                                                                  
                                                                    <p>Secondary Mobile: {porterOrderData.porterResponse.partner_info.partner_secondary_mobile.country_code} {porterOrderData.porterResponse.partner_info.partner_secondary_mobile.mobile_number}</p>
                                                                </>
                                                            )
                                                            }
                                                            
                                                            <p>Vehicle Number: {porterOrderData.porterResponse.partner_info.vehicle_number}</p>
                                                            
                                                            <p>Vehicle Type: {porterOrderData.porterResponse.partner_info.vehicle_type}</p>
                                                           
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </Fragment>
                                )} */}


                                <hr />
                                <h4 className="my-4">Order Items:</h4>

                                <div className="invoice-table-container">
                                    <div className="updatetable-responsive">
                                      {
                                        getpackedOrderData && getpackedOrderData.totalRefundableAmount>0 ? (
                                            <table className="updatetable updatetable-bordered">
                                            <thead>
                                                <tr>
                                                    {getpackedOrderData && getpackedOrderData.dispatchedTable && (
                                                        <>
                                                            <th>Image</th>
                                                            <th>Name</th>
                                                            <th>Price per kg</th>
                                                            <th>Ordered Weight</th>
                                                            <th>Refund Weight</th>
                                                            <th>Total Refundable Amount</th>
                                                            {/* <th>Refundable Amount</th> */}
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getpackedOrderData && getpackedOrderData.dispatchedTable && (
                                                    getpackedOrderData.dispatchedTable.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <img src={item.image} alt={item.name} className="updateTableproduct-image" />
                                                            </td>
                                                            <td>{item.name}</td>                                           
                                                            <td>Rs. {parseFloat(item.pricePerKg).toFixed(2)}</td>
                                                            <td>{item.orderedWeight} kg</td>
                                                            <td>{item.refundableWeight} kg</td>
                                                            <td>Rs. {parseFloat(item.pricePerKg * item.refundableWeight).toFixed(2)}</td>
                                                            {/* <td>Rs. {item.refundableAmount}</td> */}
                                                        </tr>
                                                    ))
                                                    
                                                )}
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: 'right' }}><strong>TotalRefundableAmount</strong></td>
                                                    <td className="amount"><strong>Rs. {getpackedOrderData && getpackedOrderData.totalRefundableAmount && getpackedOrderData.totalRefundableAmount}</strong></td>
                                                </tr>
                                                
                                            </tbody>
                                        </table>

                                        ) :(
                                            <>
                                            there is no refund data
                                            </>
                                        )
                                      }  
                                      
                                    </div>
                                </div>

                                <hr />
                                <div>
                                    {
                                        orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.refunds ? (
                                            <button className='btn btn-primary' onClick={submitRefundHandler} disabled={true}>Already Refunded</button>
                                        ):(
                                            <button className='btn btn-primary' onClick={submitRefundHandler} disabled={dropStatus === "Refund"}>Refund</button>  
                                        )

                                    }
                                    {/* <button className='btn btn-primary' onClick={submitRefundHandler} disabled={dropStatus === "Refund"}>Refund</button> */}
                                    {/* <button className='btn btn-primary' onClick={(e)=>submitHandlerPacked(e)} disabled={dropStatus === "Packed"}>Packed</button> */}
                                </div>

                            </div>
                        </Fragment>
                    </div>
                )
            }



        </div>
        </div>
    );



};

export default RefundOrder;
