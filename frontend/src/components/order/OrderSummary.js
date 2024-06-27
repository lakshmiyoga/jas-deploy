import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderSummary } from '../../actions/orderActions';
import Loader from '../Layouts/Loader';
import MetaData from '../Layouts/MetaData';

const OrderSummary = () => {
    const dispatch = useDispatch();
    const { loading, orderSummary, error } = useSelector((state) => state.orderState);
    console.log('Order Summary:', orderSummary);
    const [date, setDate] = useState('');

    useEffect(() => {
        if (date) {
            dispatch(fetchOrderSummary(date));
        }
    }, [date, dispatch]);

    // Check if orderSummary is defined and is an array
    const isOrderSummaryArray = Array.isArray(orderSummary);

     // Calculate total weight and total price
     let totalWeight = 0;
     let totalPrice = 0;
     if (isOrderSummaryArray) {
         orderSummary.forEach(({ totalWeight: weight, totalPrice: price }) => {
            totalWeight += parseFloat(weight) || 0;
            totalPrice += parseFloat(price) || 0;
         });
     }

    return (
        <div>
            <MetaData title="Order Summary" />
            <div className="container">
                <h1>Order Summary for a Day</h1>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-control mb-3"
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
                                        <th>Product Name</th>
                                        <th>Total Weight (kg)</th>
                                        <th>Total Price (Rs.)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {isOrderSummaryArray && orderSummary.map(({ productName, totalWeight, totalPrice }) => {
                                        console.log('Total Price:', productName,totalWeight,totalPrice);
                                        return (
                                            <tr key={productName}>
                                                <td>{productName}</td>
                                                <td>{totalWeight}</td>
                                                <td>{totalPrice != null ? `Rs. ${totalPrice.toFixed(2)}` : '-'}</td>
                                            </tr>
                                        );
                                    })}

                                     {/* Add the row for totals */}
                                     <tr>
                                        <td><strong>Total</strong></td>
                                        <td><strong>{totalWeight.toFixed(2)}</strong></td>
                                        <td><strong>Rs.{totalPrice.toFixed(2)}</strong></td>
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
