import React, { useEffect, useState } from 'react'
import { updatePassword as updatePasswordAction, clearAuthError } from '../../actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import {toast} from 'react-toastify'
import { useLocation } from 'react-router-dom'
import MetaData from '../Layouts/MetaData'

const UpdatePassword = () => {

    const [oldPassword, setOldPassword] =useState("")
    const [password, setPassword] =useState("")
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);

    const dispatch =useDispatch();
    const {isUpdated, error} = useSelector(state => state.authState)

    const submitHandler = (e) =>{
        e.preventDefault();

        const formData = new FormData();
        formData.append('oldPassword', oldPassword);
        formData.append('password',password)
        dispatch(updatePasswordAction(formData))

    }

    useEffect(()=>{

        if(isUpdated){
            toast('Password updated successfully',{
                type: 'success',
                position: "bottom-center",
            })
            setOldPassword('')
            setPassword('')
            return;
        }

        if(error){
            toast(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: ()=> { dispatch(clearAuthError) }
            })
            return
        }
    },[isUpdated, error, dispatch])

  return (
    <div>
         <MetaData title={`Update Password`} />
          
          <div className="products_heading">Update Password</div>
   
   
    <div className="row wrapper mt-0">
    <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
            <h3 className="mt-2 mb-5">Update Password</h3>
            <div className="form-group">
                <label htmlFor="old_password_field">Old Password</label>
                <input
                    type="password"
                    id="old_password_field"
                    className="form-control"
                    value={oldPassword}
                    onChange={e=>setOldPassword(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="new_password_field">New Password</label>
                <input
                    type="password"
                    id="new_password_field"
                    className="form-control"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                />
            </div>

            <button type="submit" className="btn update-btn btn-block mt-4 mb-3">Update Password</button>
        </form>
    </div>
</div>
</div>
  )
}

export default UpdatePassword
