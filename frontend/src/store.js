import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import thunk from 'redux-thunk';
import productsReducer from "./slices/productsSlice";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import enquiryReducer from "./slices/enquirySlice";
import userReducer from "./slices/userSlice"



const reducer = combineReducers({
    productsState:productsReducer,
    productState:productReducer, 
    authState: authReducer, 
    cartState: cartReducer, 
    enquiryState: enquiryReducer,
    userState: userReducer

})

const store = configureStore({
    reducer,
    // middleware:[thunk],
})

export default  store;
