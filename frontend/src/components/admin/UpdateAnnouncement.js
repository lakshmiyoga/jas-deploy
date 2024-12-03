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
import { getAnnouncements, getSingleAnnouncement, updateAnnouncement } from '../../actions/announcementAction';
import { clearupdateAnnouncement } from '../../slices/announcementSlice';
import DatePicker from "react-datepicker";
import { setHours, setMinutes } from 'date-fns';


const UpdateAnnouncement = ({ isActive, setIsActive }) => {

    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        content: "",
        images: [],
        imagesPreview: [],
        imagesCleared: false
    });

    console.log("formData", formData)

    const { id } = useParams();

    const {
        isAnnouncementUpdated,
        singleAnnouncementLoading,
        updateAnnouncementError,
        singleAnnouncement,
        updateAnnouncementLoading
    } = useSelector(state => state.announcementState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { product = null } = location.state || {};

    // console.log(isProductUpdated,error,product)
    // console.log("product",product)

    useEffect(() => {
        if (!product) {
            dispatch(getSingleAnnouncement(id))
            dispatch(getAnnouncements());

        }
    }, [dispatch, id]);

    console.log("singleAnnouncement", singleAnnouncement)

    useEffect(() => {
        if (product && product._id) {
            setFormData({
                ...formData,
                startDate: product.startDate,
                endDate: product.endDate,
                content: product.content,
                imagesPreview: product.images?.map(image => image.image)
            });
        }
        else if (!product && singleAnnouncement && singleAnnouncement.announcement && singleAnnouncement.announcement._id) {
            setFormData({
                ...formData,
                startDate: singleAnnouncement.announcement.startDate,
                endDate: singleAnnouncement.announcement.endDate || '',
                content: singleAnnouncement.announcement.content,
                imagesPreview: singleAnnouncement.announcement.images.map(image => image.image)
            });
        }


    }, [product, singleAnnouncement]);

    //  console.log("formdata",formData)


    const handleChange = (e) => {
        e.preventDefault();
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 1 * 1024 * 1024; // 10 MB in bytes
        let totalSize = 0;

        // Calculate total size of all selected files
        files.forEach(file => {
            totalSize += file.size;
        });

        // Check if total size exceeds the maximum allowed size
        if (totalSize > maxSize) {
            // toast.error('The total size of all selected images exceeds the 5MB limit.');
            toast.dismiss();
            setTimeout(() => {
                toast.error('The total size of all selected images exceeds the 1MB limit.', {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
            return; // Stop further execution if total size exceeds the limit
        }

        // Proceed with setting images if total size is within the limit
        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setFormData(prevState => ({
                        ...prevState,
                        imagesPreview: [...prevState.imagesPreview, reader.result],
                        images: [...prevState.images, file]
                    }));
                }
            };

            reader.readAsDataURL(file);
        });
    };


    const clearImagesHandler = () => {
        setFormData({
            ...formData,
            images: [],
            imagesPreview: [],
            imagesCleared: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submited');
        // const { name, price, category, images, imagesCleared } = formData;
        const formDataToSend = new FormData();
        formDataToSend.append('startDate', formData.startDate);
        formDataToSend.append('endDate', formData.endDate);
        formDataToSend.append('content', formData.content);
        formData.images.forEach(image => formDataToSend.append('images', image));
        formDataToSend.append('imagesCleared', formData.imagesCleared);
        // console.log(formDataToSend)
        dispatch(updateAnnouncement({ id, formDataToSend }));
        console.log('formDataToSend', id, formDataToSend);
    };



    useEffect(() => {
        dispatch(clearupdateAnnouncement())
    }, [])

    useEffect(() => {
        if (product && product._id !== id) {
            dispatch(getSingleAnnouncement(id));
        }
    }, [dispatch, id, product]);




    useEffect(() => {
        if (isAnnouncementUpdated) {

            toast.dismiss();
            setTimeout(() => {
                toast.success('Announcement updated successfully!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearupdateAnnouncement())
                });
            }, 300);
            dispatch(getAnnouncements())
            navigate('/admin/announcement');
        }

        if (updateAnnouncementError) {

            toast.dismiss();
            setTimeout(() => {
                toast.error(updateAnnouncementError, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearupdateAnnouncement())
                });
            }, 300);
        }
    }, [dispatch, isAnnouncementUpdated, updateAnnouncementError, navigate]);

     // Handle changes for the date pickers
     const handleStartDateChange = (date) => {
        setFormData({
            ...formData,
            startDate: setHours(setMinutes(date, 0), 12) // Set the time to 12 PM to standardize
        });
    };

    const handleEndDateChange = (date) => {
        setFormData({
            ...formData,
            endDate: setHours(setMinutes(date, 0), 12) // Set the time to 12 PM to standardize
        });
    };

    return (
        <div>
            <MetaData
                title="Update Product"
                description="Edit product details, update stock levels, or change product images to keep your catalog accurate and up to date."
            />


            <div className="row loader-parent">
                {/* <MetaData title={Update Product} /> */}
                <div className="col-12 col-md-2">
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>
                <div className="col-12 col-md-10 smalldevice-space loader-parent">
                    {
                        singleAnnouncementLoading ? (
                            <div className="container loader-loading-center">
                                <Loader />
                            </div>

                        ) : (
                            <Fragment>
                                <div className="wrapper mt-0">
                                    <form onSubmit={handleSubmit} className="shadow-lg" encType='multipart/form-data'>
                                        <h3 className="mb-4 admin-dashboard-x">Update Announcement</h3>

                                        {/* <div className="form-group">
                                            <label htmlFor="startDate">Start Date <span style={{ color: 'red' }}>*</span></label>
                                            <input
                                                type="text"
                                                id="startDate"
                                                name="startDate"
                                                className="form-control"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div> */}
                                        <div className="filter-row">
                                            <div style={{ display: 'flex', flexDirection: 'row', marginRight: '20px' }}>
                                                <label>Start Date : </label>
                                                <DatePicker
                                                    selected={formData.startDate}
                                                    onChange={handleStartDateChange}
                                                    dateFormat="dd/MM/yyyy"
                                                    className="form-control mb-3 date-input"
                                                    placeholderText="Select Start Date"
                                                    required
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', marginRight: '20px' }}>
                                            <label>End Date : </label>
                                                <DatePicker
                                                    selected={formData.endDate}
                                                    onChange={handleEndDateChange}
                                                    dateFormat="dd/MM/yyyy"
                                                    className="form-control mb-3 date-input"
                                                    placeholderText="Select End Date"
                                                    required
                                                />
                                            </div>

                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="description">Content</label>
                                            <textarea
                                                type="text"
                                                id="content"
                                                name="content"
                                                className="form-control"
                                                value={formData.content}
                                                onChange={handleChange}
                                                style={{ height: "20vh" }}
                                                required
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label>Images (Size should be within 5mb) <span style={{ color: 'red' }}></span></label>
                                            <div className='custom-file'>
                                                <input
                                                    type='file'
                                                    name='images'
                                                    accept='.jpg, .jpeg, .png, .webp' // Accepts only jpg, jpeg, and png files
                                                    className='custom-file-input'
                                                    id='images'
                                                    multiple
                                                    onChange={handleImagesChange}
                                                // required
                                                />
                                                <label className='custom-file-label' htmlFor='images'>
                                                    Choose Images
                                                </label>
                                            </div>
                                            {formData.imagesPreview?.length > 0 &&
                                                <Fragment>
                                                    <span className="mr-2" onClick={clearImagesHandler} style={{ cursor: "pointer" }}>
                                                        <i className="fa fa-trash"></i>
                                                    </span>
                                                    {formData.imagesPreview.map(image => (
                                                        <img
                                                            className="mt-3 mr-2"
                                                            key={image}
                                                            src={image}
                                                            alt=" Preview"
                                                            width="55"
                                                            height="52"
                                                        />
                                                    ))}
                                                </Fragment>
                                            }
                                        </div>


                                        <button
                                            type="submit"
                                            className="btn btn-block py-3"
                                            disabled={updateAnnouncementLoading}
                                        >
                                            {updateAnnouncementLoading ? <LoaderButton fullPage={false} size={20} /> : (
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

export default UpdateAnnouncement;