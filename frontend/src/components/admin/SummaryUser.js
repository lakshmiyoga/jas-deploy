import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSummary } from '../../actions/orderActions';
import Loader from '../Layouts/Loader';
import MetaData from '../Layouts/MetaData';
import Sidebar from './Sidebar';

const SummaryUser = () => {
    const dispatch = useDispatch();
    const { loading, userSummary, error } = useSelector((state) => state.orderState);
    console.log('User Summary:', userSummary);
    const [date, setDate] = useState('');
    console.log(date)

    useEffect(() => {
        if (date) {
            dispatch(fetchUserSummary(date));
        }
    }, [date, dispatch]);

    // // Check if orderSummary is defined and is an array
    const isUserSummaryArray = Array.isArray(userSummary);

    // Calculate the total weight and total amount for all orders
    const totalWeight = userSummary.reduce((sum, order) => sum + (order.totalWeight || 0), 0);
    const totalAmount = userSummary.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return (
        <div className="row">
            <MetaData title="Order Summary" />
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-8">
                <h1>User Summary for a Day</h1>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-control mb-3 date-input"
                />
                {loading ? (
                    <Loader />
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <div className="product-table">
                        {isUserSummaryArray && userSummary.length === 0 ? (
                            <p>No user found for the selected date.</p>
                        ) : (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone No</th>
                                        <th>Address</th>
                                        <th>Products</th>
                                        <th>Total Weight</th>
                                        <th>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userSummary && userSummary.map((order, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{order.user?.name || 'N/A'}</td>
                                            <td>{order.user?.email || 'N/A'}</td>
                                            <td>{order.shippingInfo?.phoneNo || 'N/A'}</td>
                                            <td >
                                                {order.shippingInfo?.address || 'N/A'},
                                                {order.shippingInfo?.city || 'N/A'},
                                                {order.shippingInfo?.country || 'N/A'},
                                                {order.shippingInfo?.postalCode || 'N/A'}
                                            </td>
                                            <td>
                                                {order.products.map((product, idx) => (
                                                    <div key={idx}>
                                                        {product.name} - {product.weight} kg - Rs. {product.price}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>{(order.totalWeight || 0).toFixed(2)} kg</td>
                                            <td>Rs.{(order.totalAmount || 0).toFixed(2)}</td>

                                        </tr>

                                    ))}
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'right' }}><strong>Total</strong></td> 
                                        <td><strong>{totalWeight.toFixed(2)} kg</strong></td>
                                        <td><strong>Rs. {totalAmount.toFixed(2)}</strong></td>
                                    </tr>

                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SummaryUser;
