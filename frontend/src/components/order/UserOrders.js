import { Fragment, useEffect} from 'react'
import MetaData from '../Layouts/MetaData';
import {MDBDataTable} from 'mdbreact'
import { useDispatch, useSelector } from 'react-redux';
import { userOrders as userOrdersAction } from '../../actions/orderActions';
import { Link } from 'react-router-dom';

export default function UserOrders () {
    const { userOrders = []} = useSelector(state => state.orderState)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userOrdersAction())
    },[])

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'S.No',
                    field: 's_no',
                    sort: 'asc'
                },
                {
                    label: "Order ID",
                    field: 'id',
                    sort: "asc"
                },
                {
                    label: "Number of Items",
                    field: 'numOfItems',
                    sort: "asc"
                },
                {
                    label: "Amount",
                    field: 'amount',
                    sort: "asc"
                },
                {
                    label: "Status",
                    field: 'status',
                    sort: "asc"
                },
                {
                    label: "Actions",
                    field: 'actions',
                    sort: "asc"
                }
            ],
            rows:[]
        }

        userOrders.forEach((userOrder,index) => {
            data.rows.push({
                s_no:index+1,
                id:  userOrder.order_id,
                numOfItems: userOrder.orderItems.length,
                amount: `${userOrder.totalPrice} Rs`,
                status: userOrder.orderStatus && userOrder.orderStatus.includes('Delivered') ?
                (<p style={{color: 'green'}}> {userOrder.orderStatus} </p>):
                (<p style={{color: 'red'}}> {userOrder.orderStatus} </p>),
                actions: <Link to={`/order/${userOrder.order_id}`} className="btn btn-primary" >
                    <i className='fa fa-eye'></i>
                </Link>
            })
        })


        return  data;
    }


    return (
        <Fragment>
            <MetaData title="My Orders" />
            <div className="products_heading">Orders</div>
            <div className='container'> 
           
            <MDBDataTable
                className='px-3 product-table'
                bordered
                hover
                data={setOrders()}
                noBottomColumns
                
            />
            </div>
        </Fragment>
    )
}