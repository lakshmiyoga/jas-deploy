import React, { useEffect, Fragment } from 'react';
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
                name: product.englishName,
                price: `Rs.${product.price} (per kg)`,
                actions: (
                    <Fragment>
                        <Link to={`/admin/product/${product._id}`} className="btn btn-primary">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <Button onClick={e => deleteHandler(e, product._id)} className="btn btn-danger py-1 px-2 ml-2">
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

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteProduct({ id }))
    }

    return (
        // <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
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
            </div>
        // </div>
    )
}

export default ProductList;
