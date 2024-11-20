import React, { Fragment } from 'react';
import Sidebar from '../admin/Sidebar';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAdminProducts, updateProduct } from '../../actions/productsActions';
import { clearProductUpdated, clearError, clearproduct } from '../../slices/productSlice';
import { Slide, toast } from 'react-toastify';
import { getProduct } from '../../actions/productAction';
import MetaData from '../Layouts/MetaData';
import LoaderButton from '../Layouts/LoaderButton';
import Loader from '../Layouts/Loader';
import { getCategories, getSingleCategory, updateCategory } from '../../actions/categoryAction';
import { clearupdateCategory } from '../../slices/categorySlice';
import { getMeasurements, getSingleMeasurement, updateMeasurement } from '../../actions/measurementActions';
import { clearupdateMeasurement } from '../../slices/measurementSlice';


const UpdateMeasurement = ({ isActive, setIsActive }) => {

    const [formData, setFormData] = useState({
        measurement: "",
    });

    const { id } = useParams();
  
    const {
        singlemeasurement,
        isMeasurementUpdated,
        updatemeasurementerror,
        singlemeasurementLoading,
        updatemeasurementloading,
         } = useSelector(state => state.measurementState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const {product = null} = location.state || {};

    // console.log(isProductUpdated,error,product)
    console.log("product",product)
   
    useEffect(() => {
        if (!product) {
            dispatch(getSingleMeasurement(id))
            dispatch(getMeasurements());
            
        }
    }, [dispatch, id]);

    console.log("singlemeasurement",singlemeasurement)

    useEffect(() => {
        if (product && product._id) {
          setFormData((prevData) => ({
            ...prevData,
            measurement: product.measurement,
          }));
        } else if (!product && singlemeasurement && singlemeasurement.measurement && singlemeasurement.measurement._id) {
          setFormData((prevData) => ({
            ...prevData,
            measurement: singlemeasurement.measurement.measurement,
          }));
        }
      }, [product, singlemeasurement]);
      

    //  console.log("formdata",formData)


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateMeasurement({ id,formData }));
        console.log('measurement',id,formData);
    };

    

    // useEffect(() => {
    //     dispatch(clearupdateMeasurement())
    // }, [])

    useEffect(() => {
        if (product && product._id !== id) {
            dispatch(getSingleMeasurement(id));
        }
    }, [dispatch, id, product]);

    


    useEffect(() => {
        if (isMeasurementUpdated) {

            toast.dismiss();
            setTimeout(() => {
                toast.success('Measurement updated successfully!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearupdateMeasurement())
                });
            }, 300);
            dispatch(getMeasurements())
            navigate('/admin/measurement');
        }

        if (updatemeasurementerror) {

            toast.dismiss();
            setTimeout(() => {
                toast.error(updatemeasurementerror, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearupdateMeasurement())
                });
            }, 300);
        }
    }, [dispatch, isMeasurementUpdated, updatemeasurementerror, navigate]);

    return (
        <div>
            <MetaData
                title="Update Product"
                description="Edit product details, update stock levels, or change product images to keep your catalog accurate and up to date."
            />


            <div className="row loader-parent">
                {/* <MetaData title={`Update Product`} /> */}
                <div className="col-12 col-md-2">
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>
                <div className="col-12 col-md-10 smalldevice-space loader-parent">
                    {
                        singlemeasurementLoading ? (
                            <div className="container loader-loading-center">
                                <Loader />
                            </div>

                        ) : (
                            <Fragment>
                                <div className="wrapper mt-0">
                                    <form onSubmit={handleSubmit} className="shadow-lg" >
                                        <h3 className="mb-4 admin-dashboard-x">Update Measurement</h3>

                                        <div className="form-group">
                                            <label htmlFor="measurement">Measurement <span style={{ color: 'red' }}>*</span></label>
                                            <input
                                                type="text"
                                                id="measurement"
                                                name="measurement"
                                                className="form-control"
                                                value={formData.measurement}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-block py-3"
                                            disabled={updatemeasurementloading}
                                        >
                                            {updatemeasurementloading ? <LoaderButton fullPage={false} size={20} /> : (
                                                <span>  UPDATE</span>
                                            )

                                            }

                                        </button>
                                    </form>
                                </div>
                            </Fragment>
                        )
                    }

                </div>
            </div>
        </div>
    );
}

export default UpdateMeasurement;






