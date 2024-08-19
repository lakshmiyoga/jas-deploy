import React, { useEffect, Fragment , useState} from 'react';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { deleteOrder, adminOrders as adminOrdersAction, updateadminOrders } from "../../actions/orderActions"
import {orderDetail as orderDetailAction } from '../../actions/orderActions';
import Loader from '../Layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import { clearError } from '../../slices/productsSlice';
import { clearOrderDeleted ,adminOrderClear} from "../../slices/orderSlice";

const DispatchList = () => {
    const { adminOrders: orders = [], loading, error, isOrderDeleted ,updateadminOrders:orderlist=[]}  = useSelector(state => state.orderState);
    console.log(orders);
    
    const dispatch = useDispatch();
    // const [updatedOrders, setUpdatedOrders] = useState([]);
// console.log("updatedOrders",updatedOrders)
    // Initialize the date with the current date
    const previousDate = new Date();
    previousDate.setDate(previousDate.getDate() );
    const formattedPreviousDate = previousDate.toISOString().split('T')[0];

    const [date, setDate] = useState(formattedPreviousDate);
    const [refresh,setRefresh]=useState(false);
    const [pageloading, setPageLoading] = useState(true)


    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'S.No',
                    field: 's_no',
                    sort: 'asc'
                },
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Phone.No',
                    field: 'phone_no',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                // {
                //     label: 'Number of Items',
                //     field: 'noOfItems',
                //     sort: 'asc'
                // },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'OrderStatus',
                    field: 'orderstatus',
                    sort: 'asc'
                },
                {
                    label: 'PaymentStatus',
                    field: 'paymentstatus',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ],
            rows: []
        };

         // Filter and validate orders by selected date
         const filteredOrders = orders && orders.filter(order => {
            if (!order.orderDate) return false; // Skip orders with no orderDate

            // Attempt to parse the orderDate
            const orderDate = new Date(order.orderDate);
            if (isNaN(orderDate.getTime())) return false; // Skip invalid dates

            // Compare the date part only (ignoring time)
            return orderDate.toISOString().split('T')[0] === date && order.paymentStatus === 'CHARGED';
        });

        // Sort orders by creation date (newest first)
        const sortedOrders = filteredOrders &&  filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        

        sortedOrders && sortedOrders.filter(order => order.paymentStatus === 'CHARGED' && order.orderStatus !== 'Processing' ).forEach((order, index) => {
            data.rows.push({
                s_no: index + 1,
                id: order.order_id,
                name:order.user.name,
                phone_no:order.shippingInfo.phoneNo,
                email:order.user.email,
                // noOfItems: order.orderItems.length,
                amount: `Rs.${order.totalPrice}`,
                orderstatus: (
                    <p className={order.orderStatus && order.orderStatus.includes('Delivered') ? 'greenColor' : 'redColor' } ><p>{order.orderStatus}</p></p>
                ),
                paymentstatus: (
                    <p className='greenColor'><p>{order.paymentStatus}</p></p>
                ),
                actions: (
                    <Fragment>
                        <Link to={`/admin/dispatch/${order.order_id}`} className="btn btn-primary py-1 px-2 ml-2">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        {/* <Button onClick={e => deleteHandler(e, order._id)} className="btn btn-danger py-1 px-2 ml-2">
                            <i className="fa fa-trash"></i>
                        </Button> */}
                    </Fragment>
                )
            });
        });

        return data;
    };


    // const deleteHandler = (e, id) => {
    //     e.target.disabled = true;
    //     dispatch(deleteOrder(id));
    // };

    useEffect(() => {
        if (error) {
            toast(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            });
            return;
        }
        // if (isOrderDeleted) {
        //     toast('Order Deleted Successfully!', {
        //         type: 'success',
        //         position: "bottom-center",
        //         onOpen: () => dispatch(clearOrderDeleted())
        //     });
        //     return;
        // }
        // if(refresh){
        //     dispatch(updateadminOrders());
        //     // setRefresh(false)
        //     // setPageLoading(false)
        // }
        dispatch(adminOrdersAction());
        
    }, [dispatch, error,refresh]);

//   useEffect(()=>{
//     const updateOrders = async () => {
//         // await dispatch(adminOrderClear());
//         await dispatch(adminOrdersAction());
//         if(orders){
//             const filteredOrders = orders.filter(order => {
//                 if (!order.orderDate) return false;
    
//                 const orderDate = new Date(order.orderDate);
//                 if (isNaN(orderDate.getTime())) return false;
    
//                 return orderDate.toISOString().split('T')[0] === date && order.paymentStatus === 'CHARGED';
//             });
    
//             const sortedOrders = filteredOrders && filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
//             // Update each order and wait for all updates to complete
//             await Promise.all(
//                 sortedOrders
//                     .filter(order => order.paymentStatus === 'CHARGED' && order.orderStatus !== 'Processing')
//                     .map(order => dispatch(orderDetailAction(order.order_id)))
//             );
    
//             // Set refresh to true after all updates are completed
//             setRefresh(true);
//         }

       
//     };

//     updateOrders();

//   },[])

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Dispatch List</h1>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-control mb-3 date-input"
                />
                <Fragment>
                    {loading ? <Loader /> :
                    orders && (
                        <MDBDataTable
                        data={setOrders()}
                        bordered
                        hover
                        className="px-3 product-table"
                        noBottomColumns
                    />
                    )
                      
                    }
                </Fragment>
            </div>
        </div>
    );
};

export default DispatchList;

