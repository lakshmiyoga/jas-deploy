import React, { Fragment, useState, useEffect } from 'react';
import Sidebar from '../admin/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createCategory, getCategories } from '../../actions/categoryAction';
import { clearPostCategory } from '../../slices/categorySlice';
import { Slide, toast } from 'react-toastify';
import MetaData from '../Layouts/MetaData';
import LoaderButton from '../Layouts/LoaderButton';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createAnnouncement, getAnnouncements } from '../../actions/announcementAction';
import { clearPostannouncement } from '../../slices/announcementSlice';
import { setHours, setMinutes } from 'date-fns';

const NewAnnouncement = ({ isActive, setIsActive }) => {
    const location = useLocation();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [imagesCleared, setImagesCleared] = useState(false);


    // const { postloading, postcategory, posterror } = useSelector(state => state.categoryState);
    const { postAnnouncementLoading, postAnnouncement, postAnnouncementError } = useSelector(state => state.announcementState);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 1 * 1024 * 1024; // 1 MB
        let totalSize = 0;

        files.forEach(file => {
            totalSize += file.size;
        });

        if (totalSize > maxSize) {
            toast.dismiss();
            setTimeout(() => {
                toast.error('The total size of all selected images exceeds the 1MB limit.', {
                    position: 'bottom-center',
                    autoClose: 700,
                    transition: Slide,
                });
            }, 300);
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                    setImages(oldArray => [...oldArray, file]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('content', content);
        images.forEach(image => formData.append('images', image));
        formData.append('imagesCleared', imagesCleared);
        dispatch(createAnnouncement(formData));
    };

    const clearImagesHandler = () => {
        setImages([]);
        setImagesPreview([]);
        setImagesCleared(true);
    };

    useEffect(() => {
        if (postAnnouncement) {
            toast.dismiss();
            setTimeout(() => {
                toast.success('Announcement Created Successfully!', {
                    position: 'bottom-center',
                    autoClose: 700,
                    transition: Slide,
                    onOpen: () => dispatch(clearPostannouncement()),
                });
            }, 300);
            dispatch(getAnnouncements());
            navigate('/admin/announcement');
            return;
        }

        if (postAnnouncementError) {
            toast.dismiss();
            setTimeout(() => {
                toast.error(postAnnouncementError, {
                    position: 'bottom-center',
                    autoClose: 700,
                    transition: Slide,
                    onOpen: () => dispatch(clearPostannouncement()),
                });
            }, 300);
        }
    }, [postAnnouncement, postAnnouncementError, dispatch, navigate]);

 

    return (
        <div>
            <MetaData
                title="Add New Announcement"
                description="Create a new Announcement for your store. Define Announcement details, upload images, and set a valid date range."
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
                            <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
                                <h3 className="mb-4">New Announcement</h3>
                                <div className="filter-row">
                                    <div style={{ display: 'flex', flexDirection: 'row', marginRight: '20px' }}>
                                        <label htmlFor="startDate">Start Date: <span style={{ color: 'red' }}>*</span></label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(setHours(setMinutes(date, 0), 12))}
                                            dateFormat="dd/MM/yyyy"
                                            className="form-control date-input"
                                            placeholderText="dd/mm/yyyy"
                                            
                                        />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'row', marginRight: '20px' }}>
                                        <label htmlFor="endDate">End Date: <span style={{ color: 'red' }}>*</span></label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndDate(setHours(setMinutes(date, 0), 12))}
                                            dateFormat="dd/MM/yyyy"
                                            className="form-control date-input"
                                            placeholderText="dd/mm/yyyy"
                                        />
                                    </div>
                                </div>
                                {/* <div className="filter-row">
                                    <div style={{ display: 'flex', flexDirection: 'row', marginRight: '20px' }}>
                                        <label>StartDate : </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="form-control mb-3 date-input"
                                            placeholder="Start Date"

                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', marginRight: '20px' }}>
                                        <label>EndDate : </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="form-control mb-3 date-input"
                                            placeholder="End Date"

                                        />
                                    </div>

                                </div> */}

                                <div className="form-group">
                                    <label htmlFor="description">Content <span style={{ color: 'red' }}>*</span></label>
                                    <textarea
                                        type="text"
                                        id="description"
                                        className="form-control"
                                        onChange={e => setContent(e.target.value)}
                                        value={content}
                                        style={{ height: "20vh" }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Images (Size should be within 1MB) <span style={{ color: 'red' }}></span></label>
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            name="images"
                                            className="custom-file-input"
                                            accept=".jpg, .jpeg, .png, .webp"
                                            id="customFile"
                                            onChange={onImagesChange}
                                            required
                                        />
                                        <label className="custom-file-label" htmlFor="customFile">
                                            Choose Images
                                        </label>
                                    </div>
                                    {imagesPreview.length > 0 && (
                                        <Fragment>
                                            <span className="mr-2" onClick={clearImagesHandler} style={{ cursor: "pointer" }}>
                                                <i className="fa fa-trash"></i>
                                            </span>
                                            {imagesPreview.map(image => (
                                                <img
                                                    className="mt-3 mr-2"
                                                    key={image}
                                                    src={image}
                                                    alt="Preview"
                                                    width="55"
                                                    height="52"
                                                />
                                            ))}
                                        </Fragment>
                                    )}
                                </div>

                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={postAnnouncementLoading}
                                >
                                    {postAnnouncementLoading ? <LoaderButton fullPage={false} size={20} /> : <span>CREATE</span>}
                                </button>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </div>
    );
};

export default NewAnnouncement;