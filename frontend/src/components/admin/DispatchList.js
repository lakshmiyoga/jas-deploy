import React, { useEffect, Fragment, useState } from 'react';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { deleteOrder, adminOrders as adminOrdersAction, updateadminOrders } from "../../actions/orderActions"
import { orderDetail as orderDetailAction } from '../../actions/orderActions';
import Loader from '../Layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import { clearError } from '../../slices/productsSlice';
import { clearOrderDeleted, adminOrderClear, orderDetailClear } from "../../slices/orderSlice";
import MetaData from '../Layouts/MetaData';
import { porterClearData, porterClearResponse } from '../../slices/porterSlice';

const DispatchList = ({ isActive, setIsActive }) => {
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const { adminOrders: orders, loading, error, isOrderDeleted, updateadminOrders: orderlist = [] } = useSelector(state => state.orderState);
    console.log(orders);

    const dispatch = useDispatch();
    // const [updatedOrders, setUpdatedOrders] = useState([]);
    // console.log("updatedOrders",updatedOrders)
    // Initialize the date with the current date
    const previousDate = new Date();
    previousDate.setDate(previousDate.getDate());
    const formattedPreviousDate = previousDate.toISOString().split('T')[0];

    const [date, setDate] = useState(formattedPreviousDate);
    const [refresh, setRefresh] = useState(false);
    const [pageloading, setPageLoading] = useState(true)

    useEffect(() => {
        dispatch(orderDetailClear());
        dispatch(porterClearData());
        dispatch(porterClearResponse());
    }, [])
    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'S.No',
                    field: 's_no',
                    sort: 'disabled'
                },
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'disabled'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'disabled'
                },
                {
                    label: 'Phone.No',
                    field: 'phone_no',
                    sort: 'disabled'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'disabled'
                },
                // {
                //     label: 'Number of Items',
                //     field: 'noOfItems',
                //     sort: 'disabled'
                // },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'disabled'
                },
                {
                    label: 'OrderStatus',
                    field: 'orderstatus',
                    sort: 'disabled'
                },
                {
                    label: 'PaymentStatus',
                    field: 'paymentstatus',
                    sort: 'disabled'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'disabled'
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
        const sortedOrders = filteredOrders && filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


        sortedOrders && sortedOrders.filter(order => order.paymentStatus === 'CHARGED' && order.orderStatus !== 'Processing').forEach((order, index) => {
            data.rows.push({
                s_no: index + 1,
                id: order.order_id,
                name: order.user.name,
                phone_no: order.shippingInfo.phoneNo,
                email: order.user.email,
                // noOfItems: order.orderItems.length,
                amount: `Rs.${order.totalPrice}`,
                orderstatus: (
                    <div className={order.orderStatus && order.orderStatus.includes('Delivered') ? 'greenColor' : 'redColor'} >{order.orderStatus}</div>
                ),
                paymentstatus: (
                    <div className='greenColor'>{order.paymentStatus}</div>
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
        // dispatch(adminOrdersAction());

    }, [dispatch, error, refresh]);

    useEffect(() => {
        if (!orders) {
            dispatch(adminOrdersAction());
        }
    }, [orders])

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
        <div>
            <MetaData title={`Dispatch List`} />

            <div className="row loader-parent">
                <div className="col-12 col-md-2">
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>
                <div className="col-12 col-md-10 smalldevice-space loader-parent">
                    <h1 className="mb-4 admin-dashboard-x">Dispatch List</h1>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-control mb-3 date-input"
                    />

                    <Fragment>
                        {loading ? (<div className="container loader-loading-center">
                            <Loader />
                        </div>)
                            :
                            orders && (
                                <div className='mdb-table' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <MDBDataTable
                                        data={setOrders()}
                                        bordered
                                        hover
                                        className="px-3 product-table"
                                        noBottomColumns
                                    />
                                </div>
                            )

                        }
                    </Fragment>
                </div>
            </div>
        </div>

    );
};

export default DispatchList;

