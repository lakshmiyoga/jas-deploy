import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MetaData from '../Layouts/MetaData';
import { Link, useNavigate } from 'react-router-dom';
import { deleteAddress, getUserAddresses, setDefaultAddress } from '../../actions/addressAction';
import { clearDefaultAddress, clearDeleteAddress } from '../../slices/AddressSlice';
import { Slide, toast } from 'react-toastify';
import Loader from '../Layouts/Loader';
import LoaderButton from '../Layouts/LoaderButton';

const Address = () => {
    const { user, loading } = useSelector(state => state.authState);
    const { deleteSuccess, deleteloading, deleteerror, getdata, defaultloading, defaultSuccess, defaulterror } = useSelector(state => state.addressState);
    const [confirmDelete, setConfirmDelete] = useState(null); // track which address to delete
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!getdata) {
            dispatch(getUserAddresses({ userId: user && user._id }));
        }
    }, [])

    useEffect(() => {
        if (deleteSuccess) {
            toast.dismiss();
            setTimeout(() => {
                toast.success(deleteSuccess.message, {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => {
                        dispatch(clearDeleteAddress());
                        dispatch(getUserAddresses({ userId: user && user._id }));
                        setConfirmDelete(null);
                    },
                });
            }, 10);
        }
        if (deleteerror) {
            toast.dismiss();
            setTimeout(() => {
                toast.error(deleteerror, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearDeleteAddress()); },
                });
            }, 10);
        }
        if (defaultSuccess) {
            toast.dismiss();
            setTimeout(() => {
                toast.success(defaultSuccess.message, {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => {
                        dispatch(clearDefaultAddress());
                        dispatch(getUserAddresses({ userId: user && user._id }));
                    },
                });
            }, 10);
        }
        if (defaulterror) {
            toast.dismiss();
            setTimeout(() => {
                toast.error(defaulterror, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearDefaultAddress()); },
                });
            }, 10);
        }
    }, [deleteSuccess, deleteerror, dispatch, user, defaultSuccess, defaulterror]);

    const handleEdit = (address) => {
        // Logic to handle editing an address
    };

    const handleDelete = (addressId) => {
        setConfirmDelete(addressId); // set the specific addressId for deletion confirmation
    };

    const handleConfirmDelete = () => {
        if (confirmDelete) {
            dispatch(deleteAddress({ userId: user._id, addressId: confirmDelete }));
        }
    };

    const handleCancelDelete = () => {
        setConfirmDelete(null);
    };

    const handleSetDefault = (addressId) => {
        dispatch(setDefaultAddress({ userId: user._id, addressId: addressId }));
    };

    return (
        <Fragment>
            <MetaData title="Address" />
            <div className="back-button" onClick={() => navigate('/cart')}>
                <ArrowBackIcon fontSize="small" />
                <span>Back</span>
            </div>
            <div className="products_heading">Addresses</div>
            <div className="address-container">
                <div className="address-wrapper">
                    {loading ? (
                        <Loader />
                    ) : (
                        getdata?.addresses?.map((address) => (
                            <div className="address-card" key={address._id}>

                                <div className="address-info">
                                    <div>{address.name}</div>
                                    <div>+91 {address.phoneNo}</div>
                                    <div className='address-formatted'>{address.formattedAddress}</div>
                                    {address.defaultAddress && (
                                        <span className="default-badge">
                                            <CheckCircleIcon fontSize="small" />
                                            Default Address
                                        </span>
                                    )}
                                </div>

                                <div className="address-actions">
                                    {/* <EditIcon
                                        className="action-icon edit-icon"
                                        onClick={() => handleEdit(address)}
                                    /> */}
                                    <Link to={`/address/update/${address._id}`} state={{ shippingdata: address }} className="address-actions" style={{ color: '#333' }}>
                                        <EditIcon
                                            className="action-icon edit-icon"
                                        // onClick={() => handleEdit(address)}
                                        />
                                    </Link>
                                    <DeleteIcon
                                        className="action-icon delete-icon"
                                        onClick={() => handleDelete(address._id)}
                                    />
                                    {!address.defaultAddress && (
                                        <button
                                            className="set-default"
                                            onClick={() => handleSetDefault(address._id)}
                                            disabled={defaultloading}
                                        >
                                            {defaultloading ? <LoaderButton fullPage={false} size={20} /> : (
                                                <span>  Set as Default</span>
                                            )

                                            }
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    <button className="add-address" onClick={() => { navigate('/shipping'); }}>
                        + Address
                    </button>
                </div>
            </div>

            {confirmDelete && (
                <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="close" onClick={handleCancelDelete}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this address?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete} disabled={deleteloading}>
                                    {deleteloading ? <LoaderButton fullPage={false} size={20} /> : (
                                        <span> Delete</span>
                                    )

                                    }

                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

const modalStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000
};

export default Address;
