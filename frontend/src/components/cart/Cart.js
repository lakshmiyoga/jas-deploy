import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { decreaseCartItemQty, increaseCartItemQty, removeItemFromCart } from '../../slices/cartSlice';
import MetaData from '../Layouts/MetaData';

const Cart = () => {
    const { items } = useSelector(state => state.cartState);
    const { isAuthenticated } = useSelector(state => state.authState);
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log("items",items)

    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const shippingCharge = 30.0;
    const subtotal = items.reduce((acc, item) => acc + item.price * item.productWeight, 0).toFixed(2);
    const total = (parseFloat(subtotal) + shippingCharge).toFixed(2);

    const checkOutHandler = () => {
        if (isAuthenticated) {
            navigate('/shipping');
        } else {
            navigate('/login');
        }
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        dispatch(removeItemFromCart(productToDelete));
        setShowModal(false);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    return (
        <Fragment>
            <MetaData title={`Cart`}/>
            {items && items.length === 0 ? (
                <h2 className="mt-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Your Cart is Empty
                </h2>
            ) : (
                <Fragment>
                    <div className="products_heading">Cart</div>
                    <div className="container cart-detail-container mt-5 " >
                        <div className="" >
                            <h2 className="mt-5">Your Cart: <b>{items.length}</b></h2>
                            <div className="updatetable-responsive">
                            <table className="updatetable updatetable-bordered">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Weight/Piece</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    {items.map((item, index) => (
                                        
                                        <tr key={item.product}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>RS.{(item.price).toFixed(2)}</td>
                                            <td>{item.productWeight}</td>
                                            <td>Rs.{(item.price * item.productWeight).toFixed(2)}</td>
                                            <td>
                                                <i
                                                    id="delete_cart_item"
                                                    className="fa fa-trash btn btn-danger"
                                                    onClick={() => handleDeleteClick(item.product)}
                                                ></i>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                               
                            </table>
                            </div>
                            
                            <div className="row d-flex justify-content-center">
                                <div className="col-12 col-lg-8 my-4 float-left">
                                    {/* <div id="order_summary">
                                        <h4>Delivery Offers<span><i className='fa fa-truck' style={{ paddingLeft: '20px' }}></i></span></h4>
                                        <hr />
                                        <p>50% discount on delivery for all orders above Rs.500</p>
                                        <hr />
                                        <p>Free delivery for all orders above Rs.1000</p>
                                    </div> */}
                                </div>
                                <div className="col-12 col-lg-4 my-4 float-right">
                                    <div id="order_summary">
                                        <h4>Cart Totals</h4>
                                        <hr />
                                        <p>Subtotal:  <span className="order-summary-values">Rs.{subtotal}</span></p>
                                        <hr />
                                        <button id="checkout_btn" className="btn btn-block" onClick={checkOutHandler}>Proceed to Payment</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showModal && (
                        <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Confirm Delete</h5>
                                        <button type="button" className="close" onClick={handleCancelDelete}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Are you sure you want to delete this item?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>OK</button>
                                        <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

const modalStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)'
};

export default Cart;
