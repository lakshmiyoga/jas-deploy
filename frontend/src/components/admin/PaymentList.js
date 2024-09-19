import React, { useEffect, Fragment } from 'react';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { deleteOrder, adminOrders as adminOrdersAction } from "../../actions/orderActions"
import Loader from '../Layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import { clearError } from '../../slices/productsSlice';
import { clearOrderDeleted, orderDetailClear } from "../../slices/orderSlice";
import MetaData from '../Layouts/MetaData';
import { porterClearData, porterClearResponse } from '../../slices/porterSlice';

const PaymentList = ({isActive,setIsActive}) => {
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const { adminOrders: orders = [], loading = true, error, isOrderDeleted }  = useSelector(state => state.orderState);
    const dispatch = useDispatch();
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
                    label: 'Number of Items',
                    field: 'noOfItems',
                    sort: 'disabled'
                },
                {
                    label: 'Amount',
                    field: 'amount',
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

        
        // Sort orders by creation date (newest first)
        const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        sortedOrders.forEach((order,index) => {
            data.rows.push({
                s_no: index + 1,
                id:order.order_id,
                noOfItems: order.orderItems.length,
                amount: `Rs.${order.totalPrice}`,
                paymentstatus: (
                <p className={order && order.paymentStatus  && order.paymentStatus === 'CHARGED'? 'greenColor' : 'redColor' } ><p>{order ? order.paymentStatus : 'Processing'}</p></p>
                ),
                // actions: (
                //     <Fragment>
                //         <Link to={`/admin/order/${order.order_id}`} className="btn btn-primary">
                //             <i className="fa fa-pencil"></i>
                //         </Link>
                //         <Button onClick={e => deleteHandler(e, order._id)} className="btn btn-danger py-1 px-2 ml-2">
                //             <i className="fa fa-trash"></i>
                //         </Button>
                //     </Fragment>
                // )
                actions: <Link to={`/admin/orderdetail/${order.order_id}`} className="btn btn-primary" >
                    <i className='fa fa-eye'></i>
                </Link>
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
        <div>
             <MetaData title={`Payment List`} />
       
        <div className="row">
            <div className="col-12 col-md-2">
            <div style={{display:'flex',flexDirection:'row',position:'fixed',top:'0px',zIndex:99999,backgroundColor:'#fff',minWidth:'100%'}}>
                <Sidebar isActive={isActive} setIsActive={setIsActive}/>
                </div>
            </div>
            <div className="col-12 col-md-10 smalldevice-space">
                <h1 className="mb-4 admin-dashboard-x">Payment List</h1>
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

export default PaymentList;
