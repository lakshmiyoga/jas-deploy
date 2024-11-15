import React, { useEffect, Fragment, useState } from 'react';
import { Button, Container, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import Loader from '../Layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { Slide, toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import MetaData from '../Layouts/MetaData';
import LoaderButton from '../Layouts/LoaderButton';
import { clearDeleteMeasurement } from '../../slices/measurementSlice';
import { deleteMeasurement, getMeasurements } from '../../actions/measurementActions';

const MeasurementList = ({ isActive, setIsActive }) => {
    // const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    // const { products, loading, deleteloading, error } = useSelector(state => state.productsState);
    const {
        getmeasurement,
        deletemeasurementerror,
        deletemeasurement,
        getmeasurementloading,
        deletemeasurementloading
      } = useSelector(state => state.measurementState);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    // console.log("products", products)

    const setMeasurement = () => {
        const data = {
            columns: [
                {
                    label: 'S.No',
                    field: 's_no',
                    sort: 'disabled'
                },
                {
                    label: 'Measurement',
                    field: 'measurement',
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
        getmeasurement && getmeasurement.forEach((product, index) => {
            data.rows.push({
                s_no: index + 1,
                measurement: product.measurement,
                actions: (
                    <Fragment>
                        <Link to={`/admin/update-measurement/${product._id}`} state={{ product }} className="btn btn-primary py-1 px-2 ml-2">
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
        if (deletemeasurementerror) {
            // toast(error || productError, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => { dispatch(clearError()) }
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.error(deletemeasurementerror, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearDeleteMeasurement()) }
                });
            }, 300);
            return
        }
        if (deletemeasurement) {
            // toast('Product Deleted Successfully!', {
            //     type: 'success',
            //     position: "bottom-center",
            //     onOpen: () => dispatch(clearProductDeleted())
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.success('Measurement Deleted Successfully!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearDeleteMeasurement())
                });
                // setTimeout(() => {
                    dispatch(getMeasurements())
                // }, 700);
            }, 300);
            // dispatch(getAdminProducts())
            return;
        }
        // dispatch(getAdminProducts())
    }, [dispatch, deletemeasurementerror, deletemeasurement])

    useEffect(() => {
        if (!getmeasurement) {
            dispatch(getMeasurements())
        }
    }, [getmeasurement])

    const handleDeleteClick = (id) => {
        setProductToDelete(id);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteMeasurement({ id:productToDelete }));
        setShowModal(false);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    return (
        <div>
            {/* <MetaData title={Product List} /> */}
            <MetaData
                title="Measurement List"
                description="Manage your measurement inventory. Create, View, update, or remove measurement from your catalog to keep your store fresh and relevant."
            />


            <div className="row loader-parent">
                <div className="col-12 col-md-2">
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>
                <div className="col-12 col-md-10 smalldevice-space loader-parent">
                    <h1 className="mb-4 admin-dashboard-x">Measurement List</h1>
                    <Fragment>
                        {getmeasurementloading ? (<div className="container loader-loading-center">
                            <Loader />
                        </div>) :
                            (
                                <>
                                    <div style={{display:'flex',justifyContent:'space-between',marginTop:'30px',marginBottom:'3px'}}>
                                        <Link to="/admin/add-measurement">
                                            <Button variant="success" className="add-category-btn">
                                                <i className="fa fa-plus"></i> Add Measurement
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className='mdb-table ' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <MDBDataTable

                                            data={setMeasurement()}
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
                                    <button type="button" className="btn btn-danger" onClick={handleConfirmDelete} disabled={deletemeasurementloading}>
                                        {deletemeasurementloading ? <LoaderButton fullPage={false} size={20} /> : (
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

export default MeasurementList;