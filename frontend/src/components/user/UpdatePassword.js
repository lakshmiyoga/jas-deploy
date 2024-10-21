import React, { useEffect, useState } from 'react';
import { updatePassword as updatePasswordAction, clearAuthError } from '../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { Slide, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import { clearUpdatePassword } from '../../slices/authSlice';
import LoaderButton from '../Layouts/LoaderButton';

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    capitalLetter: false,
    specialCharacter: false,
    minLength: false,
    maxLength: true,
  });

  const location = useLocation();
  const navigate = useNavigate();
  sessionStorage.setItem('redirectPath', location.pathname);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const dispatch = useDispatch();
  const { updatepasswordloading, isUpdated, error } = useSelector(state => state.authState);

  // Password validation function
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

  // Handle password change and validation
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      // toast.error("Password does not meet validation criteria", {
      //   position: "bottom-center",
      // });
      toast.dismiss();
      setTimeout(() => {
        toast.error("Password does not meet validation criteria", {
          position: 'bottom-center',
          type: 'error',
          autoClose: 700,
          transition: Slide,
          hideProgressBar: true,
          className: 'small-toast',
        });
      }, 300);
      return;
    }

    const formData = new FormData();
    formData.append('oldPassword', oldPassword);
    formData.append('password', password);
    dispatch(updatePasswordAction(formData));
  };

  useEffect(() => {
    if (isUpdated) {
      // toast('Password updated successfully', {
      //   type: 'success',
      //   position: 'bottom-center',
      // });
      toast.dismiss();
      setTimeout(() => {
        toast.success('Password updated successfully', {
          position: 'bottom-center',
          type: 'success',
          autoClose: 700,
          transition: Slide,
          hideProgressBar: true,
          className: 'small-toast',
        });
      }, 300);
      dispatch(clearUpdatePassword())
      setOldPassword('');
      setPassword('');
      navigate('/myprofile');
      return;
    }

    if (error) {
      // toast(error, {
      //   position: 'bottom-center',
      //   type: 'error',
      //   onOpen: () => { dispatch(clearAuthError) }
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
          onOpen: () => { dispatch(clearAuthError) }
        });
      }, 300);
      return;
    }
  }, [isUpdated, error, dispatch]);

  // Check if the password meets all validation criteria
  const isFormValid =
    passwordValidation.capitalLetter &&
    passwordValidation.specialCharacter &&
    passwordValidation.minLength &&
    passwordValidation.maxLength;

  return (
    <div>
      {/* <MetaData title={`Update Password`} /> */}
      <MetaData
        title="Update Password"
        description="Update your current password for enhanced security. Keep your account safe by choosing a strong and memorable password."
      />


      <div className="products_heading">Update Password</div>

      <div className="row wrapper mt-0">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg">
            <h3 className="mt-2 mb-5">Update Password</h3>

            <div className="form-group">
              <label htmlFor="old_password_field">Old Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  // type="password"
                  type={showOldPassword ? 'text' : 'password'}
                  id="old_password_field"
                  className="form-control"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                  }}
                >
                  {showOldPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="new_password_field">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  // type="password"
                  type={showPassword ? 'text' : 'password'}
                  id="new_password_field"
                  className="form-control"
                  value={password}
                  onChange={handlePasswordChange}
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


            {/* Password validation criteria */}
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

            <button
              type="submit"
              className="btn update-btn btn-block mt-4 mb-3"
              disabled={!isFormValid || updatepasswordloading}  // Disable submit if form is invalid
            >
              {updatepasswordloading ? <LoaderButton fullPage={false} size={20} /> : (
                <span>   Update Password</span>
              )

              }

            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
