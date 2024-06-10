import {  createSlice } from "@reduxjs/toolkit";


const enquirySlice = createSlice({
    name:'enquiry',
    initialState:{
        loading:false,
        isEnquiryDeleted:false
    }, 
    reducers:{
        postEnquiryRequest (state, action){
            return{
                loading:true
            }
        }, 
        postEnquirySuccess (state, action){
            return{
                loading:false,
                enquiry: action.payload.enquiry
            }
        }, 
        postEnquiryFail (state, action){
            return{
                loading:false,
                error: action.payload
            }
        }, 
        getEnquiryRequest (state, action){
            return{
                loading:true
            }
        }, 
        getEnquirySuccess (state, action){
            return{
                loading:false,
                enquiry: action.payload.enquiry
            }
        }, 
        getEnquiryFail (state, action){
            return{
                loading:false,
                error: action.payload
            }
        }, 
        deleteEnquiryRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        deleteEnquirySuccess(state, action) {
            return {
                ...state,
                loading: false,
                isEnquiryDeleted: true
            }
        },
        deleteEnquiryFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        },
        clearEnquiryDeleted(state, action) {
            return {
                ...state,
                isEnquiryDeleted: false
            }
        },
       
    }

});

const {actions, reducer} = enquirySlice;

export const {clearEnquiryDeleted,postEnquiryRequest,postEnquirySuccess,postEnquiryFail, deleteEnquiryRequest,deleteEnquirySuccess, deleteEnquiryFail,getEnquiryRequest,getEnquirySuccess, getEnquiryFail } = actions;

export default reducer;