import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { decreaseCartItemQty, increaseCartItemQty, removeItemFromCart } from '../../slices/cartSlice';

const Cart = () => {
    const { items } = useSelector(state => state.cartState)
    const { isAuthenticated } = useSelector(state => state.authState)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log(items);

    // const increaseQty = (item) => {
    //     const count = item.quantity;
    //     if (item.stock == 0 || count >= item.stock) return;
    //     dispatch(increaseCartItemQty(item.product))
    // }
    // const decreaseQty = (item) => {
    //     const count = item.quantity;
    //     if (count == 1) return;
    //     dispatch(decreaseCartItemQty(item.product))
    // }

    const shippingCharge = 30.0;

    // Calculate the subtotal
    const subtotal = items.reduce((acc, item) => acc + item.price * item.productWeight, 0).toFixed(2);

    // Calculate the total
    const total = (parseFloat(subtotal) + shippingCharge).toFixed(2);


    const checkOutHandler = () => {
        // navigate('/login?redirect=shipping')
        if (isAuthenticated) {
            navigate('/shipping')
        } else {
            navigate('/login')
        }

    }

    // useEffect(()=>{

    // },[])

    return (
        // <Fragment>
        //     {items && items.length == 0 ?
        //         <h2 className="mt-5">Your Cart is Empty</h2> :
        //         <Fragment>
        //             <h2 className="mt-5">Your Cart: <b>{items.length}</b></h2>

        //             <div className="row d-flex justify-content-between">
        //                 <div className="col-12 col-lg-8">
        //                     {items.map(item => (
        //                         <Fragment>
        //                             <hr />
        //                             <div className="cart-item">
        //                                 <div className="row">
        //                                     <div className="col-4 col-lg-3">
        //                                         <img src={item.image} alt={item.name}height="90" width="115" />
        //                                     </div>

        //                                     <div className="col-5 col-lg-3">
        //                                         <Link to ={`/product/${item.product}`}>{item.name}</Link>
        //                                     </div>


        //                                     <div className="col-4 col-lg-2 mt-4 mt-lg-0">
        //                                         <p id="card_item_price">{item.price*item.quantity}</p>
        //                                     </div>

        //                                     {/* <div className="col-4 col-lg-3 mt-4 mt-lg-0">
        //                                         <div className="stockCounter d-inline">
        //                                             <span className="btn btn-danger minus" onClick={() => decreaseQty(item)}>-</span>
        //                                             <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />

        //                                             <span className="btn btn-primary plus"  onClick={() => increaseQty(item)}>+</span>
        //                                         </div>
        //                                     </div> */}

        //                                     <div className="col-4 col-lg-1 mt-4 mt-lg-0">
        //                                         <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={() => dispatch(removeItemFromCart(item.product))}></i>
        //                                     </div>

        //                                 </div>
        //                             </div>
        //                             <hr />
        //                         </Fragment>

        //                     ))}

        //                 </div>

        //                 <div className="col-12 col-lg-3 my-4">
        //                     <div id="order_summary">
        //                         <h4>Order Summary</h4>
        //                         <hr />
        //                         <p>Subtotal:  <span className="order-summary-values">{items.reduce((acc, item)=>(acc + item.quantity), 0)} (Units)</span></p>
        //                         <p>Est. total: <span className="order-summary-values">{items.reduce((acc, item)=>(acc + item.quantity * item.price), 0)} </span></p>

        //                         <hr />
        //                         <button id="checkout_btn" onClick={checkOutHandler} className="btn btn-primary btn-block">Check out</button>
        //                     </div>
        //                 </div>
        //             </div>

        //         </Fragment>
        //     }


        // </Fragment>

        <Fragment>

            {items && items.length === 0 ?

                <h2 className="mt-5" style={{display:'flex',alignItems:'center', justifyContent:'center'}}>Your Cart is Empty</h2> :
                <Fragment>
                    <div className="products_heading">Cart</div>

                    <div className="container mt-5">
                        <div className="table-responsive ">
                            <h2 className="mt-5">Your Cart: <b>{items.length}</b></h2>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Weight</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (

                                        <tr key={item.product}>
                                            <td>
                                                {/* <img src={item.image} alt={item.name} height="90" width="115" /> */}
                                                {index + 1}
                                            </td>
                                            <td>
                                                {/* <Link to={`/product/${item.product}`}>{item.name}</Link> */}
                                                {item.name}

                                            </td>
                                            <td>RS.{item.price}(per Kg)</td>
                                            <td>{item.productWeight}
                                                {/* <div className="d-flex align-items-center">
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => decreaseQty(item)}>-</button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => increaseQty(item)}>+</button>
                                        </div> */}
                                            </td>
                                            <td>Rs.{(item.price * item.productWeight).toFixed(2)}</td>
                                            <td>
                                                {/* <button className="btn btn-sm btn-danger" onClick={() => dispatch(removeItemFromCart(item.product))}>Remove</button> */}
                                                <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={() => dispatch(removeItemFromCart(item.product))}></i>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* </div> */}

                            {/* <div className="mt-4">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal: <span>Rs. {subtotal}</span></p>
                        <p>Shipping Charge:<span>Rs. {shippingCharge.toFixed(2)}</span></p>
                        <p>Total:<span>Rs. {total}</span></p>
                        <button className="btn btn-primary " onClick={checkOutHandler}>Check out</button>
                      </div> */}
                            <div className="row d-flex justify-content-center">
                                <div className="col-12 col-lg-8 my-4 float-left" >
                                    <div id="order_summary">
                                        <h4> Delivery Offers<span><i className='fa fa-truck' style={{paddingLeft:'20px'}}></i></span></h4>
                                        <hr />
                                        <p> 50% discount on delivery for all orders above Rs.500</p>
                                        <hr />
                                        <p>Free delivery for all orders above Rs.1000</p>
                                    </div>
                                </div>


                                <div className="col-12 col-lg-4 my-4 float-right" >
                                    <div id="order_summary">
                                        <h4>Cart Totals</h4>
                                        <hr />
                                        <p>Subtotal:  <span className="order-summary-values">Rs.{subtotal}</span></p>
                                        {/* <p>Shipping: <span className="order-summary-values">Rs.{shippingCharge.toFixed(2)}</span></p> */}


                                        {/* <hr /> */}

                                        {/* <p>Total: <span className="order-summary-values">Rs.{total}</span></p> */}

                                        <hr />
                                        <button id="checkout_btn" className="btn btn-block" onClick={checkOutHandler}>Proceed to Payment</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}

export default Cart
