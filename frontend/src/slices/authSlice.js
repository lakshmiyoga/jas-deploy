// import { createSlice } from "@reduxjs/toolkit";


// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         loading: false,
//         isAuthenticated: false,
//         user: null,
//         error: null,
//     },
//     reducers: {
//         loginRequest(state, action) {
//             return {
//                 ...state,
//                 loading: true,
//                 isAuthenticated: false,
//                 user: null,
//                 error: null,
//             }
//         },
//         loginSuccess(state, action) {
//             return {
//                 loading: false,
//                 isAuthenticated: action.payload.success ? action.payload.success : false,
//                 user: action.payload.user
//             }
//         },
//         loginFail(state, action) {
//             return {
//                 ...state,
//                 loading: false,
//                 isAuthenticated: false,
//                 user: null,
//                 error: action.payload,
//             }
//         },
//         clearError(state, action) {
//             return {
//                 ...state,
//                 loading: false,
//                 error: null,
//                 // user:null
//             }
//         },
//         registerRequest(state, action) {
//             return {
//                 ...state,
//                 loading: true
//             }
//         },
//         registerSuccess(state, action) {
//             return {
//                 loading: false,
//                 isAuthenticated: action.payload.success ? action.payload.success : false,
//                 user: action.payload.user
//             }
//         },
//         registerFail(state, action) {
//             return {
//                 ...state,
//                 loading: false,
//                 error: action.payload
//             }
//         },
//         loadUserRequest(state, action) {
//             return {
//                 ...state,
//                 isAuthenticated: false,
//                 loading: true,
//                 user: null,
//             }
//         },
//         loadUserSuccess(state, action) {
//             return {
//                 // ...state,
//                 loading: false,
//                 isAuthenticated: action.payload.success ? action.payload.success : false,
//                 user: action.payload.user
//             }
//         },
//         loadUserFail(state, action) {
//             return {
//                 // ...state,
//                 loading: false,
//                 isAuthenticated: false,
//                 user: null,
//                 // error:action.payload
//             }
//         },
//         logoutRequest(state, action) {
//             return {
//                 // ...state,
//                 loading: false,
//                 // isAuthenticated: false,
//                 // user:null,
//             }
//         },
//         logoutSuccess(state, action) {
//             return {
//                 // ...state,
//                 loading: false,
//                 isAuthenticated: false,
//                 isloggedout: action.payload.success ? action.payload.success : false,
//                 loggedoutmessage: action.payload.message,
//                 user: null,
//             }
//         },
//         logoutFail(state, action) {
//             return {
//                 // ...state,
//                 error: action.payload,
//                 // isAuthenticated: false,
//                 // user:null,
//             }
//         },
//         clearlogout(state, action) {
//             return {
//             loading : false,
//             isAuthenticated : false,
//             isloggedout : false,
//             loggedoutmessage : null,
//             user : null,
//             }
//         },
//         clearUser(state, action) {
//             return {
//                 ...state,
//                 error: null,
//                 isAuthenticated: false,
//                 user: null,
//             }
//         },
//         updateProfileRequest(state, action) {
//             return {
//                 ...state,
//                 profileupdateloading: true,
//                 isUpdated: false
//             }
//         },
//         updateProfileSuccess(state, action) {
//             return {
//                 ...state,
//                 profileupdateloading: false,
//                 user: action.payload.user,
//                 isUpdated: true
//             }
//         },
//         updateProfileFail(state, action) {
//             return {
//                 ...state,
//                 profileupdateloading: false,
//                 error: action.payload
//             }
//         },
//         clearUpdateProfile(state, action) {
//             return {
//                 ...state,
//                 isUpdated: false,
//                 error: null
//             }
//         },

//         updatePasswordRequest(state, action) {
//             return {
//                 ...state,
//                 updatepasswordloading: true,
//                 isUpdated: false
//             }
//         },
//         updatePasswordSuccess(state, action) {
//             return {
//                 ...state,
//                 updatepasswordloading: false,
//                 isUpdated: true
//             }
//         },
//         updatePasswordFail(state, action) {
//             return {
//                 ...state,
//                 updatepasswordloading: false,
//                 error: action.payload
//             }
//         },
//         clearUpdatePassword(state, action) {
//             return {
//                 ...state,
//                 loading: false,
//                 isUpdated: false,
//                 error: null
//             }
//         },
//         forgotPasswordRequest(state, action) {
//             return {
//                 ...state,
//                 loading: true,
//                 message: null
//             }
//         },
//         forgotPasswordSuccess(state, action) {
//             return {
//                 ...state,
//                 loading: false,
//                 message: action.payload.message
//             }
//         },
//         forgotPasswordFail(state, action) {
//             return {
//                 ...state,
//                 loading: false,
//                 error: action.payload
//             }
//         },
//         resetPasswordRequest(state, action) {
//             return {
//                 ...state,
//                 resetloading: true,
//             }
//         },
//         resetPasswordSuccess(state, action) {
//             return {
//                 ...state,
//                 resetloading: false,
//                 isAuthenticated: true,
//                 user: action.payload.user
//             }
//         },
//         resetPasswordFail(state, action) {
//             return {
//                 ...state,
//                 resetloading: false,
//                 error: action.payload
//             }
//         },
//         clearResetPassword(state, actions) {
//             return {
//                 ...state,
//                 loading: false,
//                 isAuthenticated: false,
//                 user: null,
//                 error: null,
//             }
//         },


//     }

// });

// const { actions, reducer } = authSlice;

// export const { loginRequest,
//     loginSuccess,
//     loginFail,
//     clearError,
//     registerRequest,
//     registerSuccess,
//     registerFail,
//     loadUserRequest,
//     loadUserSuccess,
//     loadUserFail,
//     logoutSuccess,
//     logoutFail,
//     updateProfileFail,
//     updateProfileRequest,
//     updateProfileSuccess,
//     clearUpdateProfile,
//     updatePasswordFail,
//     updatePasswordRequest,
//     updatePasswordSuccess,
//     forgotPasswordFail,
//     forgotPasswordRequest,
//     forgotPasswordSuccess,
//     resetPasswordFail,
//     resetPasswordRequest,
//     resetPasswordSuccess,
//     clearResetPassword,
//     clearUpdatePassword,
//     logoutRequest,
//     clearUser,
//     clearlogout,
// } = actions;

// export default reducer;


import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        isAuthenticated: false,
        user: null,
        error: null,
        isloggedout: false,
        loggedoutmessage: null,
        profileupdateloading: false,
        isUpdated: false,
        updatepasswordloading: false,
        resetloading: false,
        message: null,
    },
    reducers: {
        loginRequest(state) {
            state.loading = true;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = action.payload.success ? action.payload.success : false;
            state.user = action.payload.user;
        },
        loginFail(state, action) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
        },
        clearError(state) {
            state.loading = false;
            state.error = null;
        },
        registerRequest(state) {
            state.loading = true;
        },
        registerSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = action.payload.success ? action.payload.success : false;
            state.user = action.payload.user;
        },
        registerFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        loadUserRequest(state) {
            state.isAuthenticated = false;
            state.loading = true;
            state.user = null;
        },
        loadUserSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = action.payload.success ? action.payload.success : false;
            state.user = action.payload.user;
        },
        loadUserFail(state) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
        },
        logoutRequest(state) {
            state.loading = false; // If you want to show a loading state
        },
        logoutSuccess(state, action) {
            state.loading = true;
            state.isAuthenticated = false;
            state.isloggedout = action.payload.success ? action.payload.success : false;
            state.loggedoutmessage = action.payload.message;
            state.user = null;
        },
        logoutFail(state, action) {
            state.error = action.payload;
        },
        clearlogout(state, action) {
            state.loading = false;
            state.isAuthenticated = false;
            state.isloggedout = false;
            state.loggedoutmessage = null;
            state.user = null;
        },
        clearUser(state) {
            state.error = null;
            state.isAuthenticated = false;
            state.user = null;
        },
        updateProfileRequest(state) {
            state.profileupdateloading = true;
            state.isUpdated = false;
        },
        updateProfileSuccess(state, action) {
            state.profileupdateloading = false;
            state.user = action.payload.user;
            state.isUpdated = true;
        },
        updateProfileFail(state, action) {
            state.profileupdateloading = false;
            state.error = action.payload;
        },
        clearUpdateProfile(state) {
            state.isUpdated = false;
            state.error = null;
        },
        updatePasswordRequest(state) {
            state.updatepasswordloading = true;
            state.isUpdated = false;
        },
        updatePasswordSuccess(state) {
            state.updatepasswordloading = false;
            state.isUpdated = true;
        },
        updatePasswordFail(state, action) {
            state.updatepasswordloading = false;
            state.error = action.payload;
        },
        clearUpdatePassword(state) {
            state.loading = false;
            state.isUpdated = false;
            state.error = null;
        },
        forgotPasswordRequest(state) {
            state.loading = true;
            state.message = null;
        },
        forgotPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        forgotPasswordFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetPasswordRequest(state) {
            state.resetloading = true;
        },
        resetPasswordSuccess(state, action) {
            state.resetloading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        resetPasswordFail(state, action) {
            state.resetloading = false;
            state.error = action.payload;
        },
        clearResetPassword(state) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        },
        reset(state) {
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: null,
                // Reset other state properties as needed
            };
        },
    }
});

const { actions, reducer } = authSlice;

export const {
    loginRequest,
    loginSuccess,
    loginFail,
    clearError,
    registerRequest,
    registerSuccess,
    registerFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail,
    updateProfileFail,
    updateProfileRequest,
    updateProfileSuccess,
    clearUpdateProfile,
    updatePasswordFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    forgotPasswordFail,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    resetPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    clearResetPassword,
    clearUpdatePassword,
    logoutRequest,
    clearUser,
    clearlogout,
    reset,

} = actions;

export default reducer;
