import React, { useEffect, Fragment, useState } from 'react';
import { Button, Container, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { deleteProduct, getAdminProducts } from '../../actions/productsActions';
import Loader from '../Layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import { clearError } from '../../slices/productsSlice';
import { clearProductDeleted } from "../../slices/productSlice";
import MetaData from '../Layouts/MetaData';
import LoaderButton from '../Layouts/LoaderButton';

const ProductList = ({isActive,setIsActive}) => {
    // const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const { products , loading ,deleteloading, error } = useSelector(state => state.productsState);
    const { isProductDeleted, error: productError } = useSelector(state => state.productState);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    console.log("products",products)

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
                    label: 'Buying Price',
                    field: 'price',
                    sort: 'disabled'
                },
                {
                    label: 'Selling Price',
                    field: 'sellprice',
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

        products && products.forEach((product, index) => {
            data.rows.push({
                s_no: index + 1,
                name: `${product.englishName} / ${product.tamilName}`,
                price: product.category === "Keerai" ? `Rs.${product.buyingPrice} (per piece)` : `Rs.${product.buyingPrice} (per kg)`,
                sellprice: product.category === "Keerai" ? `Rs.${product.price} (per piece)` : `Rs.${product.price} (per kg)`,
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
            dispatch(getAdminProducts())
            return;
        }
        // dispatch(getAdminProducts())
    }, [dispatch, error, isProductDeleted, productError])

    useEffect(()=>{
        if(!products){
            dispatch(getAdminProducts())
        }
    },[products])

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
        <div>
            <MetaData title={`Product List`} />
      
        <div className="row">
            <div className="col-12 col-md-2">
                <div style={{display:'flex',flexDirection:'row',position:'fixed',top:'0px',zIndex:99999,backgroundColor:'#fff',minWidth:'100%'}}>
                <Sidebar isActive={isActive} setIsActive={setIsActive}/>
                </div> 
            </div>
            <div className="col-12 col-md-10 smalldevice-space">
                <h1 className="mb-4 admin-dashboard-x">Product List</h1>
                <div className='mdb-table ' style={{display:'flex',justifyContent:'center', alignItems:'center'}}>
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

export default ProductList;
