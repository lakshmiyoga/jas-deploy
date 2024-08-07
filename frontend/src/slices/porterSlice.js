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
                portererror: action.payload
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
        porterCancelRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        porterCancelSuccess(state, action) {
            return {
                ...state,
                loading: false,
                porterCancelResponse: action.payload.cancelresponseData
            }
        },
        porterCancelFail(state, action) {
            return {
                ...state,
                loading: false,
                porterCancelError: action.payload
            }
        },
        porterCancelClearError(state, action) {
            return {
                ...state,
                loading: false,
                porterCancelError:null,
                porterCancelResponse:null
            }
        },
        packedOrderRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        packedOrderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                packedOrderData: action.payload.packedOrderData
            }
        },
        packedOrderFail(state, action) {
            return {
                ...state,
                loading: false,
                packedOrderError: action.payload
            }
        },
        getpackedOrderRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        getpackedOrderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                getpackedOrderData: action.payload.getpackedOrderData
            }
        },
        getpackedOrderFail(state, action) {
            return {
                ...state,
                loading: false,
                getpackedOrderError: action.payload
            }
        },
        refundRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        refundSuccess(state, action) {
            return {
                ...state,
                loading: false,
                refundData: action.payload.refundData
            }
        },
        refundFail(state, action) {
            return {
                ...state,
                loading: false,
                refundError: action.payload
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
    porterCancelRequest,
    porterCancelSuccess,
    porterCancelFail,
    porterCancelClearError,
    porterRemoveRequest,
    porterRemoveSuccess,
    porterRemoveFail,
    porterRemoveClearError,
    packedOrderRequest,
    packedOrderSuccess,
    packedOrderFail,
    getpackedOrderRequest,
    getpackedOrderSuccess,
    getpackedOrderFail,
    refundRequest,
    refundSuccess,
    refundFail
 } = actions;

export default reducer;