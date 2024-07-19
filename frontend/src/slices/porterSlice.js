import { createSlice } from "@reduxjs/toolkit";



const orderSlice = createSlice({
    name: 'order',
    initialState: {
        porterOrderData:null,
        porterOrderResponse:null,
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
        porterClearData(state, action) {
            return {
                ...state,
                loading: false,
                porterOrderData: null
            }
        },
        porterClearResponse(state, action) {
            return {
                ...state,
                loading: false,
                porterOrderResponse: null
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
    porterOrderResponseFail,
    porterClearData,
    porterClearResponse,
 } = actions;

export default reducer;