import {  createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name:'cart',
    initialState:{
        items: localStorage.getItem('cartItems')? JSON.parse(localStorage.getItem('cartItems')):[],
        loading:false,
        shippingInfo: localStorage.getItem('shippingInfo')? JSON.parse(localStorage.getItem('shippingInfo')): {}
    }, 
    reducers:{
        addCartItemRequest (state, action){
            return{
                ...state,
                loading:true
            }
        }, 
        addCartItemSuccess (state, action){

            const item = action.payload;
            console.log(item);
            const IsItemExist = state.items.find(i=>i.product === item.product)
            // if(IsItemExist){
            //    state={
            //     ...state,
            //     loading:false

            //    } 
            // }else{
            //     state={
            //         items:[...state.items, item],
            //         loading:false
            //     }

                
            // console.log(state)
            // localStorage.setItem('cartItems', JSON.stringify(state.items));
            // }
            // return state
            if (IsItemExist) {
                state.items = state.items.map((i) =>
                  i.product === item.product ? { ...i, productWeight: item.productWeight } : i
                  
                );
                
              } else {
                state.items.push(item);
              }
              
        
              state.loading = false;
              localStorage.setItem('cartItems', JSON.stringify(state.items));
            
            return state
        }, 
        // increaseCartItemQty(state, action) {
        //     state.items = state.items.map(item => {
        //         if(item.product == action.payload) {
        //             item.quantity = item.quantity + 1
        //         }
        //         return item;
        //     })
        //     localStorage.setItem('cartItems', JSON.stringify(state.items));

        // },
        // decreaseCartItemQty(state, action) {
        //     state.items = state.items.map(item => {
        //         if(item.product == action.payload) {
        //             item.quantity = item.quantity - 1
        //         }
        //         return item;
        //     })
        //     localStorage.setItem('cartItems', JSON.stringify(state.items));

        // },
        removeItemFromCart(state, action) {
            const filterItems = state.items.filter(item => {
                return item.product !== action.payload
            })
            localStorage.setItem('cartItems', JSON.stringify(filterItems));
            return {
                ...state,
                items: filterItems
            }
        },
        saveShippingInfo(state, action) {
            localStorage.setItem('shippingInfo', JSON.stringify(action.payload));
            return {
                ...state,
                shippingInfo: action.payload
            }
        },
        orderCompleted(state, action) {
            // localStorage.removeItem('shippingInfo');
            localStorage.removeItem('cartItems');
            sessionStorage.removeItem('orderInfo');
            return {
                items: [],
                loading: false,
                // shippingInfo: {}
            }
        },
        updateCartItemWeight(state, action)  {
            const { productId, newWeight } = action.payload;
            const item = state.items.find(item => item.product === productId);
            if (item) {
                item.productWeight = newWeight;
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
       updateCartItemPrice (state, action) {
        const { productId, newPrice } = action.payload;
        const item = state.items.find(item => item.product === productId);
        if (item) {
            item.price = newPrice;
        }
        }
        
    }

});

const {actions, reducer} = cartSlice;

export const {addCartItemRequest,addCartItemSuccess, increaseCartItemQty, decreaseCartItemQty, removeItemFromCart, saveShippingInfo, orderCompleted ,updateCartItemWeight ,updateCartItemPrice} = actions;

export default reducer;