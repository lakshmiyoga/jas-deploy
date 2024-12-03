import React, { useEffect, Fragment, useState } from 'react';
import { Button, Container, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { deleteProduct, getAdminProducts } from '../../actions/productsActions';
import Loader from '../Layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { Slide, toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import { clearError } from '../../slices/productsSlice';
import { clearProductDeleted } from "../../slices/productSlice";
import MetaData from '../Layouts/MetaData';
import LoaderButton from '../Layouts/LoaderButton';
import { deleteCategory, getCategories } from '../../actions/categoryAction';
import { clearDeleteCategory } from '../../slices/categorySlice';
import { clearDeleteAnnouncement } from '../../slices/announcementSlice';
import { deleteAnnouncements, getAnnouncements } from '../../actions/announcementAction';

const AnnouncementList = ({ isActive, setIsActive }) => {
    // const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    // const { products, loading, deleteloading, error } = useSelector(state => state.productsState);
    const {
        getAnnouncement,
        deleteAnnouncementError,
        deleteAnnouncement,
        deleteAnnouncementLoading,
        getAnnouncementLoading
    } = useSelector(state => state.announcementState);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const navigate = useNavigate();
    console.log("getAnnouncement", getAnnouncement)

    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: 'S.No',
                    field: 's_no',
                    sort: 'disabled',
                    attributes: {
                        'className': 'sno-column'
                      }
                },
                {
                    label: 'Start Date',
                    field: 'startDate',
                    sort: 'disabled',
                    attributes: {
                        'className': 'date-column'
                      }
                },
                {
                    label: 'End date',
                    field: 'endDate',
                    sort: 'disabled',
                    attributes: {
                        'className': 'date-column'
                      }
                },
                {
                    label: 'Image',
                    field: 'image',
                    sort: 'disabled',
                    attributes: {
                        'className': 'date-column'
                      }

                },
                {
                    label: 'Content',
                    field: 'content',
                    sort: 'disabled',
                    attributes: {
                        'className': 'message-column'
                      }

                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'disabled',
                    attributes: {
                        'className': 'actions-column'
                      }
                }
            ],
            rows: []
        }
        getAnnouncement && getAnnouncement.forEach((product, index) => {
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if day < 10
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so add 1
                const year = date.getFullYear();
            
                return `${day}/${month}/${year}`;
            };
            
            const formattedStartDate = formatDate(product.startDate);
            const formattedEndDate = formatDate(product.endDate);

            data.rows.push({
                s_no: index + 1,
                // name: ${product.englishName} / ${product.tamilName},
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                image: (
                    <img
                        src={product.images[0].image}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                ),
                // content: product.content,
                content: (
                    <div style={{ position:'relative',maxWidth: 'auto', wordBreak: 'break-word'}}>
                     {product.content}
                    </div>
                  ),
                actions: (
                    <Fragment>
                        <Link to={`/admin/update-announcement/${product._id}`} state={{ product }} className="btn btn-primary py-1 px-2 ml-2">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <Button onClick={() => handleDeleteClick(product._id)} className="btn btn-danger py-1 px-2 ml-2">
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            })
        })

        return data;
    }

    useEffect(() => {
        if (deleteAnnouncementError) {
            // toast(error || productError, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => { dispatch(clearError()) }
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.error(deleteAnnouncementError, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearDeleteAnnouncement()) }
                });
            }, 300);
            return
        }
        if (deleteAnnouncement) {
            // toast('Product Deleted Successfully!', {
            //     type: 'success',
            //     position: "bottom-center",
            //     onOpen: () => dispatch(clearProductDeleted())
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.success('Announcement Deleted Successfully!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => {
                        dispatch(clearDeleteAnnouncement());
                        dispatch(getAnnouncements())
                    }
                });
                // setTimeout(() => {
                // dispatch(getAnnouncements())
                // }, 700);
            }, 300);
            // dispatch(getAdminProducts())
            return;
        }
        // dispatch(getAdminProducts())
    }, [dispatch, deleteAnnouncementError, deleteAnnouncement])

    useEffect(() => {
        if (!getAnnouncement) {
            dispatch(getAnnouncements())
        }
    }, [getAnnouncement])

    const handleDeleteClick = (id) => {
        setProductToDelete(id);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteAnnouncements({ id: productToDelete }));
        setShowModal(false);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    return (
        <div>
            {/* <MetaData title={Product List} /> */}
            <MetaData
                title="Category List"
                description="Manage your category inventory. Create, View, update, or remove Category from your catalog to keep your store fresh and relevant."
            />


            <div className="row loader-parent">
                <div className="col-12 col-md-2">
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>
                <div className="col-12 col-md-10 smalldevice-space loader-parent">
                    <h1 className="mb-4 admin-dashboard-x">Announcement List</h1>
                    <Fragment>
                        {getAnnouncementLoading ? (<div className="container loader-loading-center">
                            <Loader />
                        </div>) :
                            (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', marginBottom: '3px' }}>
                                        {/* <Link to="/admin/add-announcement"> */}
                                        <Button variant="success" className="add-category-btn" onClick={() => navigate("/admin/add-announcement")}>
                                            <i className="fa fa-plus"></i> Add Announcement
                                        </Button>
                                        {/* </Link> */}
                                    </div>
                                    <div className='mdb-table ' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <MDBDataTable

                                            data={setProducts()}
                                            bordered
                                            noBottomColumns
                                            hover
                                            className="px-3 product-table"
                                        />
                                    </div>
                                </>
                            )

                        }
                    </Fragment>

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
                                    <p>Are you sure you want to delete this announcement?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={handleConfirmDelete} disabled={deleteAnnouncementLoading}>
                                        {deleteAnnouncementLoading ? <LoaderButton fullPage={false} size={20} /> : (
                                            <span>  OK</span>
                                        )

                                        }

                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AnnouncementList;