import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSummary } from '../../actions/orderActions';
import Loader from '../Layouts/Loader';
import MetaData from '../Layouts/MetaData';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const SummaryUser = ({isActive,setIsActive}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const { loading, userSummary, error } = useSelector((state) => state.orderState);

    // Initialize the date with the current date
    const currentDate = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(currentDate);

    useEffect(() => {
        // Fetch data when the component mounts
        dispatch(fetchUserSummary(date));
    }, [date, dispatch]);

    const totalWeight = userSummary.reduce((sum, order) => sum + (order.totalWeight || 0), 0);
    const totalAmount = userSummary.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return (
        <div className="row">
            <MetaData title={`Order Summary`} />
            <div className="col-12 col-md-2">
            <div style={{display:'flex',flexDirection:'row',position:'fixed',top:'0px',zIndex:99999,backgroundColor:'#fff',minWidth:'100%'}}>
                <Sidebar isActive={isActive} setIsActive={setIsActive}/>
                </div>
            </div>
            <div className="col-12 col-md-9 smalldevice-space-summary ">
                <h1 className='admin-dashboard-x'>User Summary for a Day</h1>
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
                    <div className="container cart-detail-container">
                        {userSummary.length === 0 ? (
                            <p>No user found for the selected date.</p>
                        ) : (
                            <div className="updatetable-responsive">
                            <table className="updatetable updatetable-bordered">
                                <thead>
                                    <tr>
                                        <th className="s-no">S.No</th>
                                        <th className="name">Name</th>
                                        <th className="email">Email</th>
                                        <th className="phone">Phone No</th>
                                        <th className="address">Address</th>
                                        <th className="products">Products</th>
                                        <th className="weight">Total Weight</th>
                                        <th className="amount">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userSummary.map((order, index) => (
                                        <tr key={index}>
                                            <td className="s-no">{index + 1}</td>
                                            <td className="name">{order.user?.name || 'N/A'}</td>
                                            <td className="email">{order.user?.email || 'N/A'}</td>
                                            <td className="phone">{order.shippingInfo?.phoneNo || 'N/A'}</td>
                                            <td className="address">
                                                {order.shippingInfo?.address || 'N/A'},
                                                <br />
                                                {order.shippingInfo?.city || 'N/A'},
                                                <br />
                                                {order.shippingInfo?.country || 'N/A'},
                                                <br />
                                                {order.shippingInfo?.postalCode || 'N/A'}
                                            </td>
                                            <td className="products">
                                                {order.products.map((product, idx) => (
                                                    <>
                                                     <span key={idx} className="product-item">
                                                        {product.name} - {product.weight} kg - Rs. {product.price}
                                                       
                                                    </span>
                                                    <br/>
                                                    </>

                                                   
                                                ))}
                                            </td>
                                            <td className="weight">{(order.totalWeight || 0).toFixed(2)} kg</td>
                                            <td className="amount">Rs.{(order.totalAmount || 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'right' }}><strong>Total</strong></td>
                                        <td className="weight"><strong>{totalWeight.toFixed(2)} kg</strong></td>
                                        <td className="amount"><strong>Rs. {totalAmount.toFixed(2)}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SummaryUser;
