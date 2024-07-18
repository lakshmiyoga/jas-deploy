import { createSlice } from "@reduxjs/toolkit";



const orderSlice = createSlice({
    name: 'order',
    initialState: {
        porterOrderData:{},
        porterOrderResponse:{},
        loading: false,
        error: null,
    },
    reducers: {
        porterRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        porterSuccess(state, action) {
            return {
                ...state,
                loading: false,
                porterOrderData: action.payload.porterOrder
            }
        },
        porterFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        porterOrderResponseRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        porterOrderResponseSuccess(state, action) {
            return {
                ...state,
                loading: false,
                porterOrderResponse: action.payload.porterResponse
            }
        },
        porterOrderResponseFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },


    }
});

const { actions, reducer } = orderSlice;

export const { 
    porterFail,
    porterRequest,
    porterSuccess,
    porterOrderResponseRequest,
    porterOrderResponseSuccess,
    porterOrderResponseFail
 } = actions;

export default reducer;