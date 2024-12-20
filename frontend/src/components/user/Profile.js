import React, { Fragment } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MetaData from '../Layouts/MetaData';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Profile = () => {
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const navigate = useNavigate();
    const { user } = useSelector(state => state.authState);
    console.log("user", user)

    return (
        <Fragment>
            {/* <MetaData title={Profile} /> */}
            <MetaData
                title="Profile"
                description="View and edit your profile information, manage addresses, and update your account preferences for a personalized shopping experience."
            />


            <div className="products_heading">Profile</div>
            <div className="back-button" onClick={() => navigate(-1)}>
                <ArrowBackIcon fontSize="small" />
                <span>Back</span>
            </div>

            <div className="row justify-content-around mt-5 user-info">

                <div className="col-12 col-md-3 " style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <figure className='avatar avatar-profile'>
                        <img className="rounded-circle img-fluid" src={user && user.avatar ? user.avatar : '/images/default_avatar.png'} alt='avatar' />
                    </figure>
                    <Link to="/myProfile/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                        Edit Profile
                    </Link>
                </div>

                <div className="col-12  col-md-5" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                    <h5>Full Name: {user?.name ? user.name : "Not Provided"}</h5>

                    {user?.mobile ? (
                        <div>
                            <h5>Mobile Number: +91 {user.mobile}</h5>
                        </div>
                    ) : null}



                    {user?.email ? (
                        <div>
                            <h5>Email: {user.email}</h5>
                        </div>
                    ) : null}


                    <h5>Joined: {String(user && user.createdAt).substring(0, 10)}</h5>
                    {/* <p>{String(user.createdAt).substring(0,10)}</p> */}

                    <Link to="/orders" className="btn btn-danger btn-block mt-5" id="orders">
                        My Orders
                    </Link>

                    <Link to='/shipping' className="btn btn-primary btn-block mt-3 change_password">
                        Add address
                    </Link>
                </div>
            </div>
        </Fragment>
    )
}

export default Profile