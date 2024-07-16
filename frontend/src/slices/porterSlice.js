import { createSlice } from "@reduxjs/toolkit";



const orderSlice = createSlice({
    name: 'order',
    initialState: {
        porterOrderData:{},
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

    }
});

const { actions, reducer } = orderSlice;

export const { 
    porterFail,
    porterRequest,
    porterSuccess,
 } = actions;

export default reducer;