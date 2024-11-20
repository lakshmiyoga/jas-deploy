import React, { Fragment } from 'react'
import Sidebar from '../admin/Sidebar'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import { Slide, toast } from 'react-toastify';
import MetaData from '../Layouts/MetaData';
import LoaderButton from '../Layouts/LoaderButton';
import { clearPostMeasurement } from '../../slices/measurementSlice';
import { createMeasurement, getMeasurements } from '../../actions/measurementActions';


const NewMeasurement = ({ isActive, setIsActive }) => {
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const [measurement, setMeasurement] = useState("");
   

    const {postmeasurement,
        postmeasurementerror,
        postmeasurementloading
    } = useSelector(state => state.measurementState);

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const submitHandler = (e) => {
        e.preventDefault();
        console.log("Measurement:", measurement);

        dispatch(createMeasurement({ measurement }));
        
       
    }


    useEffect(() => {
        if (postmeasurement) {
            // toast('Product Created Succesfully!', {
            //     type: 'success',
            //     position: "bottom-center",
            //     onOpen: () => dispatch(clearProductCreated())
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.success('Measurement Created Succesfully!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearPostMeasurement())
                });
            }, 300);
            dispatch(getMeasurements())
            navigate('/admin/measurement')
            return;
        }

        if (postmeasurementerror) {
            // toast(error, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => { dispatch(clearError()) }
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.error(postmeasurementerror, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearPostMeasurement()) }
                });
            }, 300);
            return
        }
    }, [postmeasurement, postmeasurementerror, dispatch, navigate])


    return (
        <div>
            {/* <MetaData title={`New Product`} /> */}
            <MetaData
                title="Add New Measurement"
                description="Create new Measurement for your store. Define category details, upload images, keep your catalog up to date."
            />


            <div className="row">
                <div className="col-12 col-md-2">
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>
                <div className="col-12 col-md-10 smalldevice-space">
                    <Fragment>
                        <div className="wrapper mt-5">
                            <form onSubmit={submitHandler} className="shadow-lg">
                                <h3 className="mb-4">New Measurement</h3>

                                <div className="form-group">
                                    <label htmlFor="measurement"> Measurement  <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        id="measurement"
                                        className="form-control"
                                        onChange={e => setMeasurement(e.target.value)}
                                        value={measurement}
                                        required
                                    />
                                </div>
                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={postmeasurementloading}
                                >
                                    {postmeasurementloading ? <LoaderButton fullPage={false} size={20} /> : (
                                        <span>  CREATE</span>
                                    )

                                    }

                                </button>

                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </div>

    )
}

export default NewMeasurement
