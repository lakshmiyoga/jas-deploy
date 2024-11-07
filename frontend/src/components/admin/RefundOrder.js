import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction, updateOrder, porterOrder, RemoveOrderResponse, adminOrders } from "../../actions/orderActions";
import { CancelOrderResponse, createPorterOrderResponse, getPackedOrder, getporterOrder, initRefund, packedOrder, updatedPackedOrder } from "../../actions/porterActions";
import { Slide, toast } from "react-toastify";
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
import LoaderButton from "../Layouts/LoaderButton";

const RefundOrder = ({ isActive, setIsActive }) => {
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const { loading, isOrderUpdated, error, orderDetail, porterOrderDetail, orderRemoveResponse, orderRemoveError } = useSelector(state => state.orderState);
    const { products } = useSelector((state) => state.productsState);
    const { porterOrderData, porterOrderResponse, porterCancelResponse, porterCancelError, portererror, getpackedOrderData, refundData, refundError } = useSelector((state) => state.porterState);
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
    const [refundloading, setRefundLoading] = useState(false)
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
    //     const requestId = TEST_0_${uuidv4()};
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
    //     // console.log(Total Refundable Amount: ₹${totalRefundableAmount});

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
    //     console.log(Total Amount: ₹${totalDispatchedAmount});

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

    const submitRefundHandler = () => {
        // const RefundableAmount = Number(getpackedOrderData.totalRefundableAmount);
        // setRefundLoading(true)
        // // console.log("RefundableAmount",RefundableAmount)
        // dispatch(initRefund({ order_id: id, RefundableAmount }))
        // Extract relevant data from getpackedOrderData
        const totalDispatchedAmount = Number(getpackedOrderData && getpackedOrderData.totalDispatchedAmount);
        const totalRefundableAmount = Number(getpackedOrderData && getpackedOrderData.totalRefundableAmount);
        const shippingCharge = Number(orderDetail.shippingPrice);

        let RefundableAmount;

        // Check if totalDispatchedAmount is greater than 0
        if (totalDispatchedAmount > 0) {
            // Use totalRefundableAmount if dispatched amount is greater than 0
            RefundableAmount = totalRefundableAmount;
        } else {
            // Add shipping charge to totalRefundableAmount if no dispatched amount
            RefundableAmount = totalRefundableAmount + shippingCharge;
        }

        setRefundLoading(true); // Set loading state
        if (RefundableAmount > 0) {
            dispatch(initRefund({ order_id: id, RefundableAmount }));
        }
        else {
            toast.dismiss();
            setTimeout(() => {
                toast.error('Cannot refund because of invalid refund amount!', {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    // onOpen: () => dispatch(clearRefundError())
                });
            }, 300);
            setRefundLoading(false);
        }

        // Dispatch the refund with the calculated RefundableAmount

    }

    useEffect(() => {
        if (refundData) {
            // toast(refundData, {
            //     type: 'success',
            //     position: "bottom-center",
            //     onOpen: () => dispatch(clearRefundError())
            // });
            toast.dismiss();
            setTimeout(() => {
                toast.success(refundData, {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearRefundError())
                });
                // setTimeout(() => {
                    dispatch(updatedPackedOrder({}));
                    dispatch(adminOrders());
                // }, 700);
            }, 300);
            setRefundLoading(false);

            return;

        }

        // dispatch(porterClearData())
        // dispatch(porterClearResponse());
        dispatch(orderDetailAction(id));
        dispatch(getPackedOrder({ order_id: id }))
        dispatch(getporterOrder({ order_id: id }))

        // dispatch(createPorterOrderResponse({ order_id: id, porterOrder_id: porterOrderData?.porterOrder?.order_id }))
        setRefreshData(true)
        // dispatch(getporterOrder({ order_id: id }))

    }, [dispatch, id, porterOrderDetail, refundData]);

    useEffect(() => {
        if (error) {
            // toast(error, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => { dispatch(clearError()) }
            // });
            toast.dismiss();
            setTimeout(() => {
                toast.error(error, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearError()) }
                });
            }, 300);
            setRefundLoading(false);
        }
        if (refundError) {
            // toast(refundError, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => { dispatch(clearRefundError()) }
            // });
            toast.dismiss();
            setTimeout(() => {
                toast.error(refundError, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearRefundError()) }
                });
            }, 300);
            setRefundLoading(false);
        }
    }, [refundError, error])

    useEffect(() => {
        if (porterOrderData && refreshData) {
            dispatch(createPorterOrderResponse({ order_id: porterOrderData && porterOrderData.order_id, porterOrder_id: porterOrderData?.porterOrder?.order_id }))
        }
    }, [porterOrderData])

    useEffect(() => {
        if (refreshData && porterOrderResponse) {
            // dispatch(porterClearData())
            dispatch(getporterOrder({ order_id: id }))
            setRefreshData(false)
        }
    }, [refreshData, porterOrderResponse]);

    const capitalizeFirstLetter = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    return (
        <div>
            {/* <MetaData title={`Refund Order`} /> */}
            <MetaData
                title="Refund Order"
                description="Process individual order refunds. Manage refunds based on order details and customer requests, ensuring a smooth refund process."
            />


            <div className="row loader-parent">
                <div className="col-12 col-md-2">
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>

                <div className="col-12 col-md-10 smalldevice-space container order-detail-container loader-parent">
                    {
                        loading ? (
                            <div className="container loader-loading-center">
                                <Loader />
                            </div>
                        )
                            : (
                                <Fragment>
                                    {/* <div className="row d-flex justify-content-around"> */}
                                    <div className="col-12 col-lg-12 mt-5 order-details">
                                        <h1 className="my-5">Order # {orderDetail.order_id}</h1>

                                        <h4 className="mb-4">Shipping Info</h4>
                                        <div><b>Name:</b> {shippingInfo.name}</div>
                                        <div><b>Phone:</b> {shippingInfo.phoneNo}</div>
                                        <div>
                                            <b>Address:</b>
                                            {shippingInfo.address && `${shippingInfo.address},`}
                                            {shippingInfo.area && `${shippingInfo.area},`}
                                            {shippingInfo.landmark && `${shippingInfo.landmark},`}
                                            {shippingInfo.city && `${shippingInfo.city}`}
                                            {shippingInfo.postalCode && -`${shippingInfo.postalCode}`}
                                        </div>

                                        <div><b>Amount:</b> Rs.{parseFloat(totalPrice).toFixed(2)}</div>
                                        {orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.payment_method && (
                                            <div><b>Payment Mode:</b> {orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.payment_method}</div>

                                        )

                                        }

                                        <hr />

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <p><b>Payment Status:</b></p>
                                                <p className={orderDetail && orderDetail.paymentStatus && orderDetail.paymentStatus === 'CHARGED' ? 'greenColor' : 'redColor'} style={{ marginLeft: '10px' }}><b>{orderDetail ? orderDetail.paymentStatus : 'Pending'}</b></p>
                                            </div>
                                            {getpackedOrderData && getpackedOrderData.totalRefundableAmount > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                                                <p><b>Refund Status:</b></p>
                                                <p className={orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.refunds && orderDetail.statusResponse.refunds[0].status === 'SUCCESS' ? 'greenColor' : 'redColor'} style={{ marginLeft: '10px' }}><b>{orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.refunds ? orderDetail.statusResponse.refunds[0].status : 'Processing'}</b></p>
                                            </div>
                                        )}
                                            {/* <div style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}>
                                                {
                                                    orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.refunds && (
                                                        <>
                                                            <p><b>Refund Status:</b></p>
                                                            <p className={orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.refunds && orderDetail.statusResponse.refunds[0].status === 'SUCCESS' ? 'greenColor' : 'redColor'}><b>{orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.refunds && orderDetail.statusResponse.refunds[0].status}</b></p>
                                                        </>
                                                    )
                                                }
                                            </div> */}



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
                                                    getpackedOrderData && getpackedOrderData.totalRefundableAmount > 0 ? (
                                                        // <table className="updatetable updatetable-bordered">
                                                        //     <thead>
                                                        //         <tr>
                                                        //             {getpackedOrderData && getpackedOrderData.dispatchedTable && (
                                                        //                 <>
                                                        //                     <th>Image</th>
                                                        //                     <th>Name</th>
                                                        //                     <th>Price per kg</th>
                                                        //                     <th>Ordered Weight</th>
                                                        //                     <th>Refund Weight</th>
                                                        //                     <th>Refundable Amount</th>
                                                        //                     {/* <th>Refundable Amount</th> */}
                                                        //                 </>
                                                        //             )}
                                                        //         </tr>
                                                        //     </thead>
                                                        //     <tbody>
                                                        //         {getpackedOrderData && getpackedOrderData.dispatchedTable && (
                                                        //             getpackedOrderData.dispatchedTable.map((item, index) => (
                                                        //                 <tr key={index}>
                                                        //                     <td>
                                                        //                         <img src={item.image} alt={item.name} className="updateTableproduct-image" />
                                                        //                     </td>
                                                        //                     <td>{item.name}</td>
                                                        //                     <td>Rs. {parseFloat(item.pricePerKg).toFixed(2)}</td>
                                                        //                     <td>{item.orderedWeight} kg</td>
                                                        //                     <td>{item.refundableWeight} kg</td>
                                                        //                     <td>Rs. {parseFloat(item.pricePerKg * item.refundableWeight).toFixed(2)}</td>
                                                        //                     {/* <td>Rs. {item.refundableAmount}</td> */}
                                                        //                 </tr>
                                                        //             ))

                                                        //         )}
                                                        //         <tr>
                                                        //             <td colSpan="5" style={{ textAlign: 'right' }}><strong>TotalRefundableAmount</strong></td>
                                                        //             <td className="amount"><strong>Rs. {getpackedOrderData && getpackedOrderData.totalRefundableAmount && getpackedOrderData.totalRefundableAmount}</strong></td>
                                                        //         </tr>

                                                        //     </tbody>
                                                        // </table>
                                                        <table className="updatetable updatetable-bordered">
                                                            <thead>
                                                                <tr>
                                                                    {getpackedOrderData && getpackedOrderData.dispatchedTable && (
                                                                        <>
                                                                            <th>Image</th>
                                                                            <th>Name</th>
                                                                            <th>Price</th>
                                                                            <th>Ordered Quantity</th>
                                                                            <th>Refund Quantity</th>
                                                                            <th>Refundable Amount</th>
                                                                        </>
                                                                    )}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {getpackedOrderData && getpackedOrderData.dispatchedTable && (
                                                                    getpackedOrderData.dispatchedTable
                                                                        .filter(item => item.refundableWeight > 0) // Filter rows with refundable weight
                                                                        .map((item, index) => (
                                                                            <tr key={index}>
                                                                                <td>
                                                                                    <img src={item.image} alt={item.name} className="updateTableproduct-image" />
                                                                                </td>
                                                                                <td>{item && item.measurement === 'Grams' ? `${capitalizeFirstLetter(item.name)} (${item.range})` : `${capitalizeFirstLetter(item.name)}`} </td>
                                                                                <td>Rs. {parseFloat(item.pricePerKg).toFixed(2)}</td>
                                                                                <td>{item.orderedWeight} {item.measurement && item.measurement=='Grams'? 'Piece' :item.measurement}</td>
                                                                                <td>{item.refundableWeight} {item.measurement && item.measurement=='Grams'? 'Piece' :item.measurement}</td>
                                                                                <td>Rs. {parseFloat(item.pricePerKg * item.refundableWeight).toFixed(2)}</td>
                                                                            </tr>
                                                                        ))
                                                                )}
                                                                {/* Calculate total refundable amount */}
                                                                <tr>
                                                                    <td colSpan="5" style={{ textAlign: 'right' }}>
                                                                        <strong>Total Refundable Amount</strong>
                                                                    </td>
                                                                    <td className="amount">
                                                                        <strong>
                                                                            {/* Rs. {getpackedOrderData && getpackedOrderData.dispatchedTable &&
                                                                                getpackedOrderData.dispatchedTable
                                                                                    .filter(item => item.refundableWeight > 0)
                                                                                    .reduce((total, item) => total + (item.pricePerKg * item.refundableWeight), 0)
                                                                                    .toFixed(2)
                                                                            } */}
                                                                            Rs. {getpackedOrderData && getpackedOrderData.totalDispatchedAmount > 0
                                                                                ? getpackedOrderData.totalRefundableAmount
                                                                                : getpackedOrderData &&
                                                                                (Number(getpackedOrderData && getpackedOrderData.orderDetail.shippingPrice) +
                                                                                Number(getpackedOrderData && getpackedOrderData.totalRefundableAmount))}
                                                                        </strong>
                                                                    </td>
                                                                </tr>
                                                                {
                                                                    orderDetail && orderDetail.statusResponse && orderDetail.statusResponse.amount_refunded && orderDetail.statusResponse.amount_refunded > 0 && orderDetail.statusResponse.refunds && orderDetail.statusResponse.refunds[0].status === 'SUCCESS'  ? ( <tr>
                                                                    <td colSpan="5" style={{ textAlign: 'right' }}>
                                                                        <strong>Amount Refunded</strong>
                                                                    </td>
                                                                    <td className="amount">
                                                                        <strong>
                                                                            Rs. {orderDetail && orderDetail.statusResponse  && orderDetail.statusResponse.amount_refunded ? orderDetail.statusResponse.amount_refunded : 0
                                                                            }
                                                                        </strong>
                                                                    </td>
                                                                </tr> 
                                                                    ) : (
                                                                        <tr>
                                                                        <td colSpan="5" style={{ textAlign: 'right' }}>
                                                                            <strong>Amount Refunded</strong>
                                                                        </td>
                                                                        <td className="amount">
                                                                            <strong>
                                                                                Rs.{0}
                                                                            </strong>
                                                                        </td>
                                                                    </tr>
                                                                    )

                                                                }
                                                               
                                                                {/* <tr>
                                                                <td colSpan="5" style={{ textAlign: 'right' }}><strong>TotalRefundableAmount</strong></td>
                                                                <td className="amount"><strong>Rs. {getpackedOrderData && getpackedOrderData.totalRefundableAmount && getpackedOrderData.totalRefundableAmount}</strong></td>
                                                            </tr> */}
                                                            </tbody>
                                                        </table>


                                                    ) : (
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
                                                    <button className='btn btn-primary' onClick={submitRefundHandler} style={{ cursor:  'not-allowed'  }} disabled={true}>Already initiated</button>
                                                ) : (
                                                    <button className='btn btn-primary' onClick={submitRefundHandler}
                                                     style={{ cursor: (dropStatus === "Refund" || refundloading ) ? 'not-allowed' : 'pointer' }}
                                                      disabled={dropStatus === "Refund" || refundloading}>
                                                        {refundloading ? <LoaderButton fullPage={false} size={20} /> : (
                                                            <span> Refund</span>
                                                        )

                                                        }

                                                    </button>
                                                )

                                            }

                                        </div>

                                    </div>
                                </Fragment>
                            )
                    }


                </div>


            </div>
        </div>
    );



};

export default RefundOrder;