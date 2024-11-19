import React, { Fragment } from 'react'
import Sidebar from '../admin/Sidebar'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import { createNewProduct, getAdminProducts } from '../../actions/productsActions';
import { clearProductCreated, clearError } from '../../slices/productSlice';
import { Slide, toast } from 'react-toastify';
import MetaData from '../Layouts/MetaData';
import LoaderButton from '../Layouts/LoaderButton';
import { createCategory, getCategories } from '../../actions/categoryAction';
import { clearPostCategory } from '../../slices/categorySlice';


const NewCategory = ({ isActive, setIsActive }) => {
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const [name, setName] = useState("");
    const [description, setDiscription] = useState("");
    const [category, setCategory] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [imagesCleared, setImagesCleared] = useState(false);
    const [type, setType] = useState("");

    const {
        postloading,
        postcategory,
        posterror,
        getloading,
        getcategory,
        geterror,
        deleteloading,
        deletecategory,
        deleteerror,
        updateloading,
        updatecategory,
        updateerror,
        singleCategory,
        singleLoading,
        singleError, } = useSelector(state => state.categoryState);

    const navigate = useNavigate();
    const dispatch = useDispatch();


    // const onImagesChange = (e) => {
    //     const files = Array.from(e.target.files);

    //     files.forEach(file => {

    //         const reader = new FileReader();

    //         reader.onload = () => {
    //             if(reader.readyState === 2 ) {
    //                 setImagesPreview(oldArray => [...oldArray, reader.result])
    //                 setImages(oldArray => [...oldArray, file])
    //             }
    //         }

    //         reader.readAsDataURL(file)


    //     })
    // }

    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 1 * 1024 * 1024; // 10 MB in bytes
        let totalSize = 0;

        // Calculate the total size of all selected files
        files.forEach(file => {
            totalSize += file.size;
        });

        // Check if the total size exceeds the maximum allowed size
        if (totalSize > maxSize) {
            // toast.error('The total size of all selected images exceeds the 5MB limit.');
            toast.dismiss();
            setTimeout(() => {
                toast.error('The total size of all selected images exceeds the 5MB limit.', {
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
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('type', type);
        images.forEach(image => {
            formData.append('images', image)
        })
        formData.append('imagesCleared', imagesCleared);
        dispatch(createCategory(formData))
    }

    const clearImagesHandler = () => {
        setImages([]);
        setImagesPreview([]);
        setImagesCleared(true);
    };

    useEffect(() => {
        if (postcategory) {
            // toast('Product Created Succesfully!', {
            //     type: 'success',
            //     position: "bottom-center",
            //     onOpen: () => dispatch(clearProductCreated())
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.success('Category Created Succesfully!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearPostCategory())
                });
            }, 300);
            dispatch(getCategories())
            navigate('/admin/category')
            return;
        }

        if (posterror) {
            // toast(error, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => { dispatch(clearError()) }
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.error(posterror, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearPostCategory()) }
                });
            }, 300);
            return
        }
    }, [postcategory, posterror, dispatch, navigate])


    return (
        <div>
            {/* <MetaData title={`New Product`} /> */}
            <MetaData
                title="Add New Category"
                description="Create new category for your store. Define category details, upload images, keep your catalog up to date."
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
                            <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                                <h3 className="mb-4">New Category</h3>

                                <div className="form-group">
                                    <label htmlFor="name"> Name  <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        onChange={e => setName(e.target.value)}
                                        value={name}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Description </label>
                                    <input
                                        type="text"
                                        id="description"
                                        className="form-control"
                                        onChange={e => setDiscription(e.target.value)}
                                        value={description}
                                    />
                                </div>

                                <div className="form-group">
                                    <label for="category">Category</label>
                                    <input
                                        type="text"
                                        id="category"
                                        className="form-control"
                                        onChange={e => setCategory(e.target.value)}
                                        value={category}
                                        required
                                    />
                                </div>
                                {/* <div className="form-group">
                                    <label for="type">Type<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        id="type"
                                        className="form-control"
                                        onChange={e => setType(e.target.value)}
                                        value={type}
                                        required
                                    />
                                </div> */}

                                <div className="form-group">
                                    <label htmlFor="type">Type <span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        id="type"
                                        className="form-control"
                                        onChange={e => setType(e.target.value)}
                                        value={type}
                                        required
                                    >
                                        <option value="" disabled>Select Type</option>
                                        <option value="Fresh">Fresh</option>
                                        <option value="Groceries">Groceries</option>
                                    </select>
                                </div>



                                <div className='form-group'>
                                    <label>Images  (*Size should be within 1mb)  <span style={{ color: 'red' }}>*</span> </label>

                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='images'
                                            className='custom-file-input'
                                            accept='.jpg, .jpeg, .png, .webp' // Accepts only jpg, jpeg, and png files
                                            id='customFile'
                                            // multiple
                                            onChange={onImagesChange}
                                            required
                                        />
                                        <label className='custom-file-label' for='customFile'>
                                            Choose Images
                                        </label>
                                    </div>

                                    {/* {imagesPreview.map(image => (
                                        <img
                                            className="mt-3 mr-2"
                                            key={image}
                                            src={image}
                                            alt={` Preview`}
                                            width="55"
                                            height="52"
                                        />
                                    ))} */}
                                    {imagesPreview.length > 0 &&
                                        <Fragment>
                                            <span className="mr-2" onClick={clearImagesHandler} style={{ cursor: "pointer" }}>
                                                <i className="fa fa-trash"></i>
                                            </span>
                                            {imagesPreview.map(image => (
                                                <img
                                                    className="mt-3 mr-2"
                                                    key={image}
                                                    src={image}
                                                    alt={` Preview`}
                                                    width="55"
                                                    height="52"
                                                />
                                            ))}
                                        </Fragment>
                                    }
                                </div>


                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={postloading}
                                >
                                    {postloading ? <LoaderButton fullPage={false} size={20} /> : (
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

export default NewCategory
