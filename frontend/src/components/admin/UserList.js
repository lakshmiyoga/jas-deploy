import { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { deleteUser, getUsers } from "../../actions/userActions";
import { clearError, clearUserDeleted } from "../../slices/userSlice";
import Loader from '../Layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "./Sidebar";
import MetaData from "../Layouts/MetaData";

export default function UserList({isActive,setIsActive}) {
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const { users , loading = true, error, isUserDeleted } = useSelector(state => state.userState);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    

    const setUsers = () => {
        const data = {
            columns: [
                {
                    label: 'S.No',
                    field: 's_no',
                    sort: 'disabled'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'disabled'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'disabled'
                },
                {
                    label: 'Role',
                    field: 'role',
                    sort: 'disabled'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'disabled'
                }
            ],
            rows: []
        };

        // Sort users by creation date (newest first)
        const sortedUsers = users && [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        sortedUsers && sortedUsers.forEach((user, index) => {
            data.rows.push({
                s_no: index + 1,
                name: user.name,
                email: user.email,
                role: user.role,
                actions: (
                    <Fragment>
                        <Link to={`/admin/user/${user._id}`} className="btn btn-primary py-1 px-2 ml-2">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <Button onClick={() => handleDeleteClick(user._id)} className="btn btn-danger py-1 px-2 ml-2">
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            });
        });

        return data;
    };

    const handleDeleteClick = (id) => {
        setUserToDelete(id);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteUser({ id: userToDelete }));
        setShowModal(false);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    useEffect(() => {
        if (error) {
            toast(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            });
            return;
        }
        if (isUserDeleted) {
            toast('User Deleted Successfully!', {
                type: 'success',
                position: "bottom-center",
                onOpen: () => dispatch(clearUserDeleted())
            });
            dispatch(getUsers());
            return;
        }

        // dispatch(getUsers());
    }, [dispatch, error, isUserDeleted]);

    useEffect(()=>{
        if(!users){
            dispatch(getUsers());
        }
       
    },[])

    return (
        <div className="row">
            <MetaData title={`User List`} />
            <div className="col-12 col-md-2">
            <div style={{display:'flex',flexDirection:'row',position:'fixed',top:'0px',zIndex:99999,backgroundColor:'#fff',minWidth:'100%'}}>
                <Sidebar isActive={isActive} setIsActive={setIsActive}/>
                </div>
            </div>
            <div className="col-12 col-md-10 smalldevice-space">
                <h1 className="mb-4 admin-dashboard-x">User List</h1>
                <div className='mdb-table' style={{display:'flex',justifyContent:'center', alignItems:'center'}}>
                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setUsers()}
                            bordered
                            noBottomColumns
                            hover
                            className="px-3 product-table"
                        />
                    }
                </Fragment>
                </div>
            </div>

            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="close" onClick={handleCancelDelete}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this user?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>OK</button>
                                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
