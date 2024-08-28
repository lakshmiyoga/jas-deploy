import React, { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MetaData from '../Layouts/MetaData';

const Profile = () => {
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);

    const { user } = useSelector(state => state.authState);
    console.log("user", user)

    return (
        <Fragment>
            <MetaData title={`Profile`} />
          
            <div className="products_heading">Profile</div>

            <div className="row justify-content-around mt-5 user-info">

                <div className="col-12 col-md-3">
                    <figure className='avatar avatar-profile'>
                        <img className="rounded-circle img-fluid" src={user && user.avatar ? user.avatar : '/images/default_avatar.png'} alt='avatar' />
                    </figure>
                    <Link to="/myProfile/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                        Edit Profile
                    </Link>
                </div>

                <div className="col-12  col-md-5">
                    <h4>Full Name: {user && user.name}</h4>
                    {/* <p>{user.name}</p> */}

                    <h4>Email Address: {user && user.email}</h4>
                    {/* <p>{user.email}</p> */}

                    <h4>Joined: {String(user && user.createdAt).substring(0, 10)}</h4>
                    {/* <p>{String(user.createdAt).substring(0,10)}</p> */}

                    <Link to="/orders" className="btn btn-danger btn-block mt-5" id="orders">
                        My Orders
                    </Link>

                    <Link to='/myProfile/update/password' className="btn btn-primary btn-block mt-3 change_password">
                        Change Password
                    </Link>
                </div>
            </div>
        </Fragment>
    )
}

export default Profile
