import React, { Fragment, useState, useEffect, useRef } from 'react'
import MetaData from '../Layouts/MetaData'
import { clearAuthError, login } from "../../actions/userActions"
import { useDispatch, useSelector } from 'react-redux';
import { Slide, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { clearError } from '../../slices/authSlice';
import LoaderButton from '../Layouts/LoaderButton';

const Login = ({ email, setEmail }) => {

    // const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loggedin, setloggedin] = useState(false);
    // const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated, user } = useSelector(state => state.authState)

    const [emailMissing, setEmailMissing] = useState(false);

    const handleClick = () => {
        if (!email) {
            setEmailMissing(true);
        }
    };

    // const redirect = location.search?'/'+location.search.split('=')[1]:'/';

    // const hasShownToast = useRef(false);

    useEffect(() => {

        // if(isAuthenticated){
        //     navigate('/');
        // }
        if (isAuthenticated && loggedin && user) {
            // toast('Login successfully',{
            //     type:'success',
            //     position:"bottom-center",
            //     autoClose: 500, 
            //     // onOpen:  () =>{dispatch(clearError())}
            //   })
            toast.dismiss();
            setTimeout(() => {
                toast.success('Login successfully', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
            if (user.role === 'admin') {
                sessionStorage.removeItem('redirectPath');
                // hasShownToast.current = true;
                const redirectPath = sessionStorage.getItem('redirectPath') || '/admin/dashboard';
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
        if (error && loggedin) {
            //    toast.error(error,{
            //     position:"bottom-center", 
            //     type: 'error',
            //     onOpen:  () =>{dispatch(clearError())}
            // });
            toast.dismiss();
            setTimeout(() => {
                toast.error(error, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearError()) }
                });
            }, 300);
            // hasShownToast.current = true;
        }
        // return
    }, [error, isAuthenticated, user, dispatch, navigate, loggedin])

    useEffect(() => {

        if (isAuthenticated && user && !loggedin) {
            const redirectPath = sessionStorage.getItem('redirectPath') || '/';
            navigate(redirectPath);
        }

    }, [isAuthenticated, loggedin, user])

    const submitHandler = async (e) => {
        e.preventDefault();
        // sessionStorage.removeItem('redirectPath');
        dispatch(login({ email, password }));
        setloggedin(true);
    }
    // console.log(email, password);


    return (
        <div >
            {/* <MetaData title={`Login`} /> */}
            <MetaData
                title="Login"
                description="Log in to your account to access your shopping cart, order history, and personalized recommendations. Secure and fast login for a seamless shopping experience."
            />

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
                                required
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
                        {emailMissing && <p style={{ color: 'red', fontSize: '12px' }}>Please enter your email to proceed.</p>}
                        <Link to={email ? '/password/forgot' : ''} className="float-right mb-4" onClick={handleClick}>Forgot Password?</Link>

                        <button
                            id="login_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading}
                        >
                            {loading ? <LoaderButton fullPage={false} size={20} /> : (
                                <span>  LOGIN</span>
                            )

                            }

                        </button>

                        <Link to='/register' className="float-right mt-3">New User?</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
