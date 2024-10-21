import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearAuthError } from '../../actions/userActions';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Slide, toast } from 'react-toastify';
import MetaData from '../Layouts/MetaData';
import { clearResetPassword } from '../../slices/authSlice';
import LoaderButton from '../Layouts/LoaderButton';

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const dispatch = useDispatch();
    const { resetloading, isAuthenticated, error } = useSelector(state => state.authState);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password validation state
    const [passwordValidation, setPasswordValidation] = useState({
        capitalLetter: false,
        specialCharacter: false,
        minLength: false,
        maxLength: true,
    });

    const { token } = useParams();

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
        const formData = new FormData();
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);

        // Ensure password matches the confirm password before dispatch
        if (password !== confirmPassword) {
            //   toast.error("Passwords do not match", {
            //     position: 'bottom-center',
            //   });
            toast.dismiss();
            setTimeout(() => {
                toast.error("Passwords do not match", {
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

        // Dispatch reset password action
        dispatch(resetPassword({ formData, token }));
    };

    useEffect(() => {
        if (isAuthenticated) {
            //   toast('Password Reset Success!', {
            //     type: 'success',
            //     position: 'bottom-center',
            //   });
            toast.dismiss();
            setTimeout(() => {
                toast.success('Password Reset Success!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
            dispatch(clearResetPassword());
            navigate('/');
            return;
        }
        if (error) {
            //   toast(error, {
            //     position: 'bottom-center',
            //     type: 'error',
            //     onOpen: () => {
            //       dispatch(clearAuthError);
            //     },
            //   });
            toast.dismiss();
            setTimeout(() => {
                toast.error(error, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => {
                        dispatch(clearAuthError);
                    },
                });
            }, 300);
            return;
        }
    }, [isAuthenticated, error, dispatch, navigate]);

    useEffect(() => {
        dispatch(clearResetPassword());
    }, [dispatch]);

    // Disable submit button if password does not meet all validation criteria
    const isFormValid =
        passwordValidation.capitalLetter &&
        passwordValidation.specialCharacter &&
        passwordValidation.minLength &&
        passwordValidation.maxLength &&
        password === confirmPassword;

    return (
        <div>
            {/* <MetaData title={`Reset Password`} /> */}
            <MetaData
                title="Reset Password"
                description="Reset your account password securely. Enter your new password to regain access to your account and continue shopping with ease."
            />


            <div className="products_heading">Reset Password</div>

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-3">New Password</h1>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    // type="password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password_field"
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

                        <div className="form-group">
                            <label htmlFor="confirm_password_field">Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    // type="password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirm_password_field"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
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

                        <button
                            id="new_password_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={!isFormValid || resetloading}
                        >
                            {resetloading ? <LoaderButton fullPage={false} size={20} /> : (
                                <span>  Set Password</span>
                            )

                            }


                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
