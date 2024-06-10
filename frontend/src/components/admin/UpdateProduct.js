import React, { Fragment } from 'react';
import Sidebar from '../admin/Sidebar';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  useParams } from "react-router-dom";
import { updateProduct } from '../../actions/productsActions';
import { clearProductUpdated, clearError } from '../../slices/productSlice';
import { toast } from 'react-toastify';
import { getProduct } from '../../actions/productAction';

// const UpdateProduct = () => {
//     const [name, setName] = useState("");
//     const [price, setPrice] = useState("");
//     const [category, setCategory] = useState("");
//     const [images, setImages] = useState([]);
//     const [imagesPreview, setImagesPreview] = useState([]);
//     const [imagesCleared, setImagesCleared] = useState(false);

//     const { id } = useParams();

//     const { loading, isProductUpdated, error, product } = useSelector((state) => state.productState);
//     console.log(product);

//     const categories = ['Vegetables', 'Fruits'];

//     const dispatch = useDispatch();

//     const onImagesChange = (e) => {
//         const files = Array.from(e.target.files);

//         files.forEach(file => {
//             const reader = new FileReader();

//             reader.onload = () => {
//                 if (reader.readyState === 2) {
//                     setImagesPreview(oldArray => [...oldArray, reader.result]);
//                     setImages(oldArray => [...oldArray, file]);
//                 }
//             };

//             reader.readAsDataURL(file);
//         });
//     };

//     const submitHandler = (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('name', name);
//         formData.append('price', price);
//         formData.append('category', category);
//         images.forEach(image => {
//             formData.append('images', image);
//         });
//         formData.append('imagesCleared', imagesCleared);
//         dispatch(updateProduct(id, formData));
//     };

//     const clearImagesHandler = () => {
//         setImages([]);
//         setImagesPreview([]);
//         setImagesCleared(true);
//     };

//     useEffect(() => {
//         if (product && isProductUpdated) {
//             toast('Product updated Succesfully!', {
//                 type: 'success',
//                 position: "bottom-center",
//                 onOpen: () => dispatch(clearProductUpdated())
//             });
//         }

//         if (error) {
//             toast(error, {
//                 position: "bottom-center",
//                 type: 'error',
//                 onOpen: () => { dispatch(clearError()) }
//             });
//         }

//         dispatch(getProduct(id));

//     }, [dispatch, isProductUpdated, error, id, product]);

//     useEffect(() => {
//         if (product && product._id) {
//             setName(product.name);
//             setPrice(product.price);
//             setCategory(product.category);

//             let images = [];
//             product.images.forEach(image => {
//                 images.push(image.image);
//             });
//             setImagesPreview(images);

//         }

//     }, [product]);

//     return (
//         <div className="row">
//             <div className="col-12 col-md-2">
//                 <Sidebar />
//             </div>
//             <div className="col-12 col-md-10">
//                 <Fragment>
//                     <div className="wrapper my-5">
//                         <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
//                             <h1 className="mb-4">Update Product</h1>

//                             <div className="form-group">
//                                 <label htmlFor="name_field">Name</label>
//                                 <input
//                                     type="text"
//                                     id="name_field"
//                                     className="form-control"
//                                     onChange={e => setName(e.target.value)}
//                                     value={name}
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="price_field">Price</label>
//                                 <input
//                                     type="text"
//                                     id="price_field"
//                                     className="form-control"
//                                     onChange={e => setPrice(e.target.value)}
//                                     value={price}
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="category_field">Category</label>
//                                 <select value={category} onChange={e => setCategory(e.target.value)} className="form-control" id="category_field">
//                                     <option value="">Select</option>
//                                     {categories.map(category => (
//                                         <option key={category} value={category}>{category}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className='form-group'>
//                                 <label>Images</label>

//                                 <div className='custom-file'>
//                                     <input
//                                         type='file'
//                                         name='product_images'
//                                         className='custom-file-input'
//                                         id='customFile'
//                                         multiple
//                                         onChange={onImagesChange}
//                                     />
//                                     <label className='custom-file-label' htmlFor='customFile'>
//                                         Choose Images
//                                     </label>
//                                 </div>

//                                 {imagesPreview.length > 0 && <span className="mr-2" onClick={clearImagesHandler} style={{ cursor: "pointer" }}><i className="fa fa-trash"></i></span>}
//                                 {imagesPreview.map(image => (
//                                     <img
//                                         className="mt-3 mr-2"
//                                         key={image}
//                                         src={image}
//                                         alt={`Image Preview`}
//                                         width="55"
//                                         height="52"
//                                     />
//                                 ))}
//                             </div>

//                             <button
//                                 id="login_button"
//                                 type="submit"
//                                 className="btn btn-block py-3"
//                                 disabled={loading}
//                             >
//                                 UPDATE
//                             </button>
//                         </form>
//                     </div>
//                 </Fragment>
//             </div>
//         </div>
//     )
// }

// export default UpdateProduct;

const UpdateProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        images: [],
        imagesPreview: [],
        imagesCleared: false
    });
    // console.log(formData)

    const { id } = useParams();
    const { loading, isProductUpdated, error, product } = useSelector((state) => state.productState);
    const dispatch = useDispatch();

    useEffect(() => {
        if (product && product._id) {
            setFormData({
                ...formData,
                name: product.englishName,
                price: product.price,
                category: product.category,
                imagesPreview: product.images.map(image => image.image)
            });
        }
    }, [product]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setFormData({
                        ...formData,
                        imagesPreview: [...formData.imagesPreview, reader.result],
                        images: [...formData.images, file]
                    });
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
        formDataToSend.append('name', formData.name);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('category', formData.category);
        formData.images.forEach(image => formDataToSend.append('images', image));
        formDataToSend.append('imagesCleared', formData.imagesCleared);
        // console.log(formDataToSend)
        dispatch(updateProduct({ id, formDataToSend }));
    };

    useEffect(() => {
        if (isProductUpdated) {
            toast('Product updated successfully!', {
                type: 'success',
                position: "bottom-center",
                onOpen: () => dispatch(clearProductUpdated())
            });
        }

        if (error) {
            toast(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => dispatch(clearError())
            });
        }

        dispatch(getProduct(id));
    }, [dispatch, isProductUpdated, error, id]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper my-5">
                        <form onSubmit={handleSubmit} className="shadow-lg" encType='multipart/form-data'>
                            <h1 className="mb-4">Update Product</h1>

                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="text"
                                    id="price"
                                    name="price"
                                    className="form-control"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    className="form-control"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Fruits">Fruits</option>
                                </select>
                            </div>

                            <div className='form-group'>
                                <label>Images</label>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='product_images'
                                        className='custom-file-input'
                                        id='images'
                                        multiple
                                        onChange={handleImagesChange}
                                    />
                                    <label className='custom-file-label' htmlFor='images'>
                                        Choose Images
                                    </label>
                                </div>
                                {formData.imagesPreview.length > 0 &&
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
                                disabled={loading}
                            >
                                UPDATE
                            </button>
                        </form>
                    </div>
                </Fragment>
            </div>
        </div>
    );
}

export default UpdateProduct;






