import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../Layouts/Loader';
import { loadUser } from '../../actions/userActions';
import store from '../../store';
import { useEffect } from 'react';
import { Slide, toast } from 'react-toastify';
import { clearUser, clearlogout } from '../../slices/authSlice';
import { clearProducts } from '../../slices/productsSlice';

export default function ProtectedRoute({ children, isAdmin }) {
    // const { isAuthenticated, loading, user } = useSelector(state => state.authState);
    const { user, isAuthenticated,loggedoutmessage,isloggedout,loading } = useSelector(state => state.authState);
    const { products  } = useSelector( state => state.productsState);
  
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // useEffect(() => {
    //     if (!isAuthenticated && !loading) {
    //         store.dispatch(loadUser()); // Load user if not already loaded
    //     }
    // }, [isAuthenticated, loading]);

    // console.log("protecteduser",user)

    // useEffect(() => {
    //     if (isloggedout && !isAuthenticated && !user ) {
    //         // setRefresh(false);
    //         // dispatch(userOrdersClear());
    //         // dispatch(clearUser());
    //         // setOpenSide(!openSide);
    //         dispatch(clearProducts());
    //         toast.dismiss();
    //         setTimeout(() => {
    //           toast.success(loggedoutmessage, {
    //             position: 'bottom-center',
    //             type: 'success',
    //             autoClose: 700,
    //             transition: Slide,
    //             hideProgressBar: true,
    //             className: 'small-toast',
    //             // onOpen: () => { dispatch(clearlogout()) ; dispatch(clearProducts())},
    //             // onOpen: () => {window.close();},
    //           });
    //           window.close();
    //           dispatch(clearlogout());
    //           sessionStorage.clear();
  
    //           // Open a new tab with the target URL (home or login page)
              
  
    //           // Close the current tab
              
    //           setTimeout(() => {
    //             window.open('/', '_blank');
    //             window.location.replace('/'); // Fallback to replace current page
    //         }, 300);
        
    //         }, 300);
    //         // return;
    //     }
    // }, [isloggedout,dispatch,isAuthenticated]);
    useEffect(() => {
        if (isloggedout && !isAuthenticated && !user && isAdmin) {
            // navigate('/')
            sessionStorage.clear();
            // if(products){
            //     dispatch(clearProducts());
            // }
            
            toast.dismiss();
    
            setTimeout(() => {
                toast.success(loggedoutmessage, {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 300,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    // onClose: () => { window.close();window.open('/', '_blank');},
                    onClose: () => {   dispatch(clearlogout());   
                        dispatch(clearUser());},
            
                });
                // dispatch(clearlogout());
                setTimeout(() => {
                    // window.close();
                    // window.open('/', '_blank');
                    // window.open('/', '_blank');
                    window.location.replace('/'); // Fallback to replace current page
                }, 200);
                // Clear session storage and dispatch necessary actions
               
                
    
                // Open a new tab first
                // const newTab = window.open('/', '_blank');
                
                // Attempt to close the current tab (it may not work if this tab wasn't opened programmatically
    
            }, 10);
        }
    }, [isloggedout, dispatch, isAuthenticated, user, loggedoutmessage]);
    

    if (loading) {
        return <Loader />;
    }

    
    // if (!isAuthenticated) {
    //     return <Navigate to="/login" />;
    // }

    if(isAdmin && !isAuthenticated || isAdmin && !user ){
        return <Navigate to="/unauthorized" replace />;
    }


    if (isAdmin && isAuthenticated) {
        if (user && user.role === 'admin') {
            // const redirectPath = sessionStorage.getItem('redirectPath') || '/';
            // navigate(redirectPath);
            // sessionStorage.removeItem('redirectPath');
            // sessionStorage.removeItem('redirectPath');
            return children;
            
            // sessionStorage.removeItem('redirectPath');
            // return <Navigate to="/admin/dashboard" />

        } 
        else if (user && user.role !== 'admin'){
            return <Navigate to="/unauthorized" replace />;
        }
        else{
             return <Navigate to="/unauthorized" replace />;
        }
        // else {
        //     const redirectPath = sessionStorage.getItem('redirectPath') || '/';
        // //    return navigate(redirectPath);
        //     return <Navigate to={redirectPath} replace />;
        //     // sessionStorage.removeItem('redirectPath');
        //     // return <Navigate to="/" />;
            
        // }
    }

    else if ( !isAdmin && isAuthenticated) {

        if (user && user.role === 'user' || user && user.role === 'admin' ) {
            // const redirectPath = sessionStorage.getItem('redirectPath') || '/';
            // navigate(redirectPath);
            // sessionStorage.removeItem('redirectPath');
            // sessionStorage.removeItem('redirectPath');
            return children;
            
            // sessionStorage.removeItem('redirectPath');
            // return <Navigate to="/admin/dashboard" />

        } 
        else if (user && user.role !== 'user' || 'admin'){
            return <Navigate to="/unauthorized" replace />;
        }
        else{
            return <Navigate to="/unauthorized" replace />;
        }
        // else {
        //     const redirectPath = sessionStorage.getItem('redirectPath') || '/';
        // //    return navigate(redirectPath);
        //     return <Navigate to={redirectPath} replace />;
        //     // sessionStorage.removeItem('redirectPath');
        //     // return <Navigate to="/" />;
            
        // }
    }
    
    else if(!isAuthenticated || !user ){
        return <Navigate to="/unauthorized" replace />;
    }

    else{
        return <Navigate to="/login" />
    }

    // return children;
}

// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// import Loader from '../Layouts/Loader';

// export default function ProtectedRoute({ children, isAdmin }) {
//     const { isAuthenticated, loading, user } = useSelector(state => state.authState);
//     const location = useLocation();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!loading && isAuthenticated) {
//             const redirectPath = sessionStorage.getItem('redirectPath');
//             if (redirectPath && location.pathname !== redirectPath) {
//                 sessionStorage.removeItem('redirectPath');
//                 navigate(redirectPath, { replace: true });
//             }
//         }
//     }, [loading, isAuthenticated, location.pathname, navigate]);

//     if (loading) {
//         return <Loader />;
//     }

//     if (isAdmin && user && user.role !== 'admin') {
//         return <Navigate to="/" replace />;
//     }

//     if (!isAuthenticated) {
//         sessionStorage.setItem('redirectPath', location.pathname);
//         return <Navigate to="/login" replace />;
//     }

//     return children;
// }
