import React, { useState , useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, clearAuthError } from '../../actions/userActions'
import {toast} from 'react-toastify'
import { useLocation } from 'react-router-dom'
import MetaData from '../Layouts/MetaData'

const ForgotPassword = () => {

    const [email, setEmail] = useState("")
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const dispatch = useDispatch()
    const { error, message } = useSelector(state => state.authState);

    const submitHandler = (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        dispatch(forgotPassword(formData))
    }

    useEffect(()=>{
        if(message) {
            toast(message, {
                type: 'success',
                position: "bottom-center",
            })
            setEmail("");
            return;
        }

        if(error)  {
            toast(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: ()=> { dispatch(clearAuthError) }
            })
            return
        }
    }, [message, error, dispatch])

  return (
    <div>
        <MetaData title={`Forgot Password`} />
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
                                onChange = {e=>setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            className="btn btn-block py-3">
                            Send Email
                    </button>

                    </form>
                </div>
            </div>
            </div>
  )
}

export default ForgotPassword
