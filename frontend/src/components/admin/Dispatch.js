import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction, updateOrder, porterOrder, RemoveOrderResponse, adminOrders } from "../../actions/orderActions";
import { CancelOrderResponse, createPorterOrderResponse, getPackedOrder, getporterOrder, packedOrder } from "../../actions/porterActions";
import { Slide, toast } from "react-toastify";
import { clearOrderUpdated, clearError, adminOrderRemoveClearError, orderDetailClear } from "../../slices/orderSlice";
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
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ReactDOM from 'react-dom';
import JasInvoice from "../Layouts/JasInvoice";
import MetaData from "../Layouts/MetaData";
import LoaderButton from "../Layouts/LoaderButton";

const Dispatch = ({ isActive, setIsActive }) => {
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const { loading, isOrderUpdated, error, orderDetail, porterloading, porterOrderDetail, orderRemoveResponse, orderRemoveError } = useSelector(state => state.orderState);
    const { products } = useSelector((state) => state.productsState);
    const { porterOrderData, porterOrderResponse, porterCancelResponse, porterCancelError, portererror, getpackedOrderData } = useSelector((state) => state.porterState);
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
    const invoiceRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    console.log("porterOrderData", porterOrderData)


    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
    });

    useEffect(() => {
        if (orderDetail && orderDetail.order_id) {
            setOrderStatus(orderDetail.orderStatus);
            setDropStatus(orderDetail.orderStatus);
        }
        if (orderItems) {
            setEditableWeights(orderItems.map(item => item.productWeight))
        }
    }, [orderDetail]);

    // useEffect(() => {
    //     dispatch(orderDetailClear());
    //     dispatch(porterClearData());
    //     dispatch(porterClearResponse());
    // }, [])


    const handleItemSelection = (index) => {
        const newSelectedItems = [...selectedItems];
        newSelectedItems[index] = !newSelectedItems[index];

        if (newSelectedItems[index]) {
            // If the checkbox is checked, set the weight to zero
            const newWeights = [...editableWeights];
            newWeights[index] = 0;
            setEditableWeights(newWeights);
        } else {
            // If the checkbox is unchecked, reset the weight to the original value
            const newWeights = [...editableWeights];
            newWeights[index] = orderItems[index].productWeight;
            setEditableWeights(newWeights);
        }

        setSelectedItems(newSelectedItems);
    };


    const submitHandler = async (e) => {
        e.preventDefault();
        // setRefreshData(false)
        const requestId = `Jas_0_${uuidv4()}`;
        const porterData = {
            "request_id": requestId,
            "delivery_instructions": {
                "instructions_list": [
                    {
                        "type": "text",
                        "description": "handle with care"
                    }
                ]
            },
            "pickup_details": {
                "address": {
                    "apartment_address": "29",
                    "street_address1": "Reddy St,Nerkundram",
                    // "street_address2": "Krishna Nagar Industrial Area",
                    "landmark": "Jas Fruits And Vegetables",
                    "city": "Chennai",
                    "state": "Tamilnadu",
                    "pincode": "600107",
                    "country": "India",
                    "lat": 13.0671844,
                    "lng": 80.1775087,
                    "contact_details": {
                        "name": "Bala Santhanam",
                        "phone_number": "+919176720068"
                    }
                }
            },
            "drop_details": {
                "address": {
                    // "apartment_address": "this is apartment address",
                    "street_address1": shippingInfo.address,
                    // "street_address2": "This is My Order ID",
                    "landmark": shippingInfo.landmark,
                    "city": shippingInfo.city,
                    "state": shippingInfo.state,
                    "pincode": shippingInfo.postalCode,
                    "country": shippingInfo.country,
                    "lat": shippingInfo && shippingInfo.latitude && shippingInfo.latitude,
                    "lng": shippingInfo && shippingInfo.longitude && shippingInfo.longitude,
                    "contact_details": {
                        "name": user && user.name,
                        "phone_number": shippingInfo && shippingInfo.phoneNo && shippingInfo.phoneNo
                    }
                }
            },
            // "additional_comments": "This is a test comment",
        };

        // Create an array to store status for each item
        // const updatedItems = orderItems.map((item, index) => ({
        //     ...item,
        //     status: editableWeights[index] > 0 ? 'confirm' : 'cancel',
        //     productWeight: editableWeights[index]
        // }));

        // let totalRefundableAmount = 0;

        // const detailedTable = orderItems.map((item, index) => {
        //     const orderedWeight = parseFloat(item.productWeight);
        //     const dispatchedWeight = parseFloat(updatedItems[index].productWeight);
        //     const refundableWeight = parseFloat((orderedWeight - dispatchedWeight).toFixed(2)); // Keeping two decimal places
        //     const pricePerKg = parseFloat((item.price).toFixed(2)); // Keeping two decimal places
        //     const refundableAmount = parseFloat((refundableWeight * pricePerKg).toFixed(2)); // Keeping two decimal places

        //     totalRefundableAmount += refundableAmount;

        //     return {
        //         image: item.image,
        //         name: item.name,
        //         orderedWeight,
        //         pricePerKg,
        //         dispatchedWeight,
        //         refundableWeight,
        //         refundableAmount,
        //     };
        // });

        // totalRefundableAmount = parseFloat(totalRefundableAmount.toFixed(2)); // Keeping two decimal places


        // console.log("detailedTable", detailedTable);
        // console.log(Total Refundable Amount: ₹${totalRefundableAmount});

        // console.log("updatedItems", updatedItems)


        const reqPorterData = {
            user: user,
            request_id: requestId,
            user_id: user._id,
            order_id: orderDetail.order_id,
            // shippingInfo:orderDetail.shippingInfo,
            porterData: porterData,
            updatedItems: getpackedOrderData.updatedItems,
            detailedTable: getpackedOrderData && getpackedOrderData.dispatchedTable,
            totalRefundableAmount: Number(getpackedOrderData && getpackedOrderData.totalRefundableAmount)
        };
        console.log('reqPorterData', reqPorterData);
        if (orderDetail && shippingInfo && shippingInfo.latitude && shippingInfo.longitude && user && user.name && shippingInfo.phoneNo) {

            try {

                await dispatch(porterOrder({ id: orderDetail.order_id, reqPorterData }));
                // setShowDispatchModal(false);
                // setRefreshData(true)
                // await dispatch(getporterOrder({ order_id: id }));
            } catch (error) {
                // toast.error(error);
                // setRefreshData(true)
                toast.dismiss();
                setTimeout(() => {
                    toast.error(error, {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
            }
        }
        else {
            // toast.error('Can’t Dispatch because some user drop details are missing!');
            toast.dismiss();
            setTimeout(() => {
                toast.error('Can’t Dispatch because some user drop details are missing!', {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
        }

        // setRefreshData(true)
    };


    const changeWeight = (e, index) => {
        const value = e.target.value;
        if (value === '' || !isNaN(value)) {
            const numericValue = parseFloat(value);
            if (numericValue < 0) {
                // If the entered value is negative, reset to the original weight and show an error
                // toast.error("Weight cannot be negative. Reverting to original weight.");
                toast.dismiss();
                setTimeout(() => {
                    toast.error('Weight cannot be negative. Reverting to original weight.', {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
                const newWeights = [...editableWeights];
                newWeights[index] = originalWeights[index]; // Reset to original weight
                setEditableWeights(newWeights);
                return;
            }

            if (numericValue > orderItems[index].productWeight) {
                // toast.error("Entered Kg is greater than requested Kg. Reverting to original weight.");
                toast.dismiss();
                setTimeout(() => {
                    toast.error('Entered Kg is greater than requested Kg. Reverting to original weight.', {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
            }

            const weight = Math.min(numericValue, orderItems[index].productWeight); // Ensure weight does not exceed initially ordered weight
            const newWeights = [...editableWeights];
            newWeights[index] = value === '' ? 0 : weight; // Allow empty value temporarily for editing
            setEditableWeights(newWeights);
        }

    };

    const handleBlur = (index) => {
        if (editableWeights[index] === '' || editableWeights[index] === null) {
            const newWeights = [...editableWeights];
            newWeights[index] = orderItems[index].productWeight;
            setEditableWeights(newWeights);
        }
    };

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

    useEffect(() => {
        // if (isOrderUpdated) {
        //     toast('Order Updated Successfully!', {
        //         type: 'success',
        //         position: "bottom-center",
        //         onOpen: () => dispatch(clearOrderUpdated())
        //     });
        //     setShowModal(false);
        // }
        // if (error) {
        //     toast(error, {
        //         position: "bottom-center",
        //         type: 'error',
        //         onOpen: () => { dispatch(clearError()) }
        //     });
        // }
        // dispatch(clearError()) 
        // dispatch(porterClearResponse());
        dispatch(orderDetailAction(id));
        dispatch(getporterOrder({ order_id: id }))
        dispatch(getPackedOrder({ order_id: id }))

        // if (refreshData) {
        //     const fetchData = async () => {
        //         dispatch(porterClearData())
        //         await dispatch(getporterOrder({ order_id: id }))
        //         await dispatch(createPorterOrderResponse({ order_id: id, porterOrder_id: porterOrderData?.porterOrder?.order_id }))
        //         await dispatch(porterClearData())
        //         await dispatch(getporterOrder({ order_id: id }))
        //         await dispatch(porterClearResponse())
        //         // dispatch(orderDetailAction(id));
        //         setRefreshData(false);
        //     }

        //     fetchData();
        // }
        // dispatch(porterClearData())
        // dispatch(createPorterOrderResponse({ order_id: id, porterOrder_id: porterOrderData?.porterOrder?.order_id }))
        // dispatch(getporterOrder({ order_id: id }))

        // dispatch(porterClearData())

        // dispatch(getporterOrder({ order_id: id }))
        setRefreshData(true)

    }, [dispatch, id, porterOrderDetail]);

    useEffect(() => {
        if (isOrderUpdated) {
            // toast('Order Dispatched Successfully!', {
            //     type: 'success',
            //     position: "bottom-center",
            //     onOpen: () => dispatch(clearOrderUpdated())
            // });
            toast.dismiss();
            setTimeout(() => {
                toast.success('Order Dispatched Successfully!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearOrderUpdated())
                });
                // setTimeout(() => {
                    dispatch(adminOrders());
            //    }, 700);
                
            }, 300);
            setShowModal(false);
           
        }
    }, [isOrderUpdated])

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
            return;
        }
    }, [error])

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
    }, [refreshData, porterOrderResponse])



    const [trackurl, setTrackurl] = useState(false);
    const handleClick = (tracking_url) => {
        setTrackurl(true)
        window.location.href = tracking_url;
    }

    const handeldispatch = () => {
        setShowModal(true);
    }
    const handleCancel = () => {
        setShowModal(false);
    }

    return (
        <div>
            {/* <MetaData title={Dispatch} /> */}
            <MetaData
                title="Dispatch"
                description="Manage the dispatch of orders, track shipping status, and ensure products reach customers on time."
            />


            <div className="row loader-parent">
                <div className="col-12 col-md-2">
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>

                <div className="col-12 col-md-10 col-sm-10 smalldevice-space container order-detail-container loader-parent">
                    {
                        loading ? (
                            <div className="container loader-loading-center">
                                <Loader />
                            </div>
                        ) : (
                            <Fragment>
                                {/* <div className="row d-flex justify-content-around"> */}
                                <div className="col-12 col-lg-12 mt-5 order-details">
                                    <div className="my-5" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                        <h1 >Order # {orderDetail.order_id}</h1>
                                        {
                                            porterOrderData && porterOrderData.tracking_url && (
                                                <button onClick={() => handleClick(porterOrderData.tracking_url)} disabled={trackurl} className='tracking-btn' >
                                                    Track Order
                                                </button>
                                            )
                                        }
                                    </div>


                                    <h4 className="mb-4">Shipping Info</h4>
                                    <div><b>Name:</b> {user.name}</div>
                                    <div><b>Phone:</b> +91 {shippingInfo.phoneNo}</div>
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
                                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}>
                                            <p><b>Order Status:</b></p>
                                            <p className={orderStatus && orderStatus.includes('Delivered') ? 'greenColor' : 'redColor'} style={{ marginLeft: '10px' }}><b>{orderStatus}</b></p>
                                        </div>

                                    </div>

                                    {/* <h4 className="my-4">Payment status</h4>
                                <p className={orderDetail.paymentStatus === 'CHARGED' ? 'greenColor' : 'redColor'}><b>{orderDetail.paymentStatus || 'Pending'}</b></p>
                                <hr />
                                <h4 className="my-4">Order Status:</h4>
                                <p className={dropStatus.includes('Delivered') ? 'greenColor' : 'redColor'}><b>{dropStatus}</b></p> */}

                                    {porterOrderData && porterOrderData.porterResponse && (
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
                                                        {/* <p>Order Ended Time: {new Date(porterOrderData.porterResponse.order_timings.order_ended_time * 1000).toLocaleString()}</p> */}
                                                        {/* <p>Pickup Time: {new Date(porterOrderData.porterResponse.order_timings.pickup_time * 1000).toLocaleString()}</p> */}
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
                                                                {/* <h6>Name:</h6> */}
                                                                <p>Name: {porterOrderData.porterResponse.partner_info.name}</p>
                                                                {/* <h6>Mobile:</h6> */}
                                                                <p>Mobile: {porterOrderData.porterResponse.partner_info.mobile.country_code} {porterOrderData.porterResponse.partner_info.mobile.mobile_number}</p>
                                                                {porterOrderData.porterResponse.partner_info.partner_secondary_mobile && (
                                                                    <>
                                                                        {/* <h6>Secondary Mobile:</h6> */}
                                                                        <p>Secondary Mobile: {porterOrderData.porterResponse.partner_info.partner_secondary_mobile.country_code} {porterOrderData.porterResponse.partner_info.partner_secondary_mobile.mobile_number}</p>
                                                                    </>
                                                                )
                                                                }
                                                                {/* <h6>Vehicle Number:</h6> */}
                                                                <p>Vehicle Number: {porterOrderData.porterResponse.partner_info.vehicle_number}</p>
                                                                {/* <h6>Vehicle Type:</h6> */}
                                                                <p>Vehicle Type: {porterOrderData.porterResponse.partner_info.vehicle_type}</p>
                                                                {/* <h6>Location:</h6> */}
                                                                {/* <p>Lat: {porterOrderData.porterResponse.partner_info.location.lat}, Long: {porterOrderData.porterResponse.partner_info.location.long}</p> */}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </Fragment>
                                    )}


                                    <hr />
                                    <h4 className="my-4">Order Items:</h4>

                                    <div className="invoice-table-container">
                                        <div className="updatetable-responsive">
                                            <table className="updatetable updatetable-bordered">
                                                <thead>
                                                    <tr>
                                                        {getpackedOrderData && getpackedOrderData.dispatchedTable && (
                                                            <>
                                                                <th>Image</th>
                                                                <th>Name</th>
                                                                <th>Price per kg</th>
                                                                <th>Ordered Quantity</th>
                                                                <th>Dispatched Quantity</th>
                                                                <th>Total Amount</th>
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
                                                                <td>{item.orderedWeight} {item.measurement}</td>
                                                                <td>{item.dispatchedWeight} {item.measurement}</td>
                                                                <td>Rs. {parseFloat(item.pricePerKg * item.dispatchedWeight).toFixed(2)}</td>
                                                                {/* <td>Rs. {item.refundableAmount}</td> */}
                                                            </tr>
                                                        ))

                                                    )}
                                                    <tr>
                                                        <td colSpan="5" style={{ textAlign: 'right' }}><strong>Total Dispatched Amount</strong></td>
                                                        {/* <td className="amount"><strong>Rs. {getpackedOrderData && getpackedOrderData.totalDispatchedAmount && getpackedOrderData.totalDispatchedAmount}</strong></td> */}
                                                        <td className="amount">
                                                            <strong>
                                                                Rs. {getpackedOrderData && getpackedOrderData.totalDispatchedAmount
                                                                    ? parseFloat(getpackedOrderData.totalDispatchedAmount).toFixed(2)
                                                                    : "0.00"}
                                                            </strong>
                                                        </td>

                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <hr />
                                    <div>
                                        {/* <button className='btn btn-primary' onClick={handeldispatch} disabled={dropStatus === "Dispatched" || dropStatus === "Delivered"}>Dispatch</button> */}

                                        {/* <button className='btn btn-primary' onClick={(e)=>submitHandlerPacked(e)} disabled={dropStatus === "Packed"}>Packed</button> */}
                                        <button
                                            className='btn btn-primary'
                                            onClick={handeldispatch}
                                            disabled={dropStatus === "Dispatched" || dropStatus === "Delivered" || dropStatus === "Cancelled"}
                                            style={{ cursor: (dropStatus === "Dispatched" || dropStatus === "Delivered" || dropStatus === "Cancelled") ? 'not-allowed' : 'pointer' }}
                                        >
                                            {dropStatus === "Dispatched" ? "Already Dispatched" : dropStatus === "Delivered" ? "Order Delivered" : dropStatus === "Cancelled" ? "Order Cancelled" : "Dispatch"}
                                        </button>

                                    </div>

                                    {showModal && (
                                        <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
                                            <div className="modal-dialog" role="document">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        {/* <h5 className="modal-title">Confirm Dispatch</h5> */}
                                                        <div>Are you sure you want to dispatch this items?</div>
                                                        <button type="button" className="close" onClick={handleCancel}>
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">

                                                        {getpackedOrderData && getpackedOrderData.dispatchedTable && (
                                                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                                <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                                                                    {getpackedOrderData.dispatchedTable
                                                                        .filter(item => item.pricePerKg * item.dispatchedWeight > 0) // Filter items with total amount > 0
                                                                        .map((item, index) => (
                                                                            <li key={index} style={{ paddingBottom: '10px' }}>
                                                                                <strong>{item.name}</strong> - {item.dispatchedWeight} {item.measurement}
                                                                            </li>
                                                                        ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-primary" onClick={submitHandler} disabled={porterloading}>
                                                            {porterloading ? <LoaderButton fullPage={false} size={20} /> : (
                                                                <span>  Continue</span>
                                                            )

                                                            }

                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* {porterOrderData && (
                                    <Invoice porterOrderData={porterOrderData} />

                                )

                                } */}

                                    {getpackedOrderData && (
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
                            </Fragment>
                        )
                    }
                </div>




            </div>
        </div>
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

export default Dispatch;