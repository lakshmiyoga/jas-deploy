import { useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../Layouts/Loader';
import { loadUser } from '../../actions/userActions';
import store from '../../store';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, isAdmin }) {
    const { isAuthenticated, loading, user } = useSelector(state => state.authState);
  
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated && !loading) {
            store.dispatch(loadUser()); // Load user if not already loaded
        }
    }, [isAuthenticated, loading]);

    // console.log("protecteduser",user)

    if (loading) {
        return <Loader />;
    }

    
    // if (!isAuthenticated) {
    //     return <Navigate to="/login" />;
    // }

    if (isAdmin ) {
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

    else if (!isAdmin && isAuthenticated) {

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
    
    else if(!isAuthenticated){
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
