import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderSummary } from '../../actions/orderActions';
import Loader from '../Layouts/Loader';
import MetaData from '../Layouts/MetaData';
import Sidebar from '../admin/Sidebar';
import { useLocation } from 'react-router-dom';

const OrderSummary = ({ isActive, setIsActive }) => {
    const dispatch = useDispatch();
    const { loading, orderSummary, error } = useSelector((state) => state.orderState);
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);

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
        <div>
            {/* <MetaData title={`OrderSummary`} /> */}
            <MetaData
                title="Order Summary"
                description="Review your order summary, including product details, pricing, and shipping information before confirming your purchase. Ensure everything is accurate before proceeding."
            />

            <div className="row loader-parent">
                {/* <MetaData title="Order Summary" /> */}
                <div className="col-12 col-md-2">
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>

                <div className="col-12 col-md-10 smalldevice-space-summary loader-parent" >
                    <h1 className='admin-dashboard-x mb-4'>Order Summary for a Day</h1>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-control mb-3 date-input"
                    />
                    {loading ? (
                        <div className="container loader-loading-center">
                            <Loader />
                        </div>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : (
                        <div className="container ordersummary-detail-container">
                            {isOrderSummaryArray && orderSummary.length === 0 ? (
                                <p>No orders found for the selected date.</p>
                            ) : (
                                <div className="updatetable-responsive">
                                    <table className="updatetable updatetable-bordered">
                                        <thead>
                                            <tr>
                                                <th>S.NO</th>
                                                <th>Product Name</th>
                                                <th>Total Weight (kg)</th>
                                                {/* <th>Total Price (Rs.)</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isOrderSummaryArray && orderSummary.map(({ productName, totalWeight, totalPrice }, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
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
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
