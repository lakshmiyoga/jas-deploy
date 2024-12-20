import React, { useEffect, Fragment, useState } from 'react';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { deleteOrder, adminOrders as adminOrdersAction } from "../../actions/orderActions"
import { allPackedOrder, getporterOrder, updatedPackedOrder } from "../../actions/porterActions"
import Loader from '../Layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { Slide, toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import { clearError } from '../../slices/productsSlice';
import { clearOrderDeleted, orderDetailClear } from "../../slices/orderSlice";
import MetaData from '../Layouts/MetaData';
import { porterClearData, porterClearResponse } from '../../slices/porterSlice';

const RefundList = ({ isActive, setIsActive }) => {
    // const { adminOrders: orders = [], error, isOrderDeleted }  = useSelector(state => state.orderState);
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const { loading, allpackedOrderData: orders, allpackedOrderError, updatepackedOrderData: orderslist } = useSelector(state => state.porterState);
    console.log("orderslist", orderslist);

    const dispatch = useDispatch();


    // Initialize the date with the current date
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().split('T')[0];

    const [date, setDate] = useState(formattedCurrentDate);
    const [iserror, setIserror] = useState(false);
    const [refresh, setRefresh] = useState(false);
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
                // {
                //     label: 'Amount',
                //     field: 'amount',
                //     sort: 'disabled'
                // },
                {
                    label: 'RefundStatus',
                    field: 'refundstatus',
                    sort: 'disabled'
                },
                // {
                //     label: 'PaymentStatus',
                //     field: 'paymentstatus',
                //     sort: 'disabled'
                // },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'disabled'
                }
            ],
            rows: []
        };

        // Filter and validate orders by selected date
        const filteredRefundOrders = orderslist && orderslist.filter(order => {
            if (!order.orderDate) return false; // Skip orders with no orderDate

            // Attempt to parse the orderDate
            const orderDate = new Date(order.orderDate);
            if (isNaN(orderDate.getTime())) return false; // Skip invalid dates

            // Compare the date part only (ignoring time)
            return orderDate.toISOString().split('T')[0] === date && order && order.orderDetail && order.orderDetail.statusResponse.status === 'CHARGED';
        });
        console.log("filteredRefundOrders", filteredRefundOrders)

        // Sort orders by creation date (newest first)
        const sortedOrders = filteredRefundOrders && filteredRefundOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log("sortedOrders", sortedOrders)

        sortedOrders && sortedOrders.filter(order => order.totalRefundableAmount > 0).forEach((order, index) => {
            data.rows.push({
                s_no: index + 1,
                id: order.order_id,
                name: order.user.name,
                phone_no: order.orderDetail && order.orderDetail.shippingInfo && order.orderDetail.shippingInfo.phoneNo,
                email: order.user.email,
                // noOfItems: order.orderItems.length,
                // amount: `Rs.${order.totalPrice}`,
                refundstatus: (
                    <div className={order.refundStatus && order.refundStatus.includes('SUCCESS') ? 'greenColor' : 'redColor'} >{order.refundStatus}</div>
                ),
                // paymentstatus: (
                //     <p className='greenColor'><p>{order.paymentStatus}</p></p>
                // ),
                actions: (
                    <Fragment>
                        <Link to={`/admin/refund/${order.order_id}`} className="btn btn-primary py-1 px-2 ml-2">
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


    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteOrder(id));
    };

    useEffect(() => {
        if (allpackedOrderError) {
            // toast(allpackedOrderError, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => { dispatch(clearError()) }
            // });
            toast.dismiss();
            setTimeout(() => {
                toast.error(allpackedOrderError, { 
                    position: 'bottom-center',
                    type:'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearError()) }
                });
            }, 300);
            setIserror(true)
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
        // dispatch(updatedPackedOrder({}));
        // }

    }, [dispatch, allpackedOrderError, refresh]);

    useEffect(() => {
        if (!orderslist && !iserror) {
            dispatch(updatedPackedOrder({}));
        }
    }, [orderslist, iserror])





    // useEffect(() => {
    //     const updateOrders = async () => {

    //         dispatch(allPackedOrder({}));

    //         const filteredOrders = orders.filter(order => {
    //             if (!order.createdAt) return false;

    //             const orderDate = new Date(order.createdAt);
    //             if (isNaN(orderDate.getTime())) return false;

    //             return orderDate.toISOString().split('T')[0] === date && order && order.orderDetail && order.orderDetail.statusResponse.status === 'CHARGED';
    //         });

    //         const sortedOrders = filteredOrders && filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    //         // Update each order and wait for all updates to complete
    //         await Promise.all(
    //             sortedOrders
    //                 .filter(order => order.totalRefundableAmount > 0)
    //                 .map(order => dispatch(getporterOrder({ order_id: order.order_id })))
    //         );

    //         // Set refresh to true after all updates are completed
    //         setRefresh(true);
    //     };

    //     updateOrders();

    // }, [])

    return (
        <div>
            {/* <MetaData title={`Refund List`} /> */}
            <MetaData 
  title="Refund List" 
  description="Review and process customer refund requests. Ensure prompt handling of refunds to maintain customer trust and satisfaction." 
/>


            <div className="row loader-parent" >
                <div className="col-12 col-md-2">
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>
                <div className="col-12 col-md-10 smalldevice-space container loader-parent">
                    <h1 className="mb-4">Refund List</h1>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-control mb-3 date-input"
                    />

                    <Fragment>
                        {loading ? (
                            <div className="container loader-loading-center">
                                <Loader />
                            </div>

                        ) :
                            (
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

export default RefundList;
