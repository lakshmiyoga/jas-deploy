import React, { useEffect, Fragment } from 'react';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { deleteOrder, adminOrders as adminOrdersAction } from "../../actions/orderActions"
import {allPackedOrder } from "../../actions/porterActions"
import Loader from '../Layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import { clearError } from '../../slices/productsSlice';
import { clearOrderDeleted } from "../../slices/orderSlice";

const RefundList = () => {
    // const { adminOrders: orders = [], loading = true, error, isOrderDeleted }  = useSelector(state => state.orderState);
    const { loading,allpackedOrderData: orders = [],allpackedOrderError }  = useSelector(state => state.porterState);
    console.log("allpackedOrderData",orders,allpackedOrderError);
    
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
                // {
                //     label: 'Number of Items',
                //     field: 'noOfItems',
                //     sort: 'asc'
                // },
                // {
                //     label: 'Amount',
                //     field: 'amount',
                //     sort: 'asc'
                // },
                {
                    label: 'RefundStatus',
                    field: 'refundstatus',
                    sort: 'asc'
                },
                // {
                //     label: 'PaymentStatus',
                //     field: 'paymentstatus',
                //     sort: 'asc'
                // },
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
        console.log("sortedOrders",sortedOrders)

        sortedOrders.filter(order => order.totalRefundableAmount> 0).forEach((order, index) => {
            data.rows.push({
                s_no: index + 1,
                id: order.order_id,
                name:order.user.name,
                phone_no: order.orderDetail && order.orderDetail.shippingInfo && order.orderDetail.shippingInfo.phoneNo,
                email:order.user.email,
                // noOfItems: order.orderItems.length,
                // amount: `Rs.${order.totalPrice}`,
                refundstatus: (
                    <p className={order.refundStatus && order.refundStatus.includes('Success') ? 'greenColor' : 'redColor' } ><p>{order.refundStatus}</p></p>
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
            toast(allpackedOrderError, {
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

        dispatch(allPackedOrder({}));
    }, [dispatch,allpackedOrderError]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Refund List</h1>
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
    );
};

export default RefundList;
