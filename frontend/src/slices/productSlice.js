import { createSlice } from "@reduxjs/toolkit";


const productSlice = createSlice({
    name: 'product',
    initialState: {
        loading: false,
        updateloading:false,
        product: null,
        isProductCreated: false,
        isProductUpdated: false,
        isReviewDeleted: false,
    },
    reducers: {
        productRequest(state, action) {
            return {
                loading: true
            }
        },
        productSuccess(state, action) {
            return {
                loading: false,
                product: action.payload.product
            }
        },
        productFail(state, action) {
            return {
                loading: false,
                error: action.payload
            }
        },
        clearproduct(state, action) {
            return {
                loading: false,
                product:null,
                error: null
            }
        },
        newProductRequest(state, action) {
            return {
                ...state,
                newloading: true
            }
        },
        newProductSuccess(state, action) {
            return {
                ...state,
                newloading: false,
                product: action.payload.newItem,
                isProductCreated: true

            }
        },
        newProductFail(state, action) {
            return {
                ...state,
                newloading: false,
                error: action.payload,
                isProductCreated: false
            }
        },
        clearProductCreated(state, action) {
            return {
                ...state,
                isProductCreated: false

            }
        },
        clearError(state, action) {
            return {
                ...state,
                error: null
            }
        },
        clearProduct(state, action) {
            return {
                ...state,
                product: {}
            }
        },
        deleteProductRequest(state, action) {
            return {
                ...state,
                deleteloading: true
            }
        },
        deleteProductSuccess(state, action) {
            return {
                ...state,
                deleteloading: false,
                isProductDeleted: true
            }
        },
        deleteProductFail(state, action) {
            return {
                ...state,
                deleteloading: false,
                error: action.payload,
            }
        },
        clearProductDeleted(state, action) {
            return {
                ...state,
                isProductDeleted: false
            }
        },
        updateProductRequest(state, action) {
            return {
                ...state,
                updateloading: true,
                
            }
        },
        updateProductSuccess(state, action) {
            return {
                ...state,
                updateloading: false,
                product: action.payload.product, 
                isProductUpdated: true
            }
        },
        updateProductFail(state, action) {
            return {
                ...state,
                updateloading: false,
                error: action.payload,
            }
        },
        clearProductUpdated(state, action) {
            return {
                ...state,
                isProductUpdated: false
            }
        },

    }

});

const { actions, reducer } = productSlice;

export const { productRequest,
    productSuccess,
    productFail,
    newProductRequest,
    newProductFail,
    newProductSuccess,
    clearProductCreated,
    clearError,
    clearProduct,
    deleteProductFail,
    deleteProductRequest,
    deleteProductSuccess,
    clearProductDeleted,
    updateProductFail,
    updateProductRequest,
    updateProductSuccess,
    clearProductUpdated,
    clearproduct
} = actions;

export default reducer;