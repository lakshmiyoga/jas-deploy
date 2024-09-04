import { createSlice } from "@reduxjs/toolkit";



const orderSlice = createSlice({
    name: 'order',
    initialState: {
        initorder:{},
        orderDetail: {},
        userOrders : [],
        adminOrders: [],
        loading: false,
        isOrderDeleted: false,
        isOrderUpdated: false,
        orderSummary: [],
        userSummary: [],
        error: null,
    },
    reducers: {
        orderRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        orderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                initorder: action.payload.initorder
            }
        },
        orderFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },

        createOrderRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        createOrderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                orderDetail: action.payload.order
            }
        },
        createOrderFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        clearError(state, action) {
            return {
                ...state,
                error: null,
                // orderDetail:null,
                initorder:{}
            }
        },
        userOrdersRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        userOrdersSuccess(state, action) {
            return {
                ...state,
                loading: false,
                userOrders: action.payload.orders
            }
        },
        userOrdersFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        orderDetailRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        orderDetailSuccess(state, action) {
            return {
                ...state,
                loading: false,
                orderDetail: action.payload.order
            }
        },
        orderDetailFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        orderDetailClear(state, action) {
            return {
                ...state,
                loading: false,
                orderDetail: {}
            }
        },
        adminOrdersRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        adminOrdersSuccess(state, action) {
            return {
                ...state,
                loading: false,
                adminOrders: action.payload.orders
            }
        },
        adminOrdersFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        adminOrderClear(state, action) {
            return {
                ...state,
                loading: false,
                adminOrders: null
            }
        },
        updateadminOrdersRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        updateadminOrdersSuccess(state, action) {
            return {
                ...state,
                loading: false,
                updateadminOrders: action.payload.orders
            }
        },
        updateadminOrdersFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },

        deleteOrderRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        deleteOrderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isOrderDeleted: true
            }
        },
        deleteOrderFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },

        updateOrderRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        updateOrderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isOrderUpdated: true
            }
        },
        updateOrderFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },

        porterOrderRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        porterOrderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                porterOrderDetail:action.payload.porterOrder,
                isOrderUpdated: true
            }
        },
        porterOrderFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        },

        clearOrderDeleted(state, action) {
            return {
                ...state,
                isOrderDeleted: false
            }
        },
        clearOrderUpdated(state, action) {
            return {
                ...state,
                porterOrderDetail:null,
                isOrderUpdated: false
            }
        },
        orderSummaryRequest(state, action) {
            return { 
                ...state, 
                loading: true,
                 error: null 
                };
        },

        orderSummarySuccess(state, action) {
            return { ...state,
                  loading: false,
                  orderSummary: action.payload 
                  
                };
        },
        orderSummaryFail(state, action) {
            return { ...state,
                 loading: false,
                  error: action.payload 
                };
        },
        userSummaryRequest(state, action) {
            return { 
                ...state, 
                loading: true,
                 error: null 
                };
        },

        userSummarySuccess(state, action) {
            return { ...state,
                  loading: false,
                  userSummary: action.payload 
                  
                };
        },
        userSummaryFail(state, action) {
            return { ...state,
                 loading: false,
                  error: action.payload 
                };
        },

        adminOrderRemoveRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        adminOrderRemoveSuccess(state, action) {
            return {
                ...state,
                loading: false,
                orderRemoveResponse: action.payload.removeMessage
            }
        },
        adminOrderRemoveFail(state, action) {
            return {
                ...state,
                loading: false,
                orderRemoveError: action.payload
            }
        },
        adminOrderRemoveClearError(state, action) {
            return {
                ...state,
                loading: false,
                orderRemoveError:null,
                orderRemoveResponse:null
            }
        },
        

    }
});

const { actions, reducer } = orderSlice;

export const { 
    orderFail,
    orderSuccess,
    orderRequest,
    createOrderFail,
    createOrderSuccess,
    createOrderRequest,
    clearError,
    userOrdersFail,
    userOrdersSuccess,
    userOrdersRequest,
    orderDetailFail,
    orderDetailSuccess,
    orderDetailRequest,
    adminOrdersFail,
    adminOrdersRequest,
    adminOrdersSuccess,
    deleteOrderFail,
    deleteOrderRequest,
    deleteOrderSuccess,
    updateOrderFail,
    updateOrderRequest,
    updateOrderSuccess,
    porterOrderFail,
    porterOrderRequest,
    porterOrderSuccess,
    clearOrderDeleted,
    clearOrderUpdated,
    orderSummaryRequest,
    orderSummarySuccess,
    orderSummaryFail,
    userSummaryRequest,
    userSummarySuccess,
    userSummaryFail,
    adminOrderRemoveRequest,
    adminOrderRemoveSuccess,
    adminOrderRemoveFail,
    adminOrderRemoveClearError,
    updateadminOrdersFail,
    updateadminOrdersRequest,
    updateadminOrdersSuccess,
    adminOrderClear,
    orderDetailClear

 } = actions;

export default reducer;