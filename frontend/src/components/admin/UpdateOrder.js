import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction, updateOrder, porterOrder, RemoveOrderResponse } from "../../actions/orderActions";
import { CancelOrderResponse, createPorterOrderResponse, getporterOrder } from "../../actions/porterActions";
import { toast } from "react-toastify";
import { clearOrderUpdated, clearError, adminOrderRemoveClearError } from "../../slices/orderSlice";
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

const UpdateOrder = () => {
    const { loading, isOrderUpdated, error, orderDetail, porterOrderDetail, orderRemoveResponse, orderRemoveError } = useSelector(state => state.orderState);
    const { products } = useSelector((state) => state.productsState);
    const { porterOrderData, porterOrderResponse, porterCancelResponse, porterCancelError,portererror } = useSelector((state) => state.porterState);
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
            status: editableWeights[index] > 0 ? 'confirm' : 'cancel',
            productWeight: editableWeights[index]
        }));

        let totalRefundableAmount = 0;
        const detailedTable = orderItems.map((item, index) => {
            const orderedWeight = parseFloat(item.productWeight);
            const dispatchedWeight = parseFloat(updatedItems[index].productWeight);
            const refundableWeight = parseFloat((orderedWeight - dispatchedWeight).toFixed(2)); // Keeping two decimal places
            const pricePerKg = parseFloat((item.price).toFixed(2)); // Keeping two decimal places
            const refundableAmount = parseFloat((refundableWeight * pricePerKg).toFixed(2)); // Keeping two decimal places

            totalRefundableAmount += refundableAmount;

            return {
                image: item.image,
                name: item.name,
                orderedWeight,
                pricePerKg,
                dispatchedWeight,
                refundableWeight,
                refundableAmount,
            };
        });

        totalRefundableAmount = parseFloat(totalRefundableAmount.toFixed(2)); // Keeping two decimal places


        console.log("detailedTable", detailedTable);
        console.log(`Total Refundable Amount: ₹${totalRefundableAmount}`);

        console.log("updatedItems", updatedItems)

        const reqPorterData = {
            user: user,
            request_id: requestId,
            user_id: user._id,
            order_id: orderDetail.order_id,
            porterData: porterData,
            updatedItems: updatedItems,
            detailedTable: detailedTable,
            totalRefundableAmount: totalRefundableAmount
        };
        console.log('reqPorterData', reqPorterData);

        try {
            await dispatch(porterOrder({ id: orderDetail.order_id, reqPorterData }));
            // setShowDispatchModal(false);
            // setRefreshData(true)
            // await dispatch(getporterOrder({ order_id: id }));
        } catch (error) {
            toast.error(error);
            // setRefreshData(true)
        }

        setRefreshData(true)
    };


    const changeWeight = (e, index) => {
        const value = e.target.value;
        if (value === '' || !isNaN(value)) {
            const numericValue = parseFloat(value);
            if (numericValue < 0) {
                // If the entered value is negative, reset to the original weight and show an error
                toast.error("Weight cannot be negative. Reverting to original weight.");
                const newWeights = [...editableWeights];
                newWeights[index] = originalWeights[index]; // Reset to original weight
                setEditableWeights(newWeights);
                return;
            }

            if (numericValue > orderItems[index].productWeight) {
                toast.error("Entered Kg is greater than requested Kg. Reverting to original weight.");
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

    useEffect(() => {
        if (isOrderUpdated) {
            toast('Order Updated Successfully!', {
            type: 'success',
            position: "bottom-center",
            onOpen: () => dispatch(clearOrderUpdated())
        });

        }
        if (error) {
            toast(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            });
        }
        // if (portererror) {
        //     toast(portererror, {
        //         position: "bottom-center",
        //         type: 'error',
        //         onOpen: () => { dispatch(clearError()) }
        //     });
        // }
        dispatch(orderDetailAction(id));

        // if (!refreshData) {
        //     const fetchData = async () => {
        //          dispatch(porterClearData())
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


        if (refreshData) {
            const fetchData = async () => {
                dispatch(porterClearData())
                await dispatch(getporterOrder({ order_id: id }))
                await dispatch(createPorterOrderResponse({ order_id: id, porterOrder_id: porterOrderData?.porterOrder?.order_id }))
                await dispatch(porterClearData())
                await dispatch(getporterOrder({ order_id: id }))
                await dispatch(porterClearResponse())
                // dispatch(orderDetailAction(id));
                setRefreshData(false);
            }

            fetchData();
        }
        dispatch(porterClearData())
        dispatch(createPorterOrderResponse({ order_id: id, porterOrder_id: porterOrderData?.porterOrder?.order_id }))
        dispatch(getporterOrder({ order_id: id }))

    }, [dispatch, id, refreshData, porterOrderDetail,error]);


    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            {
                loading ? <Loader /> : (
                    <div className="col-12 col-md-10">
                        <Fragment>
                            {/* <div className="row d-flex justify-content-around"> */}
                            <div className="col-12 col-lg-12 mt-5 order-details">
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
                                {/* <div className="cart-item my-1">
                                    {
                                        porterOrderData && porterOrderData.detailedTable && porterOrderData.detailedTable ? (
                                            <div>
                                            
                                                <div className="row my-2">
                                                    <div className="col-2 col-lg-1">
                                                        <strong> Image</strong>
                                                    </div>
                                                    <div className="col-2 col-lg-2">
                                                        <strong> Name</strong>
                                                    </div>
                                                    <div className="col-2 col-lg-1">
                                                        <strong>Ordered Weight</strong>
                                                    </div>
                                                    <div className="col-2 col-lg-2">
                                                        <strong>Price per kg</strong>
                                                    </div>
                                                    <div className="col-2 col-lg-2">
                                                        <strong>Dispatched Weight</strong>
                                                    </div>
                                                    <div className="col-2 col-lg-2">
                                                        <strong>Refundable Weight</strong>
                                                    </div>
                                                    <div className="col-2 col-lg-2">
                                                        <strong>Refundable Amount</strong>
                                                    </div>
                                                </div>

                                              
                                                {porterOrderData && porterOrderData.detailedTable && porterOrderData.detailedTable.map((item, index) => {
                                                    const product = products.find(product => product.englishName === item.name);
                                                    if (!product) {
                                                        return null;
                                                    }

                                                    return (
                                                        <div className="row my-5" key={index}>
                                                            <div className="col-2 col-lg-1">
                                                                <img src={item.image} alt={item.name} height="45" width="65" />
                                                            </div>
                                                            <div className="col-2 col-lg-2">
                                                                <p>{item.name}</p>
                                                            </div>
                                                            <div className="col-2 col-lg-1">
                                                                <p>{item.orderedWeight} kg</p>
                                                            </div>
                                                            <div className="col-2 col-lg-2">
                                                                <p>Rs. {item.pricePerKg}</p>
                                                            </div>
                                                            <div className="col-2 col-lg-2">
                                                                <p>{item.dispatchedWeight} kg</p>
                                                            </div>
                                                            <div className="col-2 col-lg-2">
                                                                <p>{item.refundableWeight} kg</p>
                                                            </div>
                                                            <div className="col-2 col-lg-2">
                                                                <p>Rs. {item.refundableAmount}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : !porterOrderData ? (
                                            <div>
                                               
                                                <div className="row my-2">
                                                    <div className="col-1 col-lg-1">
                                                        <strong>Select Item</strong>
                                                    </div>
                                                    <div className="col-1 col-lg-1">
                                                        <strong> Image</strong>
                                                    </div>
                                                    <div className="col-2 col-lg-2">
                                                        <strong> Name</strong>
                                                    </div>
                                                    <div className="col-1 col-lg-1">
                                                        <strong>Price per kg</strong>
                                                    </div>
                                                    <div className="col-1 col-lg-1">
                                                        <strong>Original Weight</strong>
                                                    </div>
                                                    <div className="col-1 col-lg-1">
                                                        <strong>New Weight</strong>
                                                    </div>
                                                    <div className="col-1 col-lg-1">
                                                        <strong>Total Price</strong>
                                                    </div>
                                                    <div className="col-1 col-lg-1">
                                                        <strong> Status</strong>
                                                    </div>
                                                </div>

                                               
                                                {orderItems.map((item, index) => {
                                                    const product = products.find(product => product.englishName === item.name);
                                                    if (!product) {
                                                        return null;
                                                    }

                                                    return (
                                                        <div className="row my-5" key={index}>
                                                            <div className="col-1 col-lg-1">
                                                                <input
                                                                    type="checkbox"
                                                                    className="check-input"
                                                                    id={`item-${index}`}
                                                                    checked={selectedItems[index]}
                                                                    onChange={() => handleItemSelection(index)}
                                                                />
                                                            </div>
                                                            <div className="col-1 col-lg-1">
                                                                <img src={item.image} alt={item.name} height="45" width="65" />
                                                            </div>
                                                            <div className="col-2 col-lg-2">
                                                                <p>{item.name}</p>
                                                            </div>
                                                            <div className="col-1 col-lg-1">
                                                                <p>Rs. {item.price}</p>
                                                            </div>
                                                            <div className="col-1 col-lg-1">
                                                                <p> {item.productWeight}kg</p>
                                                            </div>
                                                            {editableWeights && (
                                                                <>
                                                                    <div className="col-1 col-lg-1">
                                                                        <NumberInput
                                                                            className="no-arrow-input form-control"
                                                                            value={editableWeights[index] === 0 ? '' : editableWeights[index]}
                                                                            onChange={(e) => changeWeight(e, index)}
                                                                            placeholder={editableWeights[index] === 0 ? 0 : ''}
                                                                            onBlur={() => handleBlur(index)}
                                                                            disabled={!selectedItems[index]} 
                                                                            required
                                                                        />
                                                                    </div>
                                                                    <div className="col-1 col-lg-1">
                                                                        <p>Rs. {(editableWeights[index] * item.price).toFixed(2)}</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                            <div className="col-1 col-lg-1">
                                                                {product.stocks ? (
                                                                    <p>{product.stocks}</p>
                                                                ) : (
                                                                    <p>Out of Stock</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <></>
                                        )
                                    }
                                </div> */}
                                <div className="invoice-table-container">
                                    <div className="updatetable-responsive">
                                        <table className="updatetable updatetable-bordered">
                                            <thead>
                                                <tr>
                                                    {porterOrderData && porterOrderData.detailedTable ? (
                                                        <>
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
                                                            <th>Select Item</th>
                                                            <th>Image</th>
                                                            <th>Name</th>
                                                            <th>Price per kg</th>
                                                            <th>Ordered Weight</th>
                                                            <th>Dispatch Weight</th>
                                                            <th>Total Price</th>
                                                            <th>Status</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {porterOrderData && porterOrderData.detailedTable ? (
                                                    porterOrderData.detailedTable.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <img src={item.image} alt={item.name} className="updateTableproduct-image" />
                                                            </td>
                                                            <td>{item.name}</td>
                                                            <td>{item.orderedWeight} kg</td>
                                                            <td>Rs. {item.pricePerKg}</td>
                                                            <td>{item.dispatchedWeight} kg</td>
                                                            <td>{item.refundableWeight} kg</td>
                                                            <td>Rs. {item.refundableAmount}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    orderItems.map((item, index) => {
                                                        const product = products.find((product) => product.englishName === item.name);
                                                        if (!product) return null;

                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="updatecheck-input"
                                                                        checked={selectedItems[index]}
                                                                        onChange={() => handleItemSelection(index)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <img src={item.image} alt={item.name} className="updateTableproduct-image" />
                                                                </td>
                                                                <td>{item.name}</td>
                                                                <td>Rs. {item.price}</td>
                                                                <td>{item.productWeight} kg</td>
                                                                {editableWeights && (
                                                                    <>
                                                                        <td style={{maxWidth:'70px'}}>
                                                                            <input
                                                                                type="number"
                                                                                className="no-arrow-input form-control updateTableInput"
                                                                                value={editableWeights[index] === 0 ? '' : editableWeights[index]}
                                                                                onChange={(e) => changeWeight(e, index)}
                                                                                placeholder={editableWeights[index] === 0 ? 0 : ''}
                                                                                onBlur={() => handleBlur(index)}
                                                                                disabled={!selectedItems[index]}
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td>Rs. {(editableWeights[index] * item.price).toFixed(2)}</td>
                                                                    </>
                                                                )}
                                                                <td>{product.stocks ? <p>{product.stocks}</p> : <p>Out of Stock</p>}</td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <hr />
                                <div>
                                    <button className='btn btn-primary' onClick={submitHandler} disabled={dropStatus === "Dispatched"}>Dispatch</button>
                                </div>

                                {porterOrderData && (
                                    <Invoice porterOrderData={porterOrderData} />

                                )

                                }
                            </div>
                        </Fragment>
                    </div>
                )
            }



        </div>
    );



};

export default UpdateOrder;
