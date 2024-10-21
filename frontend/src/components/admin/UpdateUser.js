import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getUser, getUsers, updateUser } from "../../actions/userActions";
import { clearError, clearUserUpdated } from "../../slices/userSlice";
import { Slide,toast } from "react-toastify";
import MetaData from "../Layouts/MetaData";
import LoaderButton from "../Layouts/LoaderButton";
import Loader from "../Layouts/Loader";

export default function UpdateUser({ isActive, setIsActive }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);

    const { id: userId } = useParams();

    const { userloading, loading, isUserUpdated, error, user } = useSelector(state => state.userState)
    const { user: authUser } = useSelector(state => state.authState)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('role', role);
        dispatch(updateUser({ userId, formData }))
        // console.log(userId, formData)
    }

    useEffect(() => {
        if (isUserUpdated) {
            // toast('User Updated Succesfully!', {
            //     type: 'success',
            //     position: 'bottom-center',
            //     onOpen: () => dispatch(clearUserUpdated())
            // })
            toast.dismiss();
                setTimeout(() => {
                    toast.success('User Updated Succesfully!', {
                        position: 'bottom-center',
                        type: 'success',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                        onOpen: () => dispatch(clearUserUpdated())
                    });
                }, 300);
            dispatch(getUsers());
            navigate('/admin/users')
            return;
        }

        if (error) {
            // toast(error, {
            //     position: 'bottom-center',
            //     type: 'error',
            //     onOpen: () => { dispatch(clearError()) }
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
                    onOpen: () => { dispatch(clearError()) }
                });
            }, 300);
            return
        }

        dispatch(getUser(userId))
        // console.log(userId)
    }, [isUserUpdated, error, dispatch])


    useEffect(() => {
        if (user._id) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
    }, [user])


    return (
        <div>
            <MetaData 
  title="Update User" 
  description="Manage user profiles, update user information, and control user access to various sections of the platform." 
/>

        
        <div className="row loader-parent">
            {/* <MetaData title={`Update User`} /> */}
            <div className="col-12 col-md-2">
                <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                    <Sidebar isActive={isActive} setIsActive={setIsActive} />
                </div>
            </div>
            <div className="col-12 col-md-10 smalldevice-space loader-parent">
                {
                    userloading ? <div className="container loader-loading-center">
                        <Loader />
                    </div> : (
                        <Fragment>
                            <div className="wrapper my-5">
                                <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                                    <h1 className="mb-4 admin-dashboard-x">Update User</h1>

                                    <div className="form-group">
                                        <label htmlFor="name_field">Name</label>
                                        <input
                                            type="text"
                                            id="name_field"
                                            className="form-control"
                                            onChange={e => setName(e.target.value)}
                                            value={name}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="price_field">Email</label>
                                        <input
                                            type="text"
                                            id="price_field"
                                            className="form-control"
                                            onChange={e => setEmail(e.target.value)}
                                            value={email}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="category_field">Role</label>
                                        <select disabled={user._id === authUser._id} value={role} onChange={e => setRole(e.target.value)} className="form-control" id="category_field">
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                    <button
                                        id="login_button"
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-block py-3"
                                    >
                                        {loading ? <LoaderButton fullPage={false} size={20} /> : (
                                            <span>  UPDATE</span>
                                        )

                                        }
                                    </button>

                                </form>
                            </div>
                        </Fragment>
                    )
                }

            </div>
        </div>
        </div>
    )
}