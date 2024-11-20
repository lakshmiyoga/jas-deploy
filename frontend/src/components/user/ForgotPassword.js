import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, clearAuthError } from '../../actions/userActions'
import { Slide, toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import MetaData from '../Layouts/MetaData'
import LoaderButton from '../Layouts/LoaderButton'

const ForgotPassword = ({ email, setEmail }) => {

    // const [email, setEmail] = useState("")
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const dispatch = useDispatch()
    const { error, message, loading } = useSelector(state => state.authState);
    const [flag, setFlag] = useState(false);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        dispatch(forgotPassword(formData))
    }

    useEffect(() => {
        if (message) {
            // toast(message, {
            //     type: 'success',
            //     position: "bottom-center",
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.success(message, {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
            setFlag(true)
            return;
        }

        if (error) {
            // toast(error, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => { dispatch(clearAuthError) }
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.error(error, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearAuthError) }
                });
            }, 300);
            return
        }
    }, [message, error, dispatch])

    return (
        <div>
            {/* <MetaData title={`Forgot Password`} /> */}
            <MetaData
                title="Forgot Password"
                description="Forgot your password? No problem. Enter your email to receive a password reset link and regain access to your account securely."
            />

            <div className="products_heading">Forgot Password</div>


            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h3 className="mb-3">Forgot Password</h3>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        {
                            flag ? (<button
                                id="forgot_password_button"
                                type="submit"
                                disabled={loading}
                                className="btn btn-block py-3">                               
                                {loading ? <LoaderButton fullPage={false} size={20} /> : (
                                        <span> Resend Link </span>
                                    )
                                    }
                            </button>) : (
                                <button
                                    id="forgot_password_button"
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-block py-3">                                 
                                   {loading ? <LoaderButton fullPage={false} size={20} /> : (
                                        <span> Send Link </span>
                                    )
                                    }
                                </button>
                            )

                        }



                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword