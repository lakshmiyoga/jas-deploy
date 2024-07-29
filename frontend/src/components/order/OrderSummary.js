import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderSummary } from '../../actions/orderActions';
import Loader from '../Layouts/Loader';
import MetaData from '../Layouts/MetaData';
import Sidebar from '../admin/Sidebar';

const OrderSummary = () => {
    const dispatch = useDispatch();
    const { loading, orderSummary, error } = useSelector((state) => state.orderState);

    // Initialize the date with the current date
    const currentDate = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(currentDate);

    useEffect(() => {
        // Fetch data when the component mounts
        dispatch(fetchOrderSummary(date));
    }, [date, dispatch]);

    const isOrderSummaryArray = Array.isArray(orderSummary);

    // Calculate total weight and total price
    let totalWeight = 0;
    // let totalPrice = 0;
    if (isOrderSummaryArray) {
        orderSummary.forEach(({ totalWeight: weight, totalPrice: price }) => {
            totalWeight += parseFloat(weight) || 0;
            // totalPrice += parseFloat(price) || 0;
        });
    }

    return (
        <div className="row">
            <MetaData title="Order Summary" />
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>

            <div className="col-12 col-md-8">
                <h1>Order Summary for a Day</h1>
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
                    <div className="order-summary">
                        {isOrderSummaryArray && orderSummary.length === 0 ? (
                            <p>No orders found for the selected date.</p>
                        ) : (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>S.NO</th>
                                        <th>Product Name</th>
                                        <th>Total Weight (kg)</th>
                                        {/* <th>Total Price (Rs.)</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {isOrderSummaryArray && orderSummary.map(({ productName, totalWeight, totalPrice },index) => (
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{productName}</td>
                                            <td>{totalWeight} kg</td>
                                            {/* <td>{totalPrice != null ? `Rs. ${totalPrice.toFixed(2)}` : '-'}</td> */}
                                        </tr>
                                    ))}

                                    {/* Add the row for totals */}
                                    <tr>
                                        <td colSpan="2" style={{ textAlign: 'right' }}><strong>Total</strong></td>
                                        <td><strong>{totalWeight.toFixed(2)} kg</strong></td>
                                        {/* <td><strong>Rs.{totalPrice.toFixed(2)}</strong></td> */}
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

export default OrderSummary;
