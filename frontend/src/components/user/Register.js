import React, { useState, useEffect, useRef } from 'react'
import { register, clearAuthError } from "../../actions/userActions"
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearError } from '../../slices/userSlice';
import MetaData from '../Layouts/MetaData';

const Register = () => {

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: ""
  });
  // const location = useLocation();
  // sessionStorage.setItem('redirectPath', location.pathname);
  // const location = useLocation();
  // sessionStorage.setItem('redirectPath', location.pathname);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.authState)

  // const hasShownToast = useRef(false);

  //   const onChange = (e) => {
  //     if(e.target.name === 'avatar') {
  //        const reader = new FileReader();
  //        reader.onload = () => {
  //             if(reader.readyState === 2) {
  //                 setAvatarPreview(reader.result);
  //                 setAvatar(e.target.files[0])
  //             }
  //        }
  //        reader.readAsDataURL(e.target.files[0])
  //     }else{
  //         setUserData({...userData, [e.target.name]:e.target.value })
  //     }
  // }

  const onChangeAvatar = (e) => {
    const file = e.target.files[0];
    const fileSizeLimit = 1 * 1024 * 1024; // 1 MB

    if (file && file.size > fileSizeLimit) {
      toast.error('The size of selected image exceeds the 1MB limit.', {
        position: "bottom-center"
      });
      e.target.value = ''; // Clear the file input
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(file);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onChange = (e) => {
    if (e.target.name === 'avatar') {
      onChangeAvatar(e);
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };


  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', userData.name)
    formData.append('email', userData.email)
    formData.append('password', userData.password)
    formData.append('avatar', avatar);
    dispatch(register(formData))

  }

  useEffect(() => {

    if (isAuthenticated) {
      toast('Register successfully', {
        type: 'success',
        position: "bottom-center",
        // onOpen:  () =>dispatch(clearError())
      })
      // hasShownToast.current = true;
      navigate('/');
      return
    }
    if (error) {
      toast.error(error, {
        position: "bottom-center",
        type: 'error',
        onOpen: () => dispatch(clearError())
      });
      // hasShownToast.current = true;
    }
    return
  }, [error, isAuthenticated, dispatch, navigate])


  return (
    <div>
      <MetaData title={`Register`} />

      <div className="products_heading">Register</div>

      <div className="row wrapper mt-0">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
            <h3 className="mb-3">Register</h3>

            <div className="form-group">
              <label htmlFor="email_field">Name</label>
              <input name='name' onChange={onChange} type="name" id="name_field" className="form-control" />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name='email'
                onChange={onChange}

              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name='password'
                onChange={onChange}

              />
            </div>

            <div className='form-group'>
              <label htmlFor='avatar_upload'>Avatar</label>
              <div className='d-flex align-items-center'>
                <div>
                  <figure className='avatar mr-3 item-rtl'>
                    <img
                      src={avatarPreview}
                      className='rounded-circle'
                      alt='avatar'
                    />
                  </figure>
                </div>
                <div className='custom-file'>
                  <input
                    type='file'
                    name='avatar'
                    onChange={onChange}
                    className='custom-file-input'
                    id='customFile'
                  />
                  <label className='custom-file-label' htmlFor='customFile'>
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading}
            >
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
