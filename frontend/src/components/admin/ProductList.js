import React, { useEffect, Fragment, useState } from 'react';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { deleteProduct, getAdminProducts } from '../../actions/productsActions';
import Loader from '../Layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import { clearError } from '../../slices/productsSlice';
import { clearProductDeleted } from "../../slices/productSlice";

const ProductList = () => {
    const { products = [], loading = true, error } = useSelector(state => state.productsState);
    const { isProductDeleted, error: productError } = useSelector(state => state.productState);
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: 'S.No',
                    field: 's_no',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ],
            rows: []
        }

        products.forEach((product, index) => {
            data.rows.push({
                s_no: index + 1,
                name: `${product.englishName} / ${product.tamilName}`,
                price: `Rs.${product.price} (per kg)`,
                actions: (
                    <Fragment>
                        <Link to={`/admin/product/${product._id}`} className="btn btn-primary py-1 px-2 ml-2">
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
        if (error || productError) {
            toast(error || productError, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        if (isProductDeleted) {
            toast('Product Deleted Successfully!', {
                type: 'success',
                position: "bottom-center",
                onOpen: () => dispatch(clearProductDeleted())
            })
            return;
        }
        dispatch(getAdminProducts())
    }, [dispatch, error, isProductDeleted, productError])

    const handleDeleteClick = (id) => {
        setProductToDelete(id);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteProduct({ id: productToDelete }));
        setShowModal(false);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-8 container">
                <h1 className="my-4">Product List</h1>
                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setProducts()}
                            bordered
                            noBottomColumns
                            hover
                            className="px-3 product-table"
                        />
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
                                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>OK</button>
                                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductList;
