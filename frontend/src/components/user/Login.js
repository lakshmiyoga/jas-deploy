import React, { Fragment, useState, useEffect, useRef } from 'react'
import MetaData from '../Layouts/MetaData'
import {clearAuthError, login} from "../../actions/userActions"
import { useDispatch, useSelector } from 'react-redux';
import {  toast } from 'react-toastify';
import {useLocation, useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';
import { clearError } from '../../slices/authSlice';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loading, error, isAuthenticated, user} = useSelector(state => state.authState)
    // const redirect = location.search?'/'+location.search.split('=')[1]:'/';

    // const hasShownToast = useRef(false);

    useEffect(() => {

        // if(isAuthenticated){
        //     navigate('/');
        // }
        if (isAuthenticated) {
            toast('Login successfully',{
                type:'success',
                position:"bottom-center",
                // onOpen:  () =>{dispatch(clearError())}
              })
            if (user.role === 'admin') {
                 sessionStorage.removeItem('redirectPath');
                // hasShownToast.current = true;
                const redirectPath = sessionStorage.getItem('redirectPath') || '/';
                navigate(redirectPath);
                // navigate('/');
            } else {
            // hasShownToast.current = true;
            const redirectPath = sessionStorage.getItem('redirectPath') || '/';
            navigate(redirectPath);
            // sessionStorage.removeItem('redirectPath'); 
            // navigate('/');
                
            }
            return
        }
        // if (isAuthenticated) {
        //     toast.success('Login successfully', {
        //         position: "bottom-center"
        //     });

        //     const redirectPath = sessionStorage.getItem('redirectPath') || '/';
        //     navigate(redirectPath);
        // }
        if(error){
           toast.error(error,{
            position:"bottom-center", 
            type: 'error',
            onOpen:  () =>{dispatch(clearError())}
        });
        // hasShownToast.current = true;
        }
        // return
    }, [error, isAuthenticated, dispatch, navigate])

    const submitHandler = async(e) => {
        e.preventDefault();
        // sessionStorage.removeItem('redirectPath');
        dispatch(login({email, password}));
    }
    // console.log(email, password);
    return (
        <div >
            <MetaData title={`Login`} />
            <div className="products_heading">Login</div>
            <div className="row wrapper">
                <div className="col-10 col-lg-5" >
                    <form onSubmit={submitHandler} className="shadow-lg mt-0">
                        <h3 className="mb-3">Login</h3>
                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={e => setEmail(e.target.value)}

                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <div style={{ position: 'relative' }}>
                            <input
                                // type="password"
                                type={showPassword ? 'text' : 'password'}
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                             <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </span>
                    </div>
                        </div>

                        <Link to='/password/forgot' className="float-right mb-4">Forgot Password?</Link>

                        <button
                            id="login_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading}
                        >
                            LOGIN
                        </button>

                        <Link to='/register' className="float-right mt-3">New User?</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
