import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MDBDataTable } from 'mdbreact';
import { Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import Loader from '../Layouts/Loader';
import { getEnquiryDetails, deleteEnquiryDetails } from '../../actions/enquiryActions';
import { createNewProduct } from '../../actions/productsActions';
import { clearProductDeleted, clearError} from '../../slices/productSlice';
import { Link } from "react-router-dom";
import { deleteProduct, getAdminProducts } from '../../actions/productsActions';
import { clearEnquiryDeleted } from '../../slices/enquirySlice';

const EnquiryRequest = () => {
    // const { products = [], loading = true, error } = useSelector(state => state.productsState);
    // const { isProductDeleted, error: productError } = useSelector(state => state.productState);
    const { isEnquiryDeleted, error,loading = true, enquiry=[] } = useSelector(state => state.enquiryState);
    const dispatch = useDispatch();
  console.log(enquiry)
    const setEnquiryDetails = () => {
        const data = {
            columns: [
                {
                    label: 'S.NO',
                    field: 's_no',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Mobile',
                    field: 'mobile',
                    sort: 'asc'
                },
                
                {
                    label: 'Message',
                    field: 'message',
                    sort: 'asc'
                },
                {
                    label: 'Date',
                    field: 'date',
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

        enquiry.forEach((user,index) => {
            data.rows.push({
                s_no: index+1,
                name: user.name,
                email:user.email,
                mobile:user.mobile,
                // message:product.message,
                date: new Date(user.createdAt).toLocaleString(), 
                actions: (
                    <Fragment>
                        {/* <Link to={`/admin/product/${product._id}`} className="btn btn-primary"> <i className="fa fa-pencil"></i></Link> */}
                        <Button onClick={e => deleteHandler(e, user._id)} className="btn btn-danger py-1 px-2 ml-2">
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            })
        })
        

        return data;
    }

    useEffect(() => {
        if (error ) {
            toast(Error, {
                position: "bottom-center",
                type: 'error',
                // onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        if (isEnquiryDeleted) {
            toast('Enquiry Deleted Succesfully!', {
                type: 'success',
                position: "bottom-center",
                onOpen: () => dispatch(clearEnquiryDeleted())
            })
            return;
        }
        dispatch(getEnquiryDetails())
    }, [dispatch, error, isEnquiryDeleted])

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteEnquiryDetails({ id }))
    }

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10 col-sm-6">
                <h1 className="my-4">Enquiry List</h1>
                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setEnquiryDetails()}
                            bordered
                            hover
                            className=" px-3 product-table"
                        />
                    }
                </Fragment>
            </div>
        </div>
    )
}

export default EnquiryRequest;
