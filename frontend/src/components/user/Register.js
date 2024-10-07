import React, { useState, useEffect, useRef } from 'react'
import { register, clearAuthError, loadUser } from "../../actions/userActions"
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearError } from '../../slices/userSlice';
import MetaData from '../Layouts/MetaData';
import NumberInput from '../Layouts/NumberInput';
import { sendMailOtp, verifyMailOtp } from '../../actions/otpActions';
import Loader from '../Layouts/Loader';
import { otpClear, otpErrorClear } from '../../slices/otpSlice';
import ButtonLoader from '../Layouts/LoaderButton';
import store from '../../store';

// const Register = () => {

//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });
//   // const location = useLocation();
//   // sessionStorage.setItem('redirectPath', location.pathname);
//   // const location = useLocation();
//   // sessionStorage.setItem('redirectPath', location.pathname);
//   const [avatar, setAvatar] = useState("");
//   const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error, isAuthenticated } = useSelector(state => state.authState)

//   // const hasShownToast = useRef(false);

//   //   const onChange = (e) => {
//   //     if(e.target.name === 'avatar') {
//   //        const reader = new FileReader();
//   //        reader.onload = () => {
//   //             if(reader.readyState === 2) {
//   //                 setAvatarPreview(reader.result);
//   //                 setAvatar(e.target.files[0])
//   //             }
//   //        }
//   //        reader.readAsDataURL(e.target.files[0])
//   //     }else{
//   //         setUserData({...userData, [e.target.name]:e.target.value })
//   //     }
//   // }

//   const onChangeAvatar = (e) => {
//     const file = e.target.files[0];
//     const fileSizeLimit = 1 * 1024 * 1024; // 1 MB

//     if (file && file.size > fileSizeLimit) {
//       toast.error('The size of selected image exceeds the 1MB limit.', {
//         position: "bottom-center"
//       });
//       e.target.value = ''; // Clear the file input
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       if (reader.readyState === 2) {
//         setAvatarPreview(reader.result);
//         setAvatar(file);
//       }
//     };

//     if (file) {
//       reader.readAsDataURL(file);
//     }
//   };

//   const onChange = (e) => {
//     if (e.target.name === 'avatar') {
//       onChangeAvatar(e);
//     } else {
//       setUserData({ ...userData, [e.target.name]: e.target.value });
//     }
//   };


//   const submitHandler = (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('name', userData.name)
//     formData.append('email', userData.email)
//     formData.append('password', userData.password)
//     formData.append('avatar', avatar);
//     dispatch(register(formData))

//   }

//   useEffect(() => {

//     if (isAuthenticated) {
//       toast('Register successfully', {
//         type: 'success',
//         position: "bottom-center",
//         // onOpen:  () =>dispatch(clearError())
//       })
//       // hasShownToast.current = true;
//       navigate('/');
//       return
//     }
//     if (error) {
//       toast.error(error, {
//         position: "bottom-center",
//         type: 'error',
//         onOpen: () => dispatch(clearError())
//       });
//       // hasShownToast.current = true;
//     }
//     return
//   }, [error, isAuthenticated, dispatch, navigate])


//   return (
//     <div>
//       <MetaData title={`Register`} />

//       <div className="products_heading">Register</div>

//       <div className="row wrapper mt-0">
//         <div className="col-10 col-lg-5">
//           <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
//             <h3 className="mb-3">Register</h3>

//             <div className="form-group">
//               <label htmlFor="email_field">Name</label>
//               <input name='name' onChange={onChange} type="name" id="name_field" className="form-control" />
//             </div>

//             <div className="form-group">
//               <label htmlFor="email_field">Email</label>
//               <input
//                 type="email"
//                 id="email_field"
//                 className="form-control"
//                 name='email'
//                 onChange={onChange}

//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="password_field">Password</label>
//               <input
//                 type="password"
//                 id="password_field"
//                 className="form-control"
//                 name='password'
//                 onChange={onChange}

//               />
//             </div>

//             <div className='form-group'>
//               <label htmlFor='avatar_upload'>Avatar(*Size should be within 1mb)</label>
//               <div className='d-flex align-items-center'>
//                 <div>
//                   <figure className='avatar mr-3 item-rtl'>
//                     <img
//                       src={avatarPreview}
//                       className='rounded-circle'
//                       alt='avatar'
//                     />
//                   </figure>
//                 </div>
//                 <div className='custom-file'>
//                   <input
//                     type='file'
//                     name='avatar'
//                     onChange={onChange}
//                     className='custom-file-input'
//                     id='customFile'
//                   />
//                   <label className='custom-file-label' htmlFor='customFile'>
//                     Choose Avatar
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <button
//               id="register_button"
//               type="submit"
//               className="btn btn-block py-3"
//               disabled={loading}
//             >
//               REGISTER
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Register

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { registerUser, clearErrors } from '../../actions/userActions'; // Adjust import based on your action structure
// import MetaData from '../layouts/MetaData';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.png');
  const [timeLeft, setTimeLeft] = useState(null);
  const [passwordValidation, setPasswordValidation] = useState({
    capitalLetter: false,
    specialCharacter: false,
    minLength: false,
    maxLength: true,
  });
  console.log("avatar",avatar);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.authState);
  const {
    otpdata,
    otperror,
    otploading,
    verifyloading,
    mailVerifiedData,
    mailVerifyError,
    dummyisAuthenticated,
    dummyuser,
  } = useSelector((state) => state.otpState);

  // console.log("user",user)

  const mailIdRef = useRef(null);
  const [mailButtonDisabled, setMailButtonDisabled] = useState(false);
  const [otpMail, setOtpMail] = useState('');
  const [mailCode, setMailCode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [mailVerified, setMailVerified] = useState(false);
  const registerRef = useRef(null); // Create a ref

console.log("otpmail",otpMail)
  // Password validation
  const validatePassword = (password) => {
    const capitalLetter = /[A-Z]/.test(password);
    const specialCharacter = /[!@#$%^&*]/.test(password);
    const minLength = password.length >= 6;
    const maxLength = password.length <= 20;

    setPasswordValidation({
      capitalLetter,
      specialCharacter,
      minLength,
      maxLength,
    });
  };

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
    const { name, value } = e.target;
    if (name === 'mobile' && value.length > 10) {
      return; // Prevent updating state if mobile exceeds 10 digits
      // Alternatively, you can truncate it
      // setUserData({ ...userData, [name]: value.slice(0, 10) });
    }
    if (name === 'password') {
      validatePassword(value);
    }
    setUserData({ ...userData, [name]: value });
  };

  
  useEffect(()=>{
window.scrollTo({ top: 0, behavior: 'smooth' });
}, [otpdata]);


  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(otpErrorClear());
    dispatch(otpClear());
    if( userData.password !== userData.confirmPassword ){
      toast.error('Password does not match');
      return
    }
    if(userData.mobile.length<10){
      toast.error('Mobile nunber Invalid!!!');
      return
    }
       // Scroll to the top of the Register component
    //    if (registerRef.current) {
    //     registerRef.current.scrollIntoView({ behavior: 'smooth' });
    // }
    if (
      passwordValidation.capitalLetter &&
      passwordValidation.specialCharacter &&
      passwordValidation.minLength &&
      passwordValidation.maxLength 
     
    ) {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('mobile', userData.mobile);
      formData.append('avatar', avatar);
      setMailButtonDisabled(true);
      setTimeLeft(null);
      clearInterval(mailIdRef.current);
      dispatch(sendMailOtp(formData));

    } else {
      toast.error('Password does not meet all criteria');
    }
  };

  // const resendOTP = (e) => {
  //   e.preventDefault();
  //   setMailButtonDisabled(true);
  //   setTimeLeft(null);
  //   clearInterval(mailIdRef.current);
  //   dispatch(otpClear());
  //   if (
  //     passwordValidation.capitalLetter &&
  //     passwordValidation.specialCharacter &&
  //     passwordValidation.minLength &&
  //     passwordValidation.maxLength
  //   ) {
  //     const formData = new FormData();
  //     formData.append('name', userData.name);
  //     formData.append('email', userData.email);
  //     formData.append('password', userData.password);
  //     formData.append('mobile', userData.mobile);
  //     formData.append('avatar', avatar);
  //     dispatch(sendMailOtp(formData));
  //   } else {
  //     toast.error('Password does not meet all criteria');
  //   }
  // };

  useEffect(() => {
    if (otperror) {
      toast.error(otperror);
      setMailButtonDisabled(false);
    }
    if (otpdata && !timeLeft) {
      setMailButtonDisabled(true);
      setTimeLeft(null);
      clearInterval(mailIdRef.current);
      setOtpSent(true);
      toast.success(otpdata.message);
      setMailCode(true);
      setTimeLeft(60);
      mailIdRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1 || prevTime < 1) {
            clearInterval(mailIdRef.current);
            setMailCode(false);
            setMailButtonDisabled(false);
            return null;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }
  }, [otpdata, otperror, otploading]);

  const verifyMail = (e) => {
    // e.preventDefault();
    // dispatch(otpClear());
    dispatch(otpErrorClear());
    if (otpdata) {
      dispatch(verifyMailOtp({ email: otpdata.dummyuserData.email, otp: otpMail, otpdata }));
    }
  };

  useEffect(() => {
    if (mailVerifiedData) {
      toast.success(mailVerifiedData.message);
      setMailVerified(true);
      clearInterval(mailIdRef.current);
      setMailCode(false);
      setTimeLeft(null);
    }
    if (mailVerifyError) {
      // console.log(otpdata)
      toast.error(mailVerifyError);
      setMailVerified(false);
    }
  }, [mailVerifiedData, mailVerifyError]);

  useEffect(() => {
    if (dummyisAuthenticated && dummyuser) {
      store.dispatch(loadUser());
    }
    if (error) {
      toast.error(error, {
        position: 'bottom-center',
        type: 'error',
        onOpen: () => dispatch(clearError())
      });
    }
    if (isAuthenticated) {
      dispatch(otpErrorClear());
      dispatch(otpClear());
      toast('Registered successfully', { type: 'success', position: 'bottom-center' });
      navigate('/');
    }
  }, [dummyisAuthenticated, navigate, dispatch,isAuthenticated]);

  const handleOtpChange = (e) => {
    setOtpMail(e.target.value);
  };

  useEffect(()=>{
    if (otpMail.length === 6) {
      verifyMail();
    }

  },[otpMail])

  return (
    <div >
      <MetaData title="Register" />
      <div className="products_heading" ref={registerRef}>Register</div>
      <div className="row wrapper mt-0">
        <div className="col-10 col-lg-5">
          {
            otpdata || otpSent ? (
              // <div>
              //   <div>enter 6 digit that has sent to email </div>
              //   <div style={{ display: 'flex', width: '90%', position: 'relative', marginBottom: '5px' }}>
              //     <input
              //       type="text"
              //       placeholder="Enter OTP"
              //       style={{ borderRadius: '10px', marginRight: '5px' }}
              //       maxLength="6"
              //       onChange={handleOtpChange}
              //       autocomplete="one-time-code"
              //     />
              //     <button
              //       style={{ color: 'white', backgroundColor: 'green', borderRadius: '12px', border: 'none', padding: '5px', minWidth: '20%', cursor: 'pointer' }}
              //       onClick={(e) => verifyMail(e)}
              //     >
              //       {verifyloading ? <ButtonLoader fullPage={false} size={20} /> : (
              //         <span>Verify</span>
              //       )

              //       }

              //     </button>
              //   </div>
              //   <button
              //     style={{ color: 'white', backgroundColor: 'green', borderRadius: '12px', border: 'none', padding: '5px', minWidth: '20%', cursor: 'pointer' }}
              //     onClick={submitHandler}
              //   >
              //     {otploading ? <ButtonLoader fullPage={false} size={20} /> : (
              //       <span> Resend OTP</span>
              //     )

              //     }

              //   </button>
              //   {timeLeft !== null && <p>Time left: {timeLeft}s</p>}
              // </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', margin: 'auto' }}>
                <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: '500', color: '#333', textAlign: 'center' }}>
                  Enter the 6-digit code sent to your email
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'relative', marginBottom: '20px' }}>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      padding: '10px',
                      width: '100%',
                      fontSize: '16px',
                      textAlign: 'center',
                      marginRight: '10px',
                      outline: 'none',
                      transition: 'border 0.3s ease',
                    }}
                    maxLength="6"
                    onChange={handleOtpChange}
                    autocomplete="one-time-code"
                  />
                  <span
                    onClick={submitHandler}
                    style={{
                      color: '#007bff',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      fontSize: '10px',
                      // marginBottom: '10px',
                      alignSelf: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      // minWidth:'20%'
                    }}
                  >
                    {otploading ? <ButtonLoader fullPage={false} size={20} /> : <span >Resend OTP</span>}
                  </span>
                </div>
                <button
                  style={{
                    color: '#fff',
                    backgroundColor: '#28a745',
                    borderRadius: '8px',
                    border: 'none',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    width: '100%',
                    marginBottom: '10px',
                  }}
                  onClick={(e) => verifyMail(e)}
                >
                  {verifyloading ? <ButtonLoader fullPage={false} size={20} /> : <span>Verify</span>}
                </button>
                {timeLeft !== null && <p style={{ fontSize: '14px', color: '#555' }}>Time left: {timeLeft}s</p>}
              </div>

            ) : (
              <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                <h3>Register</h3>

                <div className="form-group">
                  <label htmlFor="name_field">Name <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    id="name_field"
                    name="name"
                    className="form-control"
                    value={userData.name}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="email"
                    id="email_field"
                    name="email"
                    className="form-control"
                    value={userData.email}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password_field">Password <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                  <input
                  type={showPassword ? 'text' : 'password'}
                    // type="password"
                    id="password_field"
                    name="password"
                    className="form-control"
                    value={userData.password}
                    onChange={onChange}
                    required
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
                <ul className="password-criteria">
                    <li className={passwordValidation.minLength ? 'text-success' : 'text-danger'}>
                      {passwordValidation.minLength ? '✔' : '✘'} Minimum 6 characters
                    </li>
                    <li className={passwordValidation.capitalLetter ? 'text-success' : 'text-danger'}>
                      {passwordValidation.capitalLetter ? '✔' : '✘'} At least one capital letter
                    </li>
                    <li className={passwordValidation.specialCharacter ? 'text-success' : 'text-danger'}>
                      {passwordValidation.specialCharacter ? '✔' : '✘'} At least one special character
                    </li>
                    <li className={passwordValidation.maxLength ? 'text-success' : 'text-danger'}>
                      {passwordValidation.maxLength ? '✔' : '✘'} No more than 20 characters
                    </li>
                  </ul>
                <div className="form-group">
                  <label htmlFor="confirmPassword_field">Confirm Password <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword_field"
                      name="confirmPassword"
                      className="form-control"
                      value={userData.confirmPassword}
                      onChange={onChange}
                      required
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer'
                      }}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone_field">Phone No (+91) <span style={{ color: 'red' }}>*</span></label>
                  <NumberInput
                    id="mobile_field"
                    name="mobile"
                    className="no-arrow-input form-control"
                    value={userData.mobile}
                    onChange={onChange}
                  />
                </div>

                <div className='form-group'>
              <label htmlFor='avatar_upload'>Avatar(*Size should be within 1mb)</label>
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
                    onChange={onChangeAvatar}
                    className='custom-file-input'
                    id='customFile'
                  />
                  <label className='custom-file-label' htmlFor='customFile'>
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>
                {/* {
                  otploading ? <ButtonLoader /> : (
                    <button type="submit" className="btn btn-block py-3" disabled={otploading}>
                      REGISTER
                    </button>
                  )
                } */}

                <button type="submit" className="btn btn-block py-3" disabled={otploading}>
                  {otploading ? <ButtonLoader fullPage={false} size={20} /> : (
                    <span>  REGISTER</span>
                  )

                  }


                </button>

              </form>
            )
          }

        </div>
      </div>
    </div>
  );
};

export default Register;

