import { createSlice } from "@reduxjs/toolkit";



const analysisSlice = createSlice({
    name: 'analysis',
    initialState: {
        analysisData: null,
        totalAmount:0,
        totalOrders:0,
        refundedAmount:0,
        dispatchedAmount:0,
        usersCount:0,
        totalEnquiries:0,
    },
    reducers: {
        analysisRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        analysisSuccess(state, action) {
            return {
                ...state,
                loading: false,
                analysisData: action.payload.analysisData,
                totalAmount:action.payload.totalAmount,
                totalOrders:action.payload.totalOrders,
                refundedAmount:action.payload.refundedAmount,
                dispatchedAmount:action.payload.dispatchedAmount,
                usersCount:action.payload.usersCount,
                totalEnquiries:action.payload.totalEnquiries,
            }
        },
        analysisFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
    }
});

const { actions, reducer } = analysisSlice;

export const { 
    analysisFail,
    analysisSuccess,
    analysisRequest,
 } = actions;

export default reducer;