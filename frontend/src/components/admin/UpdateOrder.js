import { Fragment, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction, updateOrder, porterOrder, RemoveOrderResponse, adminOrders } from "../../actions/orderActions";
import { CancelOrderResponse, createPorterOrderResponse, getPackedOrder, getporterOrder, packedOrder } from "../../actions/porterActions";
import { Slide, toast } from "react-toastify";
import { clearOrderUpdated, clearError, adminOrderRemoveClearError } from "../../slices/orderSlice";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import {
    porterClearData,
    porterClearResponse,
    porterCancelClearError,
    clearpackedUpdated,
} from '../../slices/porterSlice';
import Stepper from "../Layouts/Stepper";
import Invoice from "../Layouts/Invoice";
import NumberInput from "../Layouts/NumberInput";
import Loader from "../Layouts/Loader";
import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ReactDOM from 'react-dom';
import JasInvoice from "../Layouts/JasInvoice";
import MetaData from "../Layouts/MetaData";
import LoaderButton from "../Layouts/LoaderButton";

const UpdateOrder = ({ isActive, setIsActive }) => {
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const { loading, isOrderUpdated, error, orderDetail, porterOrderDetail, orderRemoveResponse, orderRemoveError } = useSelector(state => state.orderState);
    const { products } = useSelector((state) => state.productsState);
    const { porterOrderData, porterOrderResponse, porterCancelResponse, porterCancelError, portererror, packedOrderData, getpackedOrderData, loading: packedloading, packedOrderError } = useSelector((state) => state.porterState);
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
    // Add a timeout state to manage debounce
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log("orderDetail", orderDetail)
    const invoiceRef = useRef();
    const [weightvalue,setweightvalue] =useState(false);
    const [weighttoast,setWeightToast]=useState(false);
    const [correctWeight,setcorrectWeight]=useState(false)

    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [totalDispatchedAmount, setTotalDispatchedAmount] = useState(0); // To store total dispatched amount

    const calculateTotalDispatchedAmount = (updatedItems) => {
        let total = 0;

        updatedItems && updatedItems.forEach((item, index) => {
            const dispatchedWeight = parseFloat(item.productWeight);
            const pricePerKg = parseFloat(orderItems[index].price);
            total += dispatchedWeight * pricePerKg;
        });

        return total;
    };


    useEffect(() => {
        if (orderDetail.order_id) {
            setOrderStatus(orderDetail.orderStatus);
            setDropStatus(orderDetail.orderStatus);
        }
        if (orderItems) {
            setEditableWeights(orderItems.map(item => item.productWeight))
        }

    }, [orderDetail]);

    // useEffect(() => {
    //     dispatch(porterClearData())
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
    //     const updatedItems = orderItems.map((item, index) => ({
    //         ...item,
    //         status: editableWeights[index] > 0 ? 'confirm' : 'cancel',
    //         productWeight: editableWeights[index]
    //     }));

    //     let totalRefundableAmount = 0;

    //     const detailedTable = orderItems.map((item, index) => {
    //         const orderedWeight = parseFloat(item.productWeight);
    //         const dispatchedWeight = parseFloat(updatedItems[index].productWeight);
    //         const refundableWeight = parseFloat((orderedWeight - dispatchedWeight).toFixed(2)); // Keeping two decimal places
    //         const pricePerKg = parseFloat((item.price).toFixed(2)); // Keeping two decimal places
    //         const refundableAmount = parseFloat((refundableWeight * pricePerKg).toFixed(2)); // Keeping two decimal places

    //         totalRefundableAmount += refundableAmount;

    //         return {
    //             image: item.image,
    //             name: item.name,
    //             orderedWeight,
    //             pricePerKg,
    //             dispatchedWeight,
    //             refundableWeight,
    //             refundableAmount,
    //         };
    //     });

    //     totalRefundableAmount = parseFloat(totalRefundableAmount.toFixed(2)); // Keeping two decimal places


    //     console.log("detailedTable", detailedTable);
    //     console.log(Total Refundable Amount: ₹${totalRefundableAmount});

    //     console.log("updatedItems", updatedItems)

    //     const reqPorterData = {
    //         user: user,
    //         request_id: requestId,
    //         user_id: user._id,
    //         order_id: orderDetail.order_id,
    //         porterData: porterData,
    //         updatedItems: updatedItems,
    //         detailedTable: detailedTable,
    //         totalRefundableAmount: totalRefundableAmount
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


    const changeWeight = (e, index) => {
        const value = e.target.value;
        const measurement = orderItems[index].measurement;
        if (value === '' || !isNaN(value)) {
            const numericValue = parseFloat(value);
            if (numericValue < 0) {
                // If the entered value is negative, reset to the original weight and show an error
                // toast.error("Weight cannot be negative. Reverting to original weight.");
                setweightvalue(true);
                if(!weightvalue){
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
                        setweightvalue(false);
                    }, 300);
                }
               
                // const newWeights = [...editableWeights];
                // newWeights[index] = originalWeights[index]; // Reset to original weight
                // setEditableWeights(newWeights);
                return;
            }

            if (numericValue > orderItems[index].productWeight) {
                // toast.error("Entered Kg is greater than requested Kg. Reverting to original weight.");
                setweightvalue(true);
                if(!weightvalue){
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
                        setweightvalue(false)
                    }, 300);
                }
               
                return;
            }

            const weight = measurement && measurement === 'Kg' ? Math.min(parseFloat(numericValue).toFixed(2), orderItems[index].productWeight.toFixed(2)) : Math.floor(numericValue, orderItems[index].productWeight) ; // Ensure weight does not exceed initially ordered weight
            const newWeights = [...editableWeights];
            newWeights[index] = value === '' ? 0 : weight; // Allow empty value temporarily for editing
            setEditableWeights(newWeights);
        }

    };
    // const changeWeight = (e, index) => {
    //     const value = e.target.value;
    //     const measurement = orderItems[index].measurement;
    
    //     // Check if the value is empty or a valid number
    //     if (value === '' || !isNaN(value)) {
    //         const numericValue = parseFloat(value);
    
    //         // Check for negative values
    //         if (numericValue < 0) {
    //             toast.dismiss();
    //             setTimeout(() => {
    //                 toast.error('Weight cannot be negative. Reverting to original weight.', {
    //                     position: 'bottom-center',
    //                     type: 'error',
    //                     autoClose: 700,
    //                     transition: Slide,
    //                     hideProgressBar: true,
    //                     className: 'small-toast',
    //                 });
    //             }, 300);
    //             const newWeights = [...editableWeights];
    //             newWeights[index] = originalWeights[index]; // Reset to original weight
    //             setEditableWeights(newWeights);
    //             return;
    //         }
    
    //         // Check for exceeding weight based on measurement
    //         let isValidWeight = true;
    //         if (measurement === 'kg') {
    //             if (value.includes('.') && (value.split('.')[1].length > 2)) {
                    
    //                 isValidWeight = false; // More than two decimal places
                    
    //             }
    //             if (numericValue > orderItems[index].productWeight) {
    //             //     toast.dismiss();
    //             // setTimeout(() => {
    //             //     toast.error('Weight cannot be negative. Reverting to original weight.', {
    //             //         position: 'bottom-center',
    //             //         type: 'error',
    //             //         autoClose: 700,
    //             //         transition: Slide,
    //             //         hideProgressBar: true,
    //             //         className: 'small-toast',
    //             //     });
    //             // }, 300);
    //                 isValidWeight = false; // Exceeding initial order weight
    //             }
    //         } else if (measurement === 'Piece' || measurement === 'Box') {
    //             if (value.includes('.') || numericValue % 1 !== 0) {
    //                 isValidWeight = false; // Decimal values not allowed
    //             }
    //         }
    
    //         // Handle invalid weight input
    //         if (!isValidWeight) {
    //             toast.dismiss();
    //             setTimeout(() => {
    //                 toast.error('Invalid weight entered. Reverting to original weight.', {
    //                     position: 'bottom-center',
    //                     type: 'error',
    //                     autoClose: 700,
    //                     transition: Slide,
    //                     hideProgressBar: true,
    //                     className: 'small-toast',
    //                 });
    //             }, 300);
    //             const newWeights = [...editableWeights];
    //             newWeights[index] = originalWeights[index]; // Reset to original weight
    //             setEditableWeights(newWeights);
    //             return;
    //         }
    
    //         // Set the valid weight
    //         const weight = measurement === 'kg' ? Math.min(numericValue, orderItems[index].productWeight) : Math.min(numericValue, Math.floor(orderItems[index].productWeight));
    //         const newWeights = [...editableWeights];
    //         newWeights[index] = value === '' ? 0 : weight; // Allow empty value temporarily for editing
    //         setEditableWeights(newWeights);
    //     }
    // };
    

    // const changeWeight = (e, index) => {
    //     let value = e.target.value;
    //     const measurementType = orderItems[index].measurement; // Get the measurement type (kg, piece, box)
    //     console.log("measurementType",measurementType)

    //     // Ensure value is a number or empty
    //     if (value === '' || !isNaN(value)) {
    //         let numericValue = parseFloat(value);

    //         // Prevent negative values
    //         if (numericValue < 0) {
    //             toast.dismiss();
    //             setTimeout(() => {
    //                 toast.error('Weight cannot be negative. Reverting to original weight.', {
    //                     position: 'bottom-center',
    //                     type: 'error',
    //                     autoClose: 700,
    //                     transition: Slide,
    //                     hideProgressBar: true,
    //                     className: 'small-toast',
    //                 });
    //             }, 300);
    //             // const newWeights = [...editableWeights];
    //             // newWeights[index] = originalWeights[index]; // Reset to original weight
    //             // setEditableWeights(newWeights);
    //             return;
    //         }

    //         // Ensure numericValue does not exceed the originally ordered product weight
    //         if (numericValue > orderItems[index].productWeight) {
    //             toast.dismiss();
    //             setTimeout(() => {
    //                 toast.error('Entered Kg is greater than requested Kg. Reverting to original weight.', {
    //                     position: 'bottom-center',
    //                     type: 'error',
    //                     autoClose: 700,
    //                     transition: Slide,
    //                     hideProgressBar: true,
    //                     className: 'small-toast',
    //                 });
    //             }, 300);
    //         }

    //         // Handle decimal places based on measurement type
    //         if (measurementType === 'kg') {
    //             // Allow up to two decimal places for kilograms
    //             numericValue = parseFloat(numericValue.toFixed(2));
    //         } else {
    //             // Force whole numbers for other measurement types
    //             numericValue = Math.floor(numericValue);
    //         }

    //         // Ensure weight does not exceed initially ordered weight
    //         const weight = Math.min(numericValue, orderItems[index].productWeight);

    //         const newWeights = [...editableWeights];
    //         newWeights[index] = value === '' ? 0 : weight; // Allow empty value temporarily for editing
    //         setEditableWeights(newWeights);
    //     }
    // };
   

    // const changeWeight = (e, index) => {
    //     let value = e.target.value.trim();  // Trim to avoid spaces
    //     const measurementType = orderItems[index].measurement; // Get the measurement type (kg, piece, box)
        
    //     // Ensure value is either empty or a valid number
    //     if (value === '' || (!isNaN(value) && Number(value) >= 0)) {
    //         let numericValue = parseFloat(value);
    
    //         // Prevent negative values
    //         if (numericValue < 0) {
    //             toast.dismiss();
    //             setTimeout(() => {
    //                 toast.error('Weight cannot be negative. Reverting to original weight.', {
    //                     position: 'bottom-center',
    //                     type: 'error',
    //                     autoClose: 700,
    //                     transition: Slide,
    //                     hideProgressBar: true,
    //                     className: 'small-toast',
    //                 });
    //             }, 300);
    //             return;
    //         }
    
    //         // Ensure numericValue does not exceed the originally ordered product weight
    //         if (numericValue > orderItems[index].productWeight) {
    //             toast.dismiss();
    //             setTimeout(() => {
    //                 toast.error('Entered Kg is greater than requested Kg. Reverting to original weight.', {
    //                     position: 'bottom-center',
    //                     type: 'error',
    //                     autoClose: 700,
    //                     transition: Slide,
    //                     hideProgressBar: true,
    //                     className: 'small-toast',
    //                 });
    //             }, 300);
    //         }
    
    //         // Handle decimal places based on measurement type
    //         if (measurementType === 'kg') {
    //             // Allow up to two decimal places for kilograms
    //             numericValue = parseFloat(numericValue.toFixed(2));
    //         } else {
    //             // Force whole numbers for other measurement types (piece, box)
    //             numericValue = Math.floor(numericValue);
    //         }
    
    //         // Ensure weight does not exceed the originally ordered product weight
    //         const weight = Math.min(numericValue, orderItems[index].productWeight);
    
    //         const newWeights = [...editableWeights];
    //         newWeights[index] = value === '' ? 0 : weight; // Allow empty value temporarily for editing
    //         setEditableWeights(newWeights);
    //     }
    // };
    // const changeWeight = (productId, value, productCategory, productMeasurement) => {
    //     // const weightValue = parseFloat(value);
    //     let validValue;
    //     if (productCategory === 'Keerai'|| productMeasurement === 'Box') {
    //         validValue = value.match(/^\d*$/) ? value : weight[productId]; // Only whole numbers allowed
    //     } else {
    //         // For non-"Keerai", allow up to two decimal places
    //         validValue = value.match(/^\d*\.?\d{0,2}$/) ? value : weight[productId];
    //     }

    //     // Allow empty value for resetting
    //     if (value === '') {
    //         setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //         return;
    //     }

    //     const weightValue = parseFloat(validValue);

    //     if (weightValue < 0) {
    //         return;
    //     }

    //     // if (isNaN(weightValue) || value === '') {
    //     //     setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //     //     return;
    //     // }

    //     // Handling Keerai (bundle) weight
    //     if (!weightvalue) {
    //         if (productCategory === 'Keerai') {
    //             if (weightValue > 10) {
    //                 setweightvalue(true);
    //                 if (!weightvalue) {
    //                     toast.dismiss();
    //                     setTimeout(() => {
    //                         toast.error('Bundle count cannot exceed 10', {
    //                             position: 'bottom-center',
    //                             type: 'error',
    //                             autoClose: 700,
    //                             transition: Slide,
    //                             hideProgressBar: true,
    //                             className: 'small-toast',
    //                         });
    //                         setweightvalue(false);
    //                     }, 300);
    //                     setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //                     return;
    //                 }
    //             }
    //         } 
    //         else if ( productMeasurement === 'Box') {
    //             if (weightValue > 10) {
    //                 setweightvalue(true);
    //                 if (!weightvalue) {
    //                     toast.dismiss();
    //                     setTimeout(() => {
    //                         toast.error('Box count cannot exceed 10', {
    //                             position: 'bottom-center',
    //                             type: 'error',
    //                             autoClose: 700,
    //                             transition: Slide,
    //                             hideProgressBar: true,
    //                             className: 'small-toast',
    //                         });
    //                         setweightvalue(false);
    //                     }, 300);
    //                     setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //                     return;
    //                 }
    //             }
    //         }
    //         else if (weightValue > 5) {
    //             // Handling non-Keerai weight limit (Kg)
    //             setweightvalue(true);
    //             if (!weightvalue) {
    //                 toast.dismiss();
    //                 setTimeout(() => {
    //                     toast.error('Weight cannot exceed 5Kg', {
    //                         position: 'bottom-center',
    //                         type: 'error',
    //                         autoClose: 700,
    //                         transition: Slide,
    //                         hideProgressBar: true,
    //                         className: 'small-toast',
    //                     });
    //                     setweightvalue(false);
    //                 }, 300);
    //                 setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //                 return;
    //             }
    //         }
    //         setWeight(prevWeights => ({ ...prevWeights, [productId]: weightValue }));
    //     }

    // };





    const handleBlur = (index) => {
        if (editableWeights[index] === '' || editableWeights[index] === null) {
            const newWeights = [...editableWeights];
            newWeights[index] = orderItems[index].productWeight;
            setEditableWeights(newWeights);
        }
    };
    const updatedItems = orderItems && orderItems.map((item, index) => ({
        ...item,
        status: editableWeights[index] > 0 ? 'confirm' : 'cancel',
        productWeight: editableWeights[index]
    }));
    const handlePack = async (e) => {
        e.preventDefault();
        const dispatchedAmount = calculateTotalDispatchedAmount(updatedItems && updatedItems);
        setTotalDispatchedAmount(dispatchedAmount); // Update the total dispatched amount

        // Open modal
        setShowModal(true);
    };

    const submitHandlerPacked = async (e) => {
        e.preventDefault();

        // const updatedItems = orderItems.map((item, index) => ({
        //     ...item,
        //     status: editableWeights[index] > 0 ? 'confirm' : 'cancel',
        //     productWeight: editableWeights[index]
        // }));

        // const currentDate = new Date();
        // const currentHour = currentDate.getHours();
        // let orderDate;

        // if (currentHour < 21) { // Before 9 PM
        //     orderDate = new Date(currentDate);
        //     orderDate.setDate(orderDate.getDate() + 1); // Next day
        //     // setOrderDescription(The order will be delivered on this day: ${orderDate.toDateString()});
        // } else { // After 9 PM
        //     orderDate = new Date(currentDate);
        //     orderDate.setDate(orderDate.getDate() + 2); // Day after tomorrow
        //     // setOrderDescription(The order will be delivered on this day: ${orderDate.toDateString()});
        // }

        let totalDispatchedAmount = 0;
        let totalRefundableAmount = 0;

        const dispatchedTable = orderItems.map((item, index) => {
            const orderedWeight = parseFloat(item.productWeight);
            const measurement = item.measurement;
            const dispatchedWeight = parseFloat(updatedItems[index].productWeight);
            const refundableWeight = parseFloat((orderedWeight - dispatchedWeight).toFixed(2)); // Keeping two decimal places
            const pricePerKg = parseFloat((item.price).toFixed(2)); // Keeping two decimal places
            const totalAmount = parseFloat((dispatchedWeight * pricePerKg).toFixed(2));
            const refundableAmount = parseFloat((refundableWeight * pricePerKg).toFixed(2)); // Keeping two decimal places

            totalRefundableAmount += refundableAmount;

            totalDispatchedAmount += totalAmount;

            return {
                image: item.image,
                name: item.name,
                orderedWeight,
                measurement,
                pricePerKg,
                dispatchedWeight,
                refundableWeight,
                // orderDate
                // totalRefundableAmount,
                // totalDispatchedAmount,
            };
        });

        totalDispatchedAmount = parseFloat(totalDispatchedAmount.toFixed(2)); // Keeping two decimal places
        totalRefundableAmount = parseFloat(totalRefundableAmount.toFixed(2)); // Keeping two decimal places


        // console.log("dispatchedTable", dispatchedTable);
        // console.log(Total Amount: ₹${totalDispatchedAmount});

        const reqPackedData = {
            user: user,
            // request_id: requestId,
            user_id: user._id,
            order_id: orderDetail.order_id,
            orderDetail: orderDetail,
            updatedItems: updatedItems,
            dispatchedTable: dispatchedTable,
            orderDate: orderDetail.orderDate,
            totalDispatchedAmount: totalDispatchedAmount,
            totalRefundableAmount: totalRefundableAmount
        };
        console.log('reqPackedData', reqPackedData);

        try {
            await dispatch(packedOrder({ reqPackedData }));
            // setShowDispatchModal(false);
            // setRefreshData(true)
            // await dispatch(getporterOrder({ order_id: id }));
        } catch (error) {
            // toast.error(error);
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
            // setRefreshData(true)
        }



    }

    useEffect(() => {
        // if (isOrderUpdated) {
        //     toast('Order Updated Successfully!', {
        //         type: 'success',
        //         position: "bottom-center",
        //         onOpen: () => dispatch(clearOrderUpdated())
        //     });
        //     dispatch(adminOrders());
        //     return

        // }
        // if (error) {
        //     toast(error, {
        //         position: "bottom-center",
        //         type: 'error',
        //         onOpen: () => { dispatch(clearError()) }
        //     });
        // }
        // if (portererror) {
        //     toast(portererror, {
        //         position: "bottom-center",
        //         type: 'error',
        //         onOpen: () => { dispatch(clearError()) }
        //     });
        // }
        dispatch(orderDetailAction(id));
        dispatch(getporterOrder({ order_id: id }));
        dispatch(getPackedOrder({ order_id: id }));
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
        setRefreshData(true)

    }, [dispatch, id, porterOrderDetail]);

    // useEffect(() => {

    // })
    useEffect(() => {
        if (packedOrderData) {
            // toast('Order Updated Successfully!', {
            //     type: 'success',
            //     position: "bottom-center",
            //     onOpen: () => dispatch(clearOrderUpdated())
            // });
            toast.dismiss();
            setTimeout(() => {
                toast.success('Order Updated Successfully!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onClose: () => dispatch(clearpackedUpdated())
                });
                setTimeout(() => {
                    dispatch(adminOrders());
                    dispatch(orderDetailAction(id));
                    dispatch(getporterOrder({ order_id: id }));
                    dispatch(getPackedOrder({ order_id: id }));
                }, 700);

            }, 300);
            setShowModal(false);

        }
        if (packedOrderError) {
            toast.dismiss();
            setTimeout(() => {
                toast.error(packedOrderError, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onClose: () => dispatch(clearpackedUpdated())
                });

            }, 300);
            setShowModal(false);
        }
    }, [packedOrderData, packedOrderError])

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

    // useEffect(() => {
    //     const handlePorterOrder = async () => {
    //         if (porterOrderResponse || refreshData) {
    //             await dispatch(porterClearResponse());
    //             await dispatch(porterClearData());
    //             await dispatch(getporterOrder({ order_id: id }));
    //         }
    //     };

    //     handlePorterOrder();
    // }, [porterOrderResponse, refreshData])

    // console.log("getpackedOrderData",getpackedOrderData);

    return (
        <div>
            <MetaData
                title="Update Order"
                description="Modify order details, update order status, and handle special requests from customers to ensure order accuracy."
            />



            <div className="row loader-parent">
                {/* <MetaData title={`Update Order`} /> */}
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
                        ) : (
                            <Fragment>
                                {/* <div className="row d-flex justify-content-around"> */}
                                <div className="col-12 col-lg-12 mt-5 order-details">
                                    <h1 className="my-5">Order # {orderDetail.order_id}</h1>

                                    <h4 className="mb-4">Shipping Info</h4>
                                    <div><b>Name:</b> {user.name}</div>
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
                                            <table className="updatetable updatetable-bordered">
                                                <thead>
                                                    <tr>
                                                        {getpackedOrderData && getpackedOrderData.dispatchedTable ? (
                                                            <>
                                                                <th>Image</th>
                                                                <th>Name</th>
                                                                <th>Ordered Quantity</th>
                                                                <th>Price per kg</th>
                                                                <th>Dispatched Quantity</th>
                                                                <th>Refundable Weight</th>
                                                                <th>Refundable Amount</th>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <th>Select Item</th>
                                                                <th>Image</th>
                                                                <th>Name</th>
                                                                <th>Price per kg</th>
                                                                <th>Ordered Quantity</th>
                                                                <th>Dispatch Quantity</th>
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
                                                                <td>
                                                                    <img src={item.image} alt={item.name} className="updateTableproduct-image" />
                                                                </td>
                                                                <td>{item.name}</td>
                                                                <td>{item.orderedWeight} {item.measurement}</td>
                                                                <td>Rs. {item.pricePerKg}</td>
                                                                <td>{item.dispatchedWeight ? item.dispatchedWeight : 0} {item.measurement}</td>
                                                                <td>{item.refundableWeight ? item.refundableWeight : 0} {item.measurement}</td>
                                                                <td>Rs. {item.refundableWeight ? item.refundableWeight * item.pricePerKg : 0}</td>

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
                                                                    <td>{item.productWeight} {item.measurement}</td>
                                                                    {editableWeights && (
                                                                        <>
                                                                            <td style={{ maxWidth: '70px' }}>
                                                                                <NumberInput
                                                                                    type="number"
                                                                                    className="no-arrow-input form-control updateTableInput"
                                                                                    value={editableWeights[index] === 0 ? '' : editableWeights[index]}
                                                                                    step="0.01"
                                                                                    onChange={(e) => changeWeight(e, index)}
                                                                                    placeholder={editableWeights[index] === 0 ? 0 : ''}
                                                                                    onBlur={() => handleBlur(index)}
                                                                                    disabled={!selectedItems[index]}
                                                                                    required
                                                                                />
                                                                                {/* <input
                                                                                    type="text"  // Keep it as text to handle decimals correctly
                                                                                    className="no-arrow-input form-control updateTableInput"
                                                                                    value={editableWeights[index] === 0 ? '' : editableWeights[index]}
                                                                                    onChange={(e) => changeWeight(e, index)}
                                                                                    placeholder={editableWeights[index] === 0 ? '' : 0}
                                                                                    onBlur={() => handleBlur(index)}
                                                                                    disabled={!selectedItems[index]}
                                                                                    required
                                                                                /> */}
                                                                            </td>
                                                                            <td>Rs. {(editableWeights[index] * item.price).toFixed(2)}</td>
                                                                        </>
                                                                    )}
                                                                    {/* <td>{product.stocks ? <p>{product.stocks}</p> : <p>Out of Stock</p>}</td> */}
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
                                        {/* <button className='btn btn-primary' onClick={submitHandler} disabled={dropStatus === "Dispatched"}>Dispatch</button> */}
                                        <button className='btn btn-primary' onClick={(e) => handlePack(e)} disabled={dropStatus === "Processing" ? false : true} style={{ cursor: (dropStatus === "Processing") ? 'pointer' : 'not-allowed' }}>{dropStatus === "Processing" ? 'Pack' : dropStatus === "Cancelled" ? 'Already Cancelled' : dropStatus === "Dispatched" ? 'Already Dispatched' : dropStatus === "Packed" ? 'Already Packed' : dropStatus}</button>

                                    </div>

                                    {/* {porterOrderData && (
                 <div style={{marginTop:'20px'}}>
                    <button onClick={handlePrint} className='btn btn-primary'>Download Invoice</button>
                    {ReactDOM.createPortal(
                        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: '-9999999999' }}>
                            <JasInvoice ref={invoiceRef} invoice={packedOrderData} />
                        </div>,
                        document.body
                    )}
                </div>

            )

            } */}


                                    {/* {porterOrderData && (
                                    <Invoice porterOrderData={porterOrderData} />

                                )

                                } */}
                                </div>
                            </Fragment>
                        )
                    }
                </div>



            </div>
            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Action</h5>
                                <button type="button" className="close" disabled={packedloading} onClick={() => setShowModal(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {totalDispatchedAmount > 0 ? (
                                    <p>Do you want to confirm the pack?</p>
                                ) : (
                                    <p>There is no item to pack. Please confirm to cancel this order.</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                {totalDispatchedAmount > 0 ? (
                                    <button type="button" disabled={packedloading} className="btn btn-primary" onClick={submitHandlerPacked}>

                                        {packedloading ? <LoaderButton fullPage={false} size={20} /> : (
                                            <span>Confirm Pack</span>
                                        )

                                        }
                                    </button>
                                ) : (
                                    <button type="button" disabled={packedloading} className="btn btn-danger" onClick={submitHandlerPacked}>


                                        {packedloading ? <LoaderButton fullPage={false} size={20} /> : (
                                            <span>Cancel Order</span>
                                        )

                                        }
                                    </button>
                                )}
                                {/* <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );



};

export default UpdateOrder;