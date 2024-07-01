import { createAsyncThunk } from '@reduxjs/toolkit';
import {addCartItemRequest, addCartItemSuccess} from '../slices/cartSlice';
import axios from 'axios'

export const addCartItem = createAsyncThunk('post/orderItem', async({productId, quantity, productWeight},{dispatch}) => {
    try {
        console.log(productWeight)
        dispatch(addCartItemRequest())
        const {data } = await axios.get(`/api/v1/product/${productId}`)
        console.log(data);
        dispatch(addCartItemSuccess({
            product: data.product._id,
            name: data.product.englishName,
            price: data.product.price,
            image: data.product.images[0].image,
            quantity,
            productWeight,
            stocks: data.product.stocks
        }))
    } catch (error) {
        
    }
})