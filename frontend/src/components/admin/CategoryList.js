import React, { useEffect, Fragment, useState } from 'react';
import { Button, Container, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
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

const CategoryList = ({ isActive, setIsActive }) => {
    // const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    // const { products, loading, deleteloading, error } = useSelector(state => state.productsState);
    const {
        postloading,
        postcategory,
        posterror,
        getloading,
        getcategory,
        geterror,
        deleteloading,
        deletecategory,
        deleteerror,
        updateloading,
        updatecategory,
        updateerror,
        singleCategory,
        singleLoading,
        singleError, } = useSelector(state => state.categoryState);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    // console.log("products", products)

    const setProducts = () => {
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
                    label: 'Image',
                    field: 'image',
                    sort: 'disabled'
                },
                {
                    label: 'Category',
                    field: 'category',
                    sort: 'disabled'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'disabled'
                }
            ],
            rows: []
        }
        getcategory && getcategory.forEach((product, index) => {
            data.rows.push({
                s_no: index + 1,
                // name: ${product.englishName} / ${product.tamilName},
                name: product.name,
                image: (
                    <img
                        src={product.images[0].image}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                ),
                category: product.category,
                actions: (
                    <Fragment>
                        <Link to={`/admin/update-category/${product._id}`} state={{ product }} className="btn btn-primary py-1 px-2 ml-2">
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
        if (deleteerror) {
            // toast(error || productError, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => { dispatch(clearError()) }
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.error(deleteerror, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearDeleteCategory()) }
                });
            }, 300);
            return
        }
        if (deletecategory) {
            // toast('Product Deleted Successfully!', {
            //     type: 'success',
            //     position: "bottom-center",
            //     onOpen: () => dispatch(clearProductDeleted())
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.success('Category Deleted Successfully!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearDeleteCategory())
                });
                // setTimeout(() => {
                    dispatch(getCategories())
                // }, 700);
            }, 300);
            // dispatch(getAdminProducts())
            return;
        }
        // dispatch(getAdminProducts())
    }, [dispatch, deleteerror, deletecategory])

    useEffect(() => {
        if (!getcategory) {
            dispatch(getCategories())
        }
    }, [getcategory])

    const handleDeleteClick = (id) => {
        setProductToDelete(id);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteCategory({ id:productToDelete }));
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
                    <h1 className="mb-4 admin-dashboard-x">Category List</h1>
                    <Fragment>
                        {getloading ? (<div className="container loader-loading-center">
                            <Loader />
                        </div>) :
                            (
                                <>
                                    <div style={{display:'flex',justifyContent:'space-between',marginTop:'30px',marginBottom:'3px'}}>
                                        <Link to="/admin/add-category">
                                            <Button variant="success" className="add-category-btn">
                                                <i className="fa fa-plus"></i> Add Category
                                            </Button>
                                        </Link>
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
                                    <p>Are you sure you want to delete this product?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={handleConfirmDelete} disabled={deleteloading}>
                                        {deleteloading ? <LoaderButton fullPage={false} size={20} /> : (
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

export default CategoryList;