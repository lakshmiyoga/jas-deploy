// src/components/AddCart.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem } from '../../actions/cartActions';

const AddCart = ({ productId }) => {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const {items} = useSelector(state => state.cartState);
//   console.log(items);

  useEffect(() => {
    const itemInCart = items.find(item => item.product === productId);
    // console.log(items);
    // console.log(itemInCart);
    if (itemInCart) {
      setQuantity(itemInCart.quantity);
    }
  }, [items, productId]);

  const handleAddToCart = () => {
    const newQuantity = 1;
    setQuantity(newQuantity);
    dispatch(addCartItem({ id: productId, quantity: newQuantity }));
    updateLocalStorage(productId, newQuantity);
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    dispatch(addCartItem({ id: productId, quantity: newQuantity }));
    updateLocalStorage(productId, newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      dispatch(addCartItem({ id: productId, quantity: newQuantity }));
      updateLocalStorage(productId, newQuantity);
    } else {
      setQuantity(0);
      dispatch(addCartItem({ id: productId, quantity: 0 }));
            removeItemFromLocalStorage(productId);
    }
  };

  const updateLocalStorage = (id, quantity) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.id === id);

    if (itemIndex >= 0) {
        cartItems[itemIndex].quantity = quantity;
    } else {
        cartItems.push({ id, quantity });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

  const removeItemFromLocalStorage = (id) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
};

  return (
    <div>
      {quantity === 0 ? (
        <button onClick={handleAddToCart} className="btn d-inline ml-4" style={{backgroundColor:" #02441E", color:"white", borderRadius:"40px"}}>Add</button>
      ) : (
        <div className="stockCounter d-inline">
          <button onClick={handleDecrement} className="btn btn-danger">-</button>
          <span className="count d-inline">{quantity}</span>
          <button onClick={handleIncrement} className="btn btn-primary">+</button>
        </div>
      )}
    </div>
  );
};

export default AddCart;
