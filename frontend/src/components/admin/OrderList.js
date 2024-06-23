import React, { useEffect, Fragment } from 'react';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { deleteOrder, adminOrders as adminOrdersAction } from "../../actions/orderActions"
import Loader from '../Layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import { clearError } from '../../slices/productsSlice';
import { clearOrderDeleted } from "../../slices/orderSlice";

const OrderList = () => {
    const { adminOrders: orders = [], loading = true, error, isOrderDeleted }  = useSelector(state => state.orderState);
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
                    label: 'Number of Items',
                    field: 'noOfItems',
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

        orders.forEach((order,index) => {
            data.rows.push({
                s_no: index + 1,
                id:order.order_id,
                noOfItems: order.orderItems.length,
                amount: `Rs.${order.totalPrice}`,
                orderstatus: (
                    <p className={order.orderStatus && order.orderStatus.includes('Delivered') ? 'greenColor' : 'redColor' } ><p>{order.orderStatus}</p></p>
    
                ),
                paymentstatus: (
                <p className={order && order.paymentStatus  && order.paymentStatus === 'CHARGED'? 'greenColor' : 'redColor' } ><p>{order ? order.paymentStatus : 'Processing'}</p></p>
                ),
                actions: (
                    <Fragment>
                        <Link to={`/admin/order/${order.order_id}`} className="btn btn-primary">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <Button onClick={e => deleteHandler(e, order._id)} className="btn btn-danger py-1 px-2 ml-2">
                            <i className="fa fa-trash"></i>
                        </Button>
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
        if (error) {
            toast(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            });
            return;
        }
        if (isOrderDeleted) {
            toast('Order Deleted Successfully!', {
                type: 'success',
                position: "bottom-center",
                onOpen: () => dispatch(clearOrderDeleted())
            });
            return;
        }

        dispatch(adminOrdersAction());
    }, [dispatch, error, isOrderDeleted]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Order List</h1>
                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setOrders()}
                            bordered
                            striped
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

export default OrderList;
