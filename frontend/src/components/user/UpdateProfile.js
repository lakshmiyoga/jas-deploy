import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, clearAuthError } from '../../actions/userActions';
import { Slide, toast } from 'react-toastify'
import { clearUpdateProfile } from '../../slices/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import LoaderButton from '../Layouts/LoaderButton';
import NumberInput from '../Layouts/NumberInput';

const UpdateProfile = () => {

    const { profileupdateloading, error, user, isUpdated } = useSelector(state => state.authState);
    const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    // const [mobile, setMobile] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarName, setAvatarName] = useState('');
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png");
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const location = useLocation();
    console.log("avatar",avatar);
    // sessionStorage.setItem('redirectPath', location.pathname);
    // console.log(error, user, isUpdated)

    // const onChangeAvatar = (e) => {

    //     const reader = new FileReader();
    //     reader.onload = () => {
    //         if (reader.readyState === 2) {
    //             setAvatarPreview(reader.result);
    //             setAvatar(e.target.files[0])
    //         }
    //     }


    //     reader.readAsDataURL(e.target.files[0])
    // }

    const onChangeAvatar = (e) => {
        const file = e.target.files[0];
        const fileSizeLimit = 1 * 1024 * 1024; // 1 MB

        if (file && file.size > fileSizeLimit) {
            // toast('The size of selected images exceeds the 1MB limit.', {
            //     type: 'error',
            //     position: "bottom-center"
            // });

            toast.dismiss();
            setTimeout(() => {
                toast.error('The size of selected images exceeds the 1MB limit.', {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
            e.target.value = ''; // Clear the file input
            setAvatarName('');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(file);
                setAvatarName(file.name);

            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setAvatar(null); // Reset avatar
        setAvatarPreview("/images/default_avatar.png"); // Reset avatar preview to default
        setAvatarName(''); // Clear the file name
    };


    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        // formData.append('email', email);
        // formData.append('mobile', mobile)
        formData.append('avatar', avatar);
        dispatch(updateProfile(formData))

    }

    useEffect(() => {
        if (user) {
            setName(user.name);
            // setEmail(user.email);
            // setMobile(user.mobile);
            if (user.avatar && user.avatar!=='default_avatar.png') {
                setAvatarPreview(user.avatar)
            }
        }

        if (isUpdated) {
            // toast('Profile updated successfully', {
            //     type: 'success',
            //     position: "bottom-center",
            //     onOpen: () => { dispatch(clearUpdateProfile()) }

            // })
            toast.dismiss();
            setTimeout(() => {
                toast.success('Profile updated successfully', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearUpdateProfile()) }
                });
                // Navigate after the toast has been shown
                setTimeout(() => {
                    navigate('/myProfile');
                }, 300); // This delay should match the toast duration
            }, 300);
            // navigate('/myProfile')
            return;
        }

        if (error) {
            // toast(error, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => { dispatch(clearUpdateProfile()) }
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
                    onOpen: () => { dispatch(clearUpdateProfile()) }
                });
            }, 300);
            return
        }
    }, [user, isUpdated, error, dispatch])



    return (
        <div>
            {/* <MetaData title={Update Profile} /> */}
            <MetaData
                title="Update Profile"
                description="Update your personal details, manage your account settings, and ensure your information is always up-to-date for a smooth shopping experience."
            />


            <div className="products_heading">Update Profile</div>

            <div className="row wrapper">

                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg mt-0" encType='multipart/form-data'>
                        <h3 className="mt-2 mb-5">Update Profile</h3>

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input
                                type="name"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={email}
                                // onChange={(e) => setEmail(e.target.value)}
                                readOnly
                            />
                        </div> */}

                        {/* <div className="form-group">
                            <label htmlFor="phone_field">Phone No (+91) <span style={{ color: 'red' }}>*</span></label>
                            <NumberInput
                                id="mobile_field"
                                name="mobile"
                                className="no-arrow-input form-control"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                        </div> */}

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar (*Size should be within 1mb)</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        {avatarPreview && avatarPreview !== '/images/default_avatar.png' && (
                                            <button
                                                type="button"
                                                style={{
                                                    position: 'absolute',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    outline: 'none',
                                                    color: 'red'
                                                }}
                                                onClick={removeAvatar}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        )}
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        onChange={onChangeAvatar}
                                        accept='.jpg, .jpeg, .png' // Accepts only jpg, jpeg, and png files
                                        multiple={false}           // Ensures only one file can be selected
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        {/* Choose Avatar */}
                                        {avatarName ? avatarName : 'Choose Avatar'}
                                    </label>

                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={profileupdateloading}>
                            {profileupdateloading ? <LoaderButton fullPage={false} size={20} /> : (
                                <span> Update </span>
                            )
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateProfile