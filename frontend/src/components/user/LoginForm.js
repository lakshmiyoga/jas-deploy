
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp } from '../../actions/loginOtpActions';
import { toast, Slide } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { clearSendOtp, clearVerifyError } from '../../slices/authSlice';
import LoaderButton from '../Layouts/LoaderButton';

const LoginForm = ({ showModal, onClose }) => {
    const [input, setInput] = useState('');
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [inputError, setInputError] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isReOtpSent, setIsReOtpSent] = useState(false);
    const [reSent, setReSent] = useState(false);
    const [isValidInput, setIsValidInput] = useState(false);
    const [timer, setTimer] = useState(60);
    const [showResendLink, setShowResendLink] = useState(false);
    const [selectedInputType, setSelectedInputType] = useState('phone'); // New state for input type
    const otpInputRefs = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sendLoading, verifyLoading, verifyError, sendError, sendMessage, error, success, isAuthenticated } = useSelector(state => state.authState);

    // Validate input (email or phone number)
    const validateInput = (value) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const phoneRegex = /^\d{10}$/;
        if (emailRegex.test(value) || phoneRegex.test(value)) {
            setInputError('');
            setIsValidInput(true);
            return true;
        } else {
            if(selectedInputType === 'phone'){
                setInputError('Please enter a phone number.');
                setIsValidInput(false);
                return false;
            }
            else{
                setInputError('Please enter a valid email.');
                setIsValidInput(false);
                return false;
            }
           
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);
        validateInput(value);
    };

    // Send OTP
    const handleSendOtp = () => {
        if (!validateInput(input)) {
            // toast.error(inputError);
            toast.dismiss();
            setTimeout(() => {
                toast.error(inputError, {
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

        dispatch(sendOtp({input,inputType:selectedInputType}));
        otpInputRefs.current[0]?.focus();
    };

    const handleResendOtp = () => {
        if (!validateInput(input)) {
            // toast.error(inputError);
            toast.dismiss();
            setTimeout(() => {
                toast.error(inputError, {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
            return;
        }
        dispatch(clearSendOtp());
        dispatch(sendOtp({input,inputType:selectedInputType}));
        setReSent(true);
        otpInputRefs.current[0]?.focus();
    };



    //     // Handle OTP verification
    // const handleVerifyOtp = (otpValue) => {
    //     dispatch(verifyOtp({ input, otp: otpValue }))
    //         .then(response => {
    //             // Check if the OTP verification succeeded
    //             if (response.payload.success) { 
    //                 toast.success(response.payload.message || "OTP verified successfully!");
    //                 setIsOtpSent(false); // Stop the OTP flow
    //                 setTimer(0); // Stop the timer
    //                 navigate('/'); // Redirect to home page
    //             } else {
    //                 // Show error if OTP is invalid
    //                 toast.error(response.payload.error || "Invalid OTP. Please try again.");
    //             }
    //         })
    //         .catch(() => {
    //             toast.error("Invalid OTP. Please try again.");
    //         });
    // };

    // Handle OTP verification
    const handleVerifyOtp = (otpValue) => {
        dispatch(verifyOtp({ input, otp: otpValue }));
        // .then(response => {
        //     console.log("response", response)
        //     if (response && response.payload.message) { // Check if success is true
        //         toast.success(response && response.payload.message);
        //         setIsOtpSent(false); // Stop the OTP flow
        //         setTimer(0); // Stop the timer
        //         onClose();
        //         // navigate('/'); 
        //     } else {
        //         toast.error(response && response.payload.error);
        //     }
        // })
        // .catch(() => {
        //     toast.error("Otp expired. Please try again.");
        // });
    };

    useEffect(() => {
        if (isAuthenticated) {
            // dispatch(clearError())
            onClose();
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
            navigate('/');
        }
    }, [isAuthenticated])

    // Handle OTP input change
    const handleChange = (element, index) => {
        const newOtp = [...otp];
        newOtp[index] = element.value;

        setOtp(newOtp);

        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }

        if (newOtp.every(num => num !== '')) {
            handleVerifyOtp(newOtp.join(''));
        }
    };
    useEffect(() => {
        // Focus the first input field on mount
        otpInputRefs.current[0]?.focus();
    }, [isOtpSent]);

    // Reset OTP fields if OTP verification fails
    useEffect(() => {
        if (verifyError) {
            // toast.error(verifyError);
            toast.dismiss();
            setTimeout(() => {
                toast.error(inputError, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
            dispatch(clearVerifyError());
            setOtp(Array(6).fill(''));
            otpInputRefs.current[0]?.focus();
        }
        if (sendError) {
            // toast.error(sendError);
            toast.dismiss();
            setTimeout(() => {
                toast.error(sendError, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
            dispatch(clearSendOtp());
        }
        if (sendMessage && !isOtpSent) {
            setIsOtpSent(true);
            setShowResendLink(false);
            setTimer(60);
            // toast.success(sendMessage);
            toast.dismiss();
            setTimeout(() => {
                toast.success(sendMessage, {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
            dispatch(clearSendOtp());
        }
        if (sendMessage && isOtpSent && reSent) {
            setIsReOtpSent(true);
            setShowResendLink(false);
            setTimer(60);
            setReSent(false);
            // toast.success(sendMessage);
            toast.dismiss();
            setTimeout(() => {
                toast.success(sendMessage, {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
            dispatch(clearSendOtp());
        }
    }, [verifyError, sendError, sendMessage, reSent]);

    // Timer effect for OTP expiration
    useEffect(() => {
        let interval;
        if (isOtpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setShowResendLink(true); // Show resend link when timer reaches 0
        }

        return () => clearInterval(interval);
    }, [isOtpSent, timer]);


    const handleTypeSelection = (type) => {
        setSelectedInputType(type);
        setInput('');  // Clear input when switching between types
        setInputError('');
    };


    // Paste handler for copy-pasting the entire OTP
    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData('Text').slice(0, 6).split('');
        setOtp(pasteData);
        if (pasteData.length === 6) {
            handleVerifyOtp(pasteData.join(''));
        }
    };

    // Clear OTP input on backspace and handle backward navigation
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            e.preventDefault();
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            otpInputRefs.current[index - 1]?.focus();
        }
    };
    const handleClick = (e, index) => {
        // If the current field is empty and it's clicked, focus on the first empty field
        e.preventDefault();
        const element = e.target;
        const length = element.value.length;
        element.setSelectionRange(length, length);

        // Focus on the next unfilled input, if any
        if (otp[index] === '' && otp[index - 1] !== '') {
            otpInputRefs.current[index]?.focus(); // Move focus to the current if previous is filled
        }
        // Focus on previous input if current is empty and previous is empty
        else if (otp[index] === '' && otp[index - 1] === '') {
            otpInputRefs.current[index - 1]?.focus(); // Move focus to previous
            handleClick(e, index - 1)
        }
        else if (otp[index] !== '' && otp[index + 1] !== '') {
            otpInputRefs.current[index + 1]?.focus(); // Move focus to previous
            handleClick(e, index + 1)
        }
        else if (otp[index] !== '' && otp[index + 1] === '') {
            otpInputRefs.current[index + 1]?.focus(); // Move focus to previous
            handleClick(e, index + 1)
        }
        // Focus to the next field if the current is filled and next is empty
        // else if (otp[index] !== '' && otp[index + 1] !== '') {
        //     otpInputRefs.current[index + 1]?.focus(); // Move focus to next
        //     handleClick(e,index + 1)
        // }
    };
    const moveCursorToEnd = (element) => {
        const length = element.value.length;
        element.setSelectionRange(length, length); // Move cursor to the end
    }
    //   const handleFocus = (e,index) => {
    //     console.log("index",index)
    //     e.preventDefault();

    //     // Focus on the next unfilled input, if any
    //     if (otp[index] === '' && otp[index - 1] !== '') {
    //         otpInputRefs.current[index]?.focus(); // Move focus to the current if previous is filled
    //     }
    //     // Focus on previous input if current is empty and previous is empty
    //     else if (otp[index] === '' && otp[index - 1] === '') {
    //         otpInputRefs.current[index - 1]?.focus(); // Move focus to previous
    //         // handleFocus(e,index - 1)
    //     }
    //     // Focus to the next field if the current is filled and next is empty
    //     else if (otp[index] !== '' && otp[index + 1] === '') {
    //         otpInputRefs.current[index + 1]?.focus(); // Move focus to next
    //         // handleFocus(e,index + 1)
    //     }
    //     };
    const handelBack =()=>{
        setIsOtpSent(false);
        setOtp(Array(6).fill(''));
        setInputError('');
        setIsReOtpSent(false);
        setReSent(false);
        setTimer(60);
        setShowResendLink(false);

    }
    const onCloseHandler = () =>{
        setIsOtpSent(false);
        setOtp(Array(6).fill(''));
        setInputError('');
        setIsReOtpSent(false);
        setReSent(false);
        setTimer(60);
        setShowResendLink(false);
        onClose();
    }
    if (!showModal) return null;

    return (
        <div className="modal" tabIndex="-1" role="dialog">
            <div className="modal-overlay" role="document" >
                <div className="login-modal-content">
                    <div style={{ display: 'flex', flexDirection: 'column' }} >
                        <div style={{ display: 'flex', flexDirection: 'column' }} >
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                {
                                    isOtpSent && (
                                        <div className="back-button" onClick={() =>handelBack()}>
                                        <ArrowBackIcon fontSize="small" />
                                    </div>
                                    )
                                }
                               
                                <h5 className="modal-title" style={{ color: '#02441E' }}>Login  to JAS</h5>
                                <button type="button" className="close" onClick={onCloseHandler}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>


                            {
                                !isOtpSent && (
                                    <div className="modal-header">
                                        <button
                                            type="button"
                                            onClick={() => handleTypeSelection('phone')}
                                            className={`phone-email-button ${selectedInputType === 'phone' ? 'selected' : ''}`}
                                        >
                                            Phone Number
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleTypeSelection('email')}
                                            className={`phone-email-button ${selectedInputType === 'email' ? 'selected' : ''}`}
                                        >
                                            Email
                                        </button>
                                    </div>
                                )
                            }


                        </div>

                    </div>
                    <div className="modal-body" >

                        <form>
                            {!isOtpSent ? (
                                <div >
                                    {/* <h6>Login or Sign up to your account</h6> */}
                                    {
                                        selectedInputType === 'email' ? (
                                            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    value={input}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Email"
                                                    style={{
                                                        width: '100%', // Adjust width as necessary
                                                        outline: 'none',
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    left: '10px',
                                                    fontSize: '13px',
                                                    color: '#555',

                                                }}>
                                                    +91
                                                </span>
                                                <div style={{
                                                    position: 'absolute',
                                                    left: '35px', // Position to the right of "+91"
                                                    height: '20px',
                                                    width: '1px',
                                                    backgroundColor: '#ccc',
                                                    marginLeft: '5px'
                                                }} />
                                                <input
                                                    type="text"
                                                    value={input}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter phone number"
                                                    style={{
                                                        paddingLeft: '50px', // Add padding to create space for the prefix
                                                        width: '100%', // Adjust width as necessary
                                                        outline: 'none',
                                                    }}
                                                />
                                            </div>
                                        )
                                    }


                                    {inputError && <p style={{ color: 'red' }}>{inputError}</p>}
                                    <button
                                        type="button"
                                        className="otp-button"
                                        onClick={handleSendOtp}
                                        disabled={sendLoading || !isValidInput}
                                    >
                                        {sendLoading ? <LoaderButton fullPage={false} size={20} /> : 'Continue'}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="modal-line"></div>
                                    <h6 style={{ marginBottom: '5px', marginTop: '20px', textAlign: 'center' }}>
                                        We have sent a verification code to
                                    </h6>
                                    <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: 'bold', marginBottom: '20px', }}>
                                        {
                                            selectedInputType === 'phone' ? (
                                                <span>+91-{input}</span>
                                            ) : (
                                                <span>{input}</span>
                                            )
                                        }

                                    </div>

                                    <div onPaste={handlePaste}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: '10px', // Optional: add spacing above or below
                                        }}
                                    >
                                        {otp.map((value, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="6"
                                                name="otp"
                                                id="otp"
                                                value={value}
                                                inputmode="numeric"
                                                autocomplete="one-time-code"
                                                onChange={(e) => handleChange(e.target, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                ref={(el) => (otpInputRefs.current[index] = el)}
                                                // onFocus={(e) => index !== 0 && !otp[index - 1] && e.target.select()}
                                                onFocus={(e) => moveCursorToEnd(e.target)}
                                                onClick={(e) => handleClick(e, index)}
                                                // onFocus={(e) => handleFocus(e,index)}
                                                readOnly={Boolean(value) || (index !== 0 && !otp[index - 1])}
                                                style={{ width: '2rem', textAlign: 'center', margin: '0 0.30rem', outline: 'none' }}
                                            />
                                        ))}
                                    </div>
                                    {/* <p>{loading && 'Verifying OTP...'}</p> */}
                                    {/* <p style={{ color: 'green' }}>{message}</p>
                                    <p style={{ color: 'red' }}>{error}</p> */}
                                    {timer > 0 ? (
                                        <p style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: '20px'
                                        }}>OTP expires in: {timer}s</p>
                                    ) : (
                                        showResendLink && (
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                {
                                                    sendLoading || verifyLoading ? <LoaderButton fullPage={false} size={20} /> : (
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleResendOtp();
                                                            }}
                                                            style={{
                                                                color: 'green',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            Resend Code
                                                        </a>
                                                    )
                                                }

                                            </div>

                                        )
                                    )}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;