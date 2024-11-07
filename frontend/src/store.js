import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import thunk from 'redux-thunk';
import productsReducer from "./slices/productsSlice";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import enquiryReducer from "./slices/enquirySlice";
import userReducer from "./slices/userSlice"
import orderReducer from "./slices/orderSlice"
import porterReducer from "./slices/porterSlice"
import analysisReducer from "./slices/analysisSlice"
import otpReducer from "./slices/otpSlice"
import AddressReducer from "./slices/AddressSlice"


const reducer = combineReducers({
    productsState:productsReducer,
    productState:productReducer, 
    authState: authReducer, 
    cartState: cartReducer, 
    enquiryState: enquiryReducer,
    userState: userReducer, 
    orderState: orderReducer,
    porterState:porterReducer,
    analysisState:analysisReducer,
    otpState:otpReducer,
    addressState:AddressReducer,

})

// const store = configureStore({
//     reducer,
//     // middleware:[thunk],
// })
const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disables the serializable state check middleware
      }),
  });

export default  store;
