import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction, updateOrder, porterOrder } from "../../actions/orderActions";
import { createPorterOrderResponse, getporterOrder } from "../../actions/porterActions";
import { toast } from "react-toastify";
import { clearOrderUpdated, clearError } from "../../slices/orderSlice";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const UpdateOrder = () => {
    const { loading, isOrderUpdated, error, orderDetail, porterOrderDetail } = useSelector(state => state.orderState);
    const { products } = useSelector((state) => state.productsState);
    const { porterOrderData } = useSelector((state) => state.porterState);
    const { user = {}, orderItems = [], shippingInfo = {}, totalPrice = 0, statusResponse = {} } = orderDetail;
    const [orderStatus, setOrderStatus] = useState("Processing");
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log("porterOrderData", porterOrderData)

    useEffect(() => {
        if (isOrderUpdated) {
            toast('Order Updated Successfully!', {
                type: 'success',
                position: "bottom-center",
                onOpen: () => dispatch(clearOrderUpdated())
            });

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

        dispatch(orderDetailAction(id));
    }, [isOrderUpdated, error, dispatch, id]);

    useEffect(() => {
        if (orderDetail.order_id) {
            setOrderStatus(orderDetail.orderStatus);
        }
    }, [orderDetail]);

    const handleOrderStatusChange = (e) => {
        const status = e.target.value;
        setOrderStatus(status);

        if (status === 'Dispatched') {
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
            dispatch(porterOrder({ id: orderDetail.order_id, reqPorterData }));
            setShowDispatchModal(false)
        } catch (error) {
            console.error('Error creating order:', error);
        }

        const orderData = { orderStatus };
        console.log("orderData", orderData)
        dispatch(updateOrder({ id: orderDetail.order_id, orderData }))
    };

    const handleCancelOrder = () => {
        // Implement the function to cancel the order
        console.log('Cancel Order');
    };

    const handleRemoveOrder = () => {
        // Implement the function to remove the order
        console.log('Remove Order');
    };

    useEffect(() => {
        dispatch(getporterOrder({ order_id: id }));

        if (error) {
            toast.error(error);
        }
    }, [dispatch, id, porterOrderDetail, error]);

    useEffect(() => {
        if(porterOrderData && porterOrderData.porterOrder && porterOrderData.porterOrder.order_id  ){
          dispatch(createPorterOrderResponse({ order_id: id, porterOrder_id: porterOrderData.porterOrder.order_id }));  
        }
        
    }, [dispatch,id, porterOrderData]);

    

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
                            <p className="mb-4"><b>Address:</b> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}</p>
                            <p><b>Amount:</b> ${totalPrice}</p>

                            <hr />

                            <h4 className="my-4">Payment</h4>
                            <p className={orderDetail.paymentStatus === 'CHARGED' ? 'greenColor' : 'redColor'}><b>{orderDetail.paymentStatus || 'Pending'}</b></p>

                            <h4 className="my-4">Order Status:</h4>
                            <p className={orderStatus.includes('Delivered') ? 'greenColor' : 'redColor'}><b>{orderStatus}</b></p>

                            <h4 className="my-4">Order Items:</h4>

                            <hr />
                            <div className="cart-item my-1">
                                {
                                    porterOrderData && porterOrderData.updatedItems ? (
                                        porterOrderData && porterOrderData.updatedItems && porterOrderData.updatedItems.map((item, index) => {
                                            console.log("item", item)
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

                                                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                        <p>Rs.{item.price}</p>
                                                    </div>

                                                    <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                        <p>{item.productWeight}</p>
                                                    </div>

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

                                                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                        <p>Rs.{item.price}</p>
                                                    </div>

                                                    <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                        <p>{item.productWeight}</p>
                                                    </div>

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
                                    value={orderStatus}
                                    name="status"
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Dispatched">Ready to Dispatch</option>
                                    <option value="Removed">Remove Order</option>
                                    <option value="Cancelled">Cancel Order</option>
                                </select>
                            </div>
                            <button
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
                            </button>
                        </div>
                    </div>
                </Fragment>
            </div>

            {showDispatchModal && (
                <div className="modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select Items for Dispatch</h5>
                                <button type="button" className="close" onClick={() => {setShowDispatchModal(false); setOrderStatus("Processing");}}>
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
                                <button type="button" className="btn btn-secondary" onClick={() => {setShowDispatchModal(false); setOrderStatus("Processing");}}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={submitHandler}>Dispatch</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateOrder;
