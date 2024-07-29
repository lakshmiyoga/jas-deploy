import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction, updateOrder, porterOrder,RemoveOrderResponse } from "../../actions/orderActions";
import { CancelOrderResponse, createPorterOrderResponse, getporterOrder } from "../../actions/porterActions";
import { toast } from "react-toastify";
import { clearOrderUpdated, clearError,adminOrderRemoveClearError } from "../../slices/orderSlice";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import {
    porterClearData,
    porterClearResponse,
    porterCancelClearError,
} from '../../slices/porterSlice';
import Stepper from "../Layouts/Stepper";
import Invoice from "../Layouts/Invoice";

const UpdateOrder = () => {
    const { loading, isOrderUpdated, error, orderDetail, porterOrderDetail,orderRemoveResponse, orderRemoveError } = useSelector(state => state.orderState);
    const { products } = useSelector((state) => state.productsState);
    const { porterOrderData, porterOrderResponse, porterCancelResponse, porterCancelError } = useSelector((state) => state.porterState);
    const { user = {}, orderItems = [], shippingInfo = {}, totalPrice = 0, statusResponse = {} } = orderDetail;
    const [orderStatus, setOrderStatus] = useState("Processing");
    const [dropStatus, setDropStatus] = useState("");
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const { id } = useParams();
    const [refreshData, setRefreshData] = useState(false)
    const [removalReason, setRemovalReason] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log("porterOrderData", porterOrderData)

    useEffect(() => {
        const functioncall = async () => {
            if (isOrderUpdated) {
                if (porterOrderDetail && !error) {
                    const orderData = { orderStatus };
                    //     console.log("orderData", orderData)
                    //     await dispatch(updateOrder({ id: orderDetail.order_id, orderData }))
                    //    await dispatch(clearOrderUpdated())
                    toast('Order Updated Successfully!', {
                        type: 'success',
                        position: "bottom-center",
                        onOpen: () => dispatch(clearOrderUpdated())
                    });

                }
                if (error && !porterOrderDetail) {
                    const orderData = { orderStatus: "Processing" };
                    console.log("orderData", orderData)
                    await dispatch(updateOrder({ id: orderDetail.order_id, orderData }))
                    await dispatch(clearOrderUpdated())
                }

                return;
            }

            if (error) {
                toast(error, {
                    position: "bottom-center",
                    type: 'error',
                    onOpen: () => { dispatch(clearError()) }
                });

                return;
            }
        }
        if (porterCancelResponse) {
            toast(porterCancelResponse.message, {
                type: 'success',
                position: "bottom-center",
                onOpen: () => { dispatch(porterCancelClearError()) }
            });

        }
        if (porterCancelError) {
            toast(porterCancelError, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => { dispatch(porterCancelClearError()) }
            });

        }

        if (orderRemoveResponse) {
            toast(orderRemoveResponse, {
                type: 'success',
                position: "bottom-center",
                onOpen: () => { dispatch(adminOrderRemoveClearError()) }
            });

        }
        if (orderRemoveError) {
            toast(orderRemoveError, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => { dispatch(adminOrderRemoveClearError()) }
            });

        }


        functioncall()
        dispatch(orderDetailAction(id));
    }, [isOrderUpdated, error, dispatch, id, porterOrderResponse, porterCancelError, porterCancelResponse,orderRemoveResponse,orderRemoveError]);

    useEffect(() => {
        if (orderDetail.order_id) {
            setOrderStatus(orderDetail.orderStatus);
            setDropStatus(orderDetail.orderStatus)
        }
    }, [orderDetail]);

    const handleOrderStatusChange = (e) => {
        const status = e.target.value;
        setOrderStatus(status);

        if (status === 'Dispatched' || status === "Cancelled" || status === "Removed") {
            setShowDispatchModal(true);
        } else {
            setShowDispatchModal(false);
        }
    };

    const handleItemSelection = (index) => {
        const newSelectedItems = [...selectedItems];
        newSelectedItems[index] = !newSelectedItems[index];
        setSelectedItems(newSelectedItems);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const requestId = `TEST_0_${uuidv4()}`;
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
                    "apartment_address": "27",
                    "street_address1": "Sona Towers",
                    "street_address2": "Krishna Nagar Industrial Area",
                    "landmark": "Hosur Road",
                    "city": "Bengaluru",
                    "state": "Karnataka",
                    "pincode": "560029",
                    "country": "India",
                    "lat": 12.935025018880504,
                    "lng": 77.6092605236106,
                    "contact_details": {
                        "name": "admin",
                        "phone_number": "+919876543210"
                    }
                }
            },
            "drop_details": {
                "address": {
                    "apartment_address": "this is apartment address",
                    "street_address1": shippingInfo.address,
                    "street_address2": "This is My Order ID",
                    "landmark": "BTM Layout",
                    "city": shippingInfo.city,
                    "state": shippingInfo.state || "TamilNadu",
                    "pincode": shippingInfo.postalCode,
                    "country": shippingInfo.country,
                    "lat": 12.947146336879577,
                    "lng": 77.62102993895199,
                    "contact_details": {
                        "name": user.name,
                        "phone_number": shippingInfo.phoneNo
                    }
                }
            },
            "additional_comments": "This is a test comment",
        };

        // Create an array to store status for each item
        const updatedItems = orderItems.map((item, index) => ({
            ...item,
            status: selectedItems[index] ? 'confirm' : 'cancel'
        }));

        console.log("updatedItems", updatedItems)

        const reqPorterData = {
            user: user,
            request_id: requestId,
            user_id: user._id,
            order_id: orderDetail.order_id,
            porterData: porterData,
            updatedItems: updatedItems
        };

        try {
            await dispatch(porterOrder({ id: orderDetail.order_id, reqPorterData }));
            setShowDispatchModal(false);
            // dispatch(getporterOrder({ order_id: id }));
        } catch (error) {
            toast.error(error);
        }

        setRefreshData(true)
    };

    const handleCancelOrder = () => {
        // Implement the function to cancel the order
        setShowDispatchModal(false);
        dispatch(CancelOrderResponse({ order_id: id, porterOrder_id: porterOrderData?.porterOrder?.order_id }));

        // console.log('Cancel Order');
    };

    const handleRemoveOrder = () => {
        // Implement the function to remove the order
        setShowDispatchModal(false);
        dispatch(RemoveOrderResponse({ order_id: id,removalReason}))
    };

    useEffect(() => {
        // dispatch(porterClearData())
        if (!porterOrderData && !refreshData) {
            const fetchData = async () => {
                if (!porterOrderData) {
                    try {
                        await dispatch(porterClearData())
                        await dispatch(getporterOrder({ order_id: id }))
                        await dispatch(createPorterOrderResponse({ order_id: id, porterOrder_id: porterOrderData?.porterOrder?.order_id }))
                        await dispatch(getporterOrder({ order_id: id }))
                        await dispatch(porterClearResponse())
                    } catch (error) {
                        console.error('Error in fetching porter order data:', error);
                        toast.error("Failed to fetch porter order data.");
                    }
                }
            };

            fetchData();
        }
        if (porterOrderData && !refreshData) {
            const fetchData = async () => {
                if (porterOrderData) {
                    try {
                        await dispatch(porterClearData());
                        await dispatch(createPorterOrderResponse({ order_id: id, porterOrder_id: porterOrderData?.porterOrder?.order_id }))
                        await dispatch(getporterOrder({ order_id: id }))
                        await dispatch(porterClearResponse())
                    } catch (error) {
                        console.error('Error in fetching porter order data:', error);
                        toast.error("Failed to fetch porter order data.");
                    }
                }
            };

            fetchData();
        }

        if (refreshData) {
            const fetchData = async () => {
                await dispatch(porterClearData())
                await dispatch(getporterOrder({ order_id: id }))
                await dispatch(createPorterOrderResponse({ order_id: id, porterOrder_id: porterOrderData?.porterOrder?.order_id }))
                await dispatch(getporterOrder({ order_id: id }))
                await dispatch(porterClearResponse())
                setRefreshData(false);
            }

            fetchData();
        }

    }, [dispatch, id, porterOrderDetail, refreshData, error, porterCancelResponse]);

    const handelDownloadInvoice = () =>{
        
    }

    // useEffect(() => {
    //     const fetchdata = async() =>{
    //          await dispatch(getporterOrder({ order_id: id }));
    //         if (porterOrderData && porterOrderData.porterOrder && porterOrderData.porterOrder.order_id) {
    //             await dispatch(createPorterOrderResponse({ order_id: id, porterOrder_id: porterOrderData.porterOrder.order_id }));
    //             setRefreshData(true);

    //         }
    //     }

    //     fetchdata()
    // }, [dispatch, id, porterOrderDetail]);

    // useEffect(()=>{
    //     if(porterOrderData && porterOrderData.porterOrder && porterOrderData.porterOrder.order_id ){
    //         dispatch(createPorterOrderResponse({ order_id: id, porterOrder_id: porterOrderData.porterOrder.order_id }));
    //         // dispatch(getporterOrder({ order_id: id }));
    //         setRefreshData(true);
    //     }

    // },[porterOrderData])


    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-8 mt-5 order-details">
                            <h1 className="my-5">Order # {orderDetail.order_id}</h1>

                            <h4 className="mb-4">Shipping Info</h4>
                            <p><b>Name:</b> {user.name}</p>
                            <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                            <p className="mb-4"><b>Address:</b> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state} {shippingInfo.country}</p>
                            <p><b>Amount:</b> Rs.{parseFloat(totalPrice).toFixed(2)}</p>

                            <hr />

                            <h4 className="my-4">Payment status</h4>
                            <p className={orderDetail.paymentStatus === 'CHARGED' ? 'greenColor' : 'redColor'}><b>{orderDetail.paymentStatus || 'Pending'}</b></p>
                            <hr />
                            <h4 className="my-4">Order Status:</h4>
                            <p className={dropStatus.includes('Delivered') ? 'greenColor' : 'redColor'}><b>{dropStatus}</b></p>

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
                            <div className="cart-item my-1">
                                {
                                    porterOrderData && porterOrderData.updatedItems ? (
                                        porterOrderData && porterOrderData.updatedItems && porterOrderData.updatedItems.map((item, index) => {
                                            console.log("item", item)
                                            const product = products && products.find(product => product.englishName === item.name);
                                            if (!product) {
                                                return null;
                                            }

                                            return (
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

                                                    {/* <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                        <p>{item.productWeight}</p>
                                                    </div> */}

                                                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                        {item.status}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        orderItems.map((item, index) => {
                                            const product = products.find(product => product.englishName === item.name);
                                            if (!product) {
                                                return null;
                                            }

                                            return (
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

                                                    {/* <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                        <p>{item.productWeight}</p>
                                                    </div> */}

                                                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                        {product && product.stocks ? (
                                                            <p>{product.stocks}</p>
                                                        ) : (
                                                            <p>Out of Stock</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )
                                }
                            </div>
                            <hr />
                        </div>
                        <div className="col-12 col-lg-3 mt-5">
                            <h4 className="my-4">Order Status</h4>
                            <div className="form-group">
                                <select
                                    className="form-control"
                                    onChange={handleOrderStatusChange}
                                    value={dropStatus}
                                    name="status"
                                >
                                    {/* <option value="Processing">Processing</option>
                                    <option value="Dispatched"> Dispatch</option>
                                    <option value="Removed">Remove</option>
                                    <option value="Cancelled">Cancel</option>
                                    <option value="Porter-Cancelled">Porter Cancelled</option> */}
                                    {dropStatus === 'Processing' && (
                                        <>
                                            <option value="Processing">Processing</option>
                                            <option value="Dispatched">Dispatched</option>
                                            <option value="Removed">Remove</option>
                                            {/* <option value="Cancelled">Cancel</option> */}
                                        </>
                                    )}
                                    {dropStatus === 'Dispatched' && (
                                        <>
                                            <option value="Dispatched">Dispatch</option>
                                            <option value="Cancelled">Cancel</option>
                                        </>

                                    )}
                                    {dropStatus === 'Delivered' && (
                                        <option value="Delivered">Delivered</option>
                                    )}
                                    {/* {orderStatus === 'Porter-Cancelled' && (
                                    <>
                                     <option value="Porter-Cancelled">Porter-Cancelled</option>
                                    </>
                                   
                                )} */}
                                    {dropStatus === 'Cancelled' && (
                                        <>
                                            <option value="Cancelled">Cancel</option>
                                            <option value="Dispatched">Dispatched</option>
                                            {/* <option value="Removed">Remove</option> */}
                                        </>
                                    )}
                                    {dropStatus === 'Removed' && (
                                        <>
                                            <option value="Removed">Remove</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            {/* <h4 className="my-4">Invoice</h4> */}
                            {porterOrderData &&(
                            <Invoice porterOrderData={porterOrderData}/>

                            )

                            }
                            {/* <div className="form-group">
                                <button  className="btn btn-primary btn-block" onClick={handelDownloadInvoice}>Download Invoice</button>
                            </div> */}
                            {/* <button
                                disabled={loading}
                                onClick={() => {
                                    if (orderStatus === "Dispatched") {
                                        setShowDispatchModal(true);
                                    } else if (orderStatus === "Cancelled") {
                                        handleCancelOrder();
                                    } else if (orderStatus === "Removed") {
                                        handleRemoveOrder();
                                    }
                                }}
                                className="btn btn-primary btn-block"
                            >
                                Update Status
                            </button> */}
                        </div>

                    </div>
                    {/* {
                        porterOrderData && porterOrderData.porterResponse && (
                            <Stepper currentStep={porterOrderData.porterResponse.status} />
                        )
                    } */}

                </Fragment>
            </div>

            {showDispatchModal && orderStatus === "Dispatched" ? (
                <div className="modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select Items for Dispatch</h5>
                                <button type="button" className="close" onClick={() => { setShowDispatchModal(false); setOrderStatus("Processing"); }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {orderItems.map((item, index) => (
                                    <div key={index} className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`item-${index}`}
                                            checked={selectedItems[index]}
                                            onChange={() => handleItemSelection(index)}
                                        />
                                        <label className="form-check-label" htmlFor={`item-${index}`}>
                                            {item.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowDispatchModal(false); setOrderStatus("Processing"); }}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={submitHandler}>Dispatch</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : showDispatchModal && orderStatus === "Cancelled" ? (
                <div className="modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                {/* <h5 className="modal-title">Select Items for Dispatch</h5> */}
                                <button type="button" className="close" onClick={() => { setShowDispatchModal(false); setOrderStatus("Processing"); }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are You Sure to Cancel The Order?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowDispatchModal(false); setOrderStatus("Processing"); }}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleCancelOrder}>Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : showDispatchModal && orderStatus === "Removed"? (
                <>
                    <div className="modal" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    {/* <h5 className="modal-title">Select Items for Dispatch</h5> */}
                                    <button type="button" className="close" onClick={() => { setShowDispatchModal(false); setOrderStatus("Processing"); }}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>Are You Sure to Remove The Order?</p>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="Add a reason for removal (optional)"
                                        onChange={(e) => setRemovalReason(e.target.value)} // assuming you have a state variable set up for this
                                    ></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => { setShowDispatchModal(false); setOrderStatus("Processing"); }}>Close</button>
                                    <button type="button" className="btn btn-primary" onClick={handleRemoveOrder}>Continue</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ):<>(
                {/* <p>
                    Something went wrong
                </p> */}
            )
            </>}
        </div>
    );
};

export default UpdateOrder;
