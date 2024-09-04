// import React, { useEffect, Fragment, useState } from 'react';
// import { Button } from "react-bootstrap";
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from "react-router-dom";
// import { deleteOrder, adminOrders as adminOrdersAction } from "../../actions/orderActions"
// import Loader from '../Layouts/Loader';
// import { MDBDataTable } from 'mdbreact';
// import { toast } from 'react-toastify';
// import Sidebar from "../admin/Sidebar";
// import { clearError } from '../../slices/productsSlice';
// import { clearOrderDeleted } from "../../slices/orderSlice";

// const AllOrders = () => {
//     const { adminOrders: orders = [], loading = true, error, isOrderDeleted } = useSelector(state => state.orderState);
//     console.log("orders", orders);

//     // Initialize the date with the current date
//     const previousDate = new Date();
//     previousDate.setDate(previousDate.getDate() );
//     const formattedPreviousDate = previousDate.toISOString().split('T')[0];

//     const [date, setDate] = useState(formattedPreviousDate);
//     const [refresh,setRefresh]=useState(false);
    


//     console.log("date", date);

//     const dispatch = useDispatch();

//     const setOrders = () => {
//         const data = {
//             columns: [
//                 {
//                     label: 'S.No',
//                     field: 's_no',
//                     sort: 'asc'
//                 },
//                 {
//                     label: 'ID',
//                     field: 'id',
//                     sort: 'asc'
//                 },
//                 {
//                     label: 'Name',
//                     field: 'name',
//                     sort: 'asc'
//                 },
//                 {
//                     label: 'Phone.No',
//                     field: 'phone_no',
//                     sort: 'asc'
//                 },
//                 {
//                     label: 'Email',
//                     field: 'email',
//                     sort: 'asc'
//                 },
//                 // {
//                 //     label: 'Number of Items',
//                 //     field: 'noOfItems',
//                 //     sort: 'asc'
//                 // },
//                 {
//                     label: 'Amount',
//                     field: 'amount',
//                     sort: 'asc'
//                 },
//                 {
//                     label: 'OrderStatus',
//                     field: 'orderstatus',
//                     sort: 'asc'
//                 },
//                 {
//                     label: 'PaymentStatus',
//                     field: 'paymentstatus',
//                     sort: 'asc'
//                 },
//                 {
//                     label: 'Actions',
//                     field: 'actions',
//                     sort: 'asc'
//                 }
//             ],
//             rows: []
//         };

//         // Filter and validate orders by selected date
//         const filteredOrders = orders.filter(order => {
//             if (!order.orderDate) return false; // Skip orders with no orderDate

//             // Attempt to parse the orderDate
//             const orderDate = new Date(order.orderDate);
//             if (isNaN(orderDate.getTime())) return false; // Skip invalid dates

//             // Compare the date part only (ignoring time)
//             return orderDate.toISOString().split('T')[0] === date && order.paymentStatus === 'CHARGED' && order.orderStatus === 'Processing'|| order.orderStatus === 'Packed';
//         });



//         // Sort orders by creation date (newest first)
//         const sortedOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//         sortedOrders.filter(order => order.paymentStatus === 'CHARGED').forEach((order, index) => {
//             data.rows.push({
//                 s_no: index + 1,
//                 id: order.order_id,
//                 name: order.user.name,
//                 phone_no: order.shippingInfo.phoneNo,
//                 email: order.user.email,
//                 // noOfItems: order.orderItems.length,
//                 amount: `Rs.${order.totalPrice}`,
//                 orderstatus: (
//                     <p className={order.orderStatus && order.orderStatus.includes('Delivered') ? 'greenColor' : 'redColor'} ><p>{order.orderStatus}</p></p>
//                 ),
//                 paymentstatus: (
//                     <p className='greenColor'><p>{order.paymentStatus}</p></p>
//                 ),
//                 actions: (
//                     <Fragment>
//                         <Link to={`/admin/order/${order.order_id}`} className="btn btn-primary py-1 px-2 ml-2">
//                             <i className="fa fa-pencil"></i>
//                         </Link>
//                         {/* <Button onClick={e => deleteHandler(e, order._id)} className="btn btn-danger py-1 px-2 ml-2">
//                             <i className="fa fa-trash"></i>
//                         </Button> */}
//                     </Fragment>
//                 )
//             });
//         });

//         return data;
//     };


//     // const deleteHandler = (e, id) => {
//     //     e.target.disabled = true;
//     //     dispatch(deleteOrder(id));
//     // };

//     useEffect(() => {
//         if (error) {
//             toast(error, {
//                 position: "bottom-center",
//                 type: 'error',
//                 onOpen: () => { dispatch(clearError()) }
//             });
//             return;
//         }
//         if (isOrderDeleted) {
//             toast('Order Deleted Successfully!', {
//                 type: 'success',
//                 position: "bottom-center",
//                 onOpen: () => dispatch(clearOrderDeleted())
//             });
//             return;
//         }

//         dispatch(adminOrdersAction());
//     }, [dispatch, error, isOrderDeleted]);
//     console.log("date", date)

//     return (
//         <div className="row">
//             <div className="col-12 col-md-2">
//                 <Sidebar />
//             </div>
//             <div className="col-12 col-md-10">
//                 <h1 className="my-4">Order List</h1>
//                 <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="form-control mb-3 date-input"
//                 />
//                 <Fragment>
//                     {loading ? <Loader /> :
//                         <MDBDataTable
//                             data={setOrders()}
//                             bordered
//                             hover
//                             className="px-3 product-table"
//                             noBottomColumns
//                         />
//                     }
//                 </Fragment>
//             </div>

//         </div>
//     );
// };

// export default AllOrders;


import React, { useEffect, Fragment, useState } from 'react';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { adminOrders as adminOrdersAction } from "../../actions/orderActions";
import Loader from '../Layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import { clearError } from '../../slices/productsSlice';
import { clearOrderDeleted } from "../../slices/orderSlice";
import MetaData from '../Layouts/MetaData';

const AllOrders = () => {
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const { adminOrders: orders = [], loading = true, error, isOrderDeleted } = useSelector(state => state.orderState);
    // const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [date, setDate] = useState('');
    console.log("allorders",orders)

    const dispatch = useDispatch();

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

         // Sort orders by creation date (newest first)
         const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          // Filter orders by selected date and specific conditions
          const filteredOrders = sortedOrders.filter(order => {
            if (!order.orderDate) return false;

            // Parse order date and match it with the selected date
            const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
            const matchesDate = date ? orderDate === date : true; // Match only if date is set
            const matchesStatus = order.paymentStatus === 'CHARGED' && (order.orderStatus === 'Processing' || order.orderStatus === 'Packed');

            return matchesDate && matchesStatus;
        });
       
            // Map the filtered orders to table rows
            // sortedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).forEach((order, index) => {
                 filteredOrders.forEach((order, index) => {
                data.rows.push({
                    s_no: index + 1,
                    id: order.order_id,
                    name: order.user.name,
                    phone_no: order.shippingInfo.phoneNo,
                    email: order.user.email,
                    amount: `Rs.${order.totalPrice}`,
                    orderstatus: (
                        <p className={order.orderStatus.includes('Delivered') ? 'greenColor' : 'redColor'}>
                            {order.orderStatus}
                        </p>
                    ),
                    paymentstatus: (
                        <p className='greenColor'>
                            {order.paymentStatus}
                        </p>
                    ),
                    actions: (
                        <Fragment>
                            <Link to={`/admin/order/${order.order_id}`} className="btn btn-primary py-1 px-2 ml-2">
                                <i className="fa fa-pencil"></i>
                            </Link>
                        </Fragment>
                    )
                });
            });
        // }

        return data;
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "bottom-center",
                onOpen: () => { dispatch(clearError()) }
            });
        }

        if (isOrderDeleted) {
            toast.success('Order Deleted Successfully!', {
                position: "bottom-center",
                onOpen: () => dispatch(clearOrderDeleted())
            });
        }

        dispatch(adminOrdersAction());
    }, [dispatch, error, isOrderDeleted]);

    return (
        <div>
             <MetaData title={`Order list`} />
      
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10 smalldevice-space">
                <h1 className="my-4 admin-dashboard-x">All Orders</h1>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-control mb-3 date-input"
                />
                <div className='mdb-table' style={{display:'flex',justifyContent:'center', alignItems:'center'}}>
                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setOrders()}
                            bordered
                            hover
                            className="px-3 product-table"
                            noBottomColumns
                        />
                    }
                </Fragment>
                </div>
            </div>
        </div>
        </div>
    );
};

export default AllOrders;

