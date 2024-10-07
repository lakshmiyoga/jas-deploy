import { Fragment, useEffect, useState } from 'react'
import MetaData from '../Layouts/MetaData';
import { MDBDataTable } from 'mdbreact'
import { useDispatch, useSelector } from 'react-redux';
import { userOrders as userOrdersAction } from '../../actions/orderActions';
import { Link, useLocation } from 'react-router-dom';
import Loader from '../Layouts/Loader';
import { loadUser } from '../../actions/userActions';
import store from '../../store';
import { getProducts } from '../../actions/productsActions';
import { orderDetailClear } from '../../slices/orderSlice';
import { porterClearData, porterClearResponse } from '../../slices/porterSlice';

export default function UserOrders() {
    
    const {loading, userOrders = [] } = useSelector(state => state.orderState)
    const dispatch = useDispatch();
    const [dummyUser,setDummyUser] = useState(false);
     console.log("userOrders",userOrders)
    const location = useLocation();
     sessionStorage.setItem('redirectPath', location.pathname);
     useEffect(() => {
        dispatch(orderDetailClear());
        dispatch(porterClearData());
        dispatch(porterClearResponse());
        dispatch(userOrdersAction())
    }, [])
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
        const sortedOrders = [...userOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        sortedOrders.forEach((userOrder, index) => {
            data.rows.push({
                s_no: index + 1,
                id: userOrder.order_id,
                numOfItems: userOrder.orderItems.length,
                amount: `${userOrder.totalPrice} Rs`,
                status: userOrder.orderStatus && userOrder.orderStatus.includes('Delivered') ?
                    (<p style={{ color: 'green' }}> {userOrder.orderStatus} </p>) :
                    (<p style={{ color: 'red' }}> {userOrder.orderStatus} </p>),
                actions: <Link to={`/order/${userOrder.order_id}`} className="btn btn-primary" >
                    <i className='fa fa-eye'></i>
                </Link>
            })
        })


        return data;
    }


    return (
        <Fragment>
            <MetaData title={`My Orders`} />
            <div className="products_heading">Orders</div>
            {loading ? <Loader /> :  <div className='container mdb-table'>
            <Fragment>
                    {/* {loading ? <Loader /> : */}
                        <MDBDataTable
                            data={setOrders()}
                            bordered
                            hover
                            className="px-3 product-table"
                            noBottomColumns
                        />
                    {/* } */}
                </Fragment>
            </div> }
        </Fragment>
    )
}

