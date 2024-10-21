import { Fragment, useEffect, useState } from 'react'
import MetaData from '../Layouts/MetaData';
import { MDBDataTable } from 'mdbreact'
import { useDispatch, useSelector } from 'react-redux';
import { userOrders as userOrdersAction } from '../../actions/orderActions';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../Layouts/Loader';
import { loadUser } from '../../actions/userActions';
import store from '../../store';
import { Slide, toast } from "react-toastify";
import { getProducts } from '../../actions/productsActions';
import { clearError, orderDetailClear } from '../../slices/orderSlice';
import { porterClearData, porterClearResponse } from '../../slices/porterSlice';

export default function UserOrders() {

    const { loading, userOrders, error } = useSelector(state => state.orderState)
    const { isAuthenticated, user } = useSelector(state => state.authState);
    const dispatch = useDispatch();
    const [dummyUser, setDummyUser] = useState(false);
    const [iserror, setIserror] = useState(false);
    console.log("userOrders", userOrders);
    const navigate = useNavigate();
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    useEffect(() => {
        dispatch(orderDetailClear());
        dispatch(porterClearData());
        dispatch(porterClearResponse());
    }, [])

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
            setIserror(true)
            return;
        }
    }, [error])

    useEffect(() => {
        if (!userOrders && !iserror) {
            dispatch(userOrdersAction());
        }

    }, [userOrders, iserror])

    // useEffect(()=>{
    //     if(!isAuthenticated){
    //         navigate('/unauthorized');
    //     }
    // },[isAuthenticated])

    // const { user } = useSelector(state => state.authState);

    // useEffect(() => {
    //     if(!user){
    //         store.dispatch(loadUser());
    //         store.dispatch(getProducts());
    //     }

    //     if(user){
    //         setDummyUser(true)
    //         // console.log("hello")
    //     }
    // }, [user]);

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'S.No',
                    field: 's_no',
                    sort: 'disabled'
                },
                {
                    label: "Order ID",
                    field: 'id',
                    sort: "disabled"
                },
                {
                    label: "No of Items",
                    field: 'numOfItems',
                    sort: "disabled"
                },
                {
                    label: "Amount",
                    field: 'amount',
                    sort: "disabled"
                },
                {
                    label: "Status",
                    field: 'status',
                    sort: "disabled"
                },
                {
                    label: "Actions",
                    field: 'actions',
                    sort: "disabled"
                }
            ],
            rows: []
        }

        // Sort orders by creation date (newest first)
        const sortedOrders = userOrders && [...userOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        sortedOrders && sortedOrders.forEach((userOrder, index) => {
            data.rows.push({
                s_no: index + 1,
                id: userOrder.order_id,
                numOfItems: userOrder.orderItems.length,
                amount: `${userOrder.totalPrice} Rs`,
                status: userOrder.orderStatus && userOrder.orderStatus.includes('Delivered') ?
                    (<p style={{ color: 'green', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px', padding: '0px' }}> {userOrder.orderStatus} </p>) :
                    (<p style={{ color: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px', padding: '0px' }}> {userOrder && userOrder.paymentStatus && userOrder.paymentStatus === 'CHARGED' ? userOrder.orderStatus : 'Cancelled'} </p>),
                actions: <Link to={`/order/${userOrder.order_id}`} className="userorder_btn" >
                    <i className='fa fa-eye'></i>
                </Link>
            })
        })


        return data;
    }


    return (
        <Fragment>
            {/* <MetaData title={`My Orders`} /> */}
            <MetaData
                title="Your Orders"
                description="Check all your previous and current orders in one place. Track shipments, view details, and manage your purchases with ease."
            />

            <div className="products_heading">Orders</div>
            {loading ?
                <div style={{ marginTop: '4rem' }}>
                    <Loader />
                </div>

                : <div className='mdb-table' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Fragment>
                        {/* {loading ? <Loader /> : */}
                        <MDBDataTable
                            data={setOrders()}
                            bordered
                            hover
                            className="px-3 userproduct-table"
                            noBottomColumns
                        />
                        {/* } */}
                    </Fragment>
                </div>}
        </Fragment>
    )
}

