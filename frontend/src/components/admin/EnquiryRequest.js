import React, { useEffect, Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MDBDataTable } from 'mdbreact';
import { Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import Loader from '../Layouts/Loader';
import { getEnquiryDetails, deleteEnquiryDetails } from '../../actions/enquiryActions';
import { createNewProduct } from '../../actions/productsActions';
import { clearProductDeleted, clearError} from '../../slices/productSlice';
import { Link, useLocation } from "react-router-dom";
import { deleteProduct, getAdminProducts } from '../../actions/productsActions';
import { clearEnquiryDeleted } from '../../slices/enquirySlice';
import MetaData from '../Layouts/MetaData';

const EnquiryRequest = ({isActive,setIsActive}) => {
  const location = useLocation();
  sessionStorage.setItem('redirectPath', location.pathname);
    // const { products = [], loading = true, error } = useSelector(state => state.productsState);
    // const { isProductDeleted, error: productError } = useSelector(state => state.productState);
    const { isEnquiryDeleted, error,loading = true, enquiry } = useSelector(state => state.enquiryState);
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);
    const [enquiryToDelete, setEnquiryToDelete] = useState(null);

  // console.log(enquiry)
    const setEnquiryDetails = () => {
        // const data = {
        //     columns: [
        //         {
        //             label: 'S.NO',
        //             field: 's_no',
        //             sort: 'asc'
        //         },
        //         {
        //             label: 'Name',
        //             field: 'name',
        //             sort: 'asc'
        //         },
        //         {
        //             label: 'Email',
        //             field: 'email',
        //             sort: 'asc'
        //         },
        //         {
        //             label: 'Mobile',
        //             field: 'mobile',
        //             sort: 'asc'
        //         },
                
        //         {
        //             label: 'Message',
        //             field: 'messageData',
        //             sort: 'asc'
        //         },
        //         {
        //             label: 'Date',
        //             field: 'date',
        //             sort: 'asc'
        //         },
        //         {
        //             label: 'Actions',
        //             field: 'actions',
        //             sort: 'asc'
        //         }
        //     ],
        //     rows: []
        // }

        const data = {
            columns: [
              {
                label: 'S.NO',
                field: 's_no',
                // sort: 'asc',
                attributes: {
                  'className': 'sno-column'
                }
              },
              {
                label: 'Name',
                field: 'name',
                // sort: 'asc',
                attributes: {
                  'className': 'name-column'
                }
              },
              {
                label: 'Email',
                field: 'email',
                // sort: 'asc',
                attributes: {
                  'className': 'email-column'
                }
              },
              {
                label: 'Mobile',
                field: 'mobile',
                // sort: 'asc',
                attributes: {
                  'className': 'mobile-column'
                }
              },
              {
                label: 'Message',
                field: 'messageData',
                // sort: 'asc',
                attributes: {
                  'className': 'message-column'
                }
              },
              {
                label: 'Date',
                field: 'date',
                // sort: 'asc',
                attributes: {
                  'className': 'date-column'
                }
              },
              {
                label: 'Actions',
                field: 'actions',
                // sort: 'asc',
                attributes: {
                  'className': 'actions-column'
                }
              }
            ],
            rows: []
          };
          
        

        // Sort orders by creation date (newest first)
        const sortedEnquiry = enquiry && [...enquiry].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        sortedEnquiry && sortedEnquiry.forEach((user,index) => {
            data.rows.push({
                s_no: index+1,
                name: user.name,
                email:user.email,
                mobile:user.mobile,
                messageData: (
                    <div style={{ position:'relative',maxWidth: 'auto', wordBreak: 'break-word'}}>
                      {user.messageData || 'N/A'}
                    </div>
                  ),
                date: new Date(user.createdAt).toLocaleString(), 
                actions: (
                    <Fragment>
                        {/* <Link to={`/admin/product/${product._id}`} className="btn btn-primary"> <i className="fa fa-pencil"></i></Link> */}
                        <Button onClick={() => handleDeleteClick(user._id)} className="btn btn-danger py-1 px-2 ml-2">
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
        // dispatch(getEnquiryDetails())
    }, [dispatch, error, isEnquiryDeleted])

    useEffect(()=>{
      if(!enquiry){
        dispatch(getEnquiryDetails())
      }
      
    },[enquiry])

    // const deleteHandler = (e, id) => {
    //     e.target.disabled = true;
    //     dispatch(deleteEnquiryDetails({ id }))
    // }

    const handleDeleteClick = (id) => {
        setEnquiryToDelete(id);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteEnquiryDetails({ id: enquiryToDelete }));
        setShowModal(false);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };


    return (
      <div>
         <MetaData title={`Enquiry Request`} />
     
        <div className="row loader-parent">
            <div className="col-12 col-md-2">
            <div style={{display:'flex',flexDirection:'row',position:'fixed',top:'0px',zIndex:99999,backgroundColor:'#fff',minWidth:'100%'}}>
                <Sidebar isActive={isActive} setIsActive={setIsActive}/>
                </div>
            </div>
            <div className="col-12 col-md-10 smalldevice-space loader-parent">
                <h1 className="mb-4 admin-dashboard-x">Enquiry List</h1>

                <Fragment>
                    {loading ? (<div className="container loader-loading-center">
                            <Loader />
                        </div>):
                        // <div className="product-table-wrapper">
                                          <div className='mdb-table' style={{display:'flex',justifyContent:'center', alignItems:'center'}}>
                        <MDBDataTable
                            data={setEnquiryDetails()}
                            bordered
                            noBottomColumns
                            hover
                            className="px-3 product-table "
                        />
                    </div>
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
        </div>
    )
}

export default EnquiryRequest;
