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

    // useEffect(() => {
    //         store.dispatch(loadUser());
    // }, []);

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
            return children;
            
            // sessionStorage.removeItem('redirectPath');
            // return <Navigate to="/admin/dashboard" />

        } else {
            const redirectPath = sessionStorage.getItem('redirectPath') || '/';
           return navigate(redirectPath);
            // sessionStorage.removeItem('redirectPath');
            // return <Navigate to="/" />;
            
        }
    }

   
    // if (!isAdmin) {
    //     if (user && user.role === 'admin') {
    //         const redirectPath = sessionStorage.getItem('redirectPath') || '/';
    //         return navigate(redirectPath);
    //         // return children;
    //         // return <Navigate to="/admin/dashboard" />
    //     } else {
    //         const redirectPath = sessionStorage.getItem('redirectPath') || '/';
    //        return navigate(redirectPath);
    //         // return <Navigate to="/" />;
    //     }
    // }


    return children;
}
