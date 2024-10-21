import React, { Fragment } from 'react';
import Sidebar from '../admin/Sidebar';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAdminProducts, updateProduct } from '../../actions/productsActions';
import { clearProductUpdated, clearError, clearproduct } from '../../slices/productSlice';
import { Slide,toast } from 'react-toastify';
import { getProduct } from '../../actions/productAction';
import MetaData from '../Layouts/MetaData';
import LoaderButton from '../Layouts/LoaderButton';
import Loader from '../Layouts/Loader';

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

const UpdateProduct = ({ isActive, setIsActive }) => {
    // const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);

    const [formData, setFormData] = useState({
        englishName: "",
        tamilName: "",
        buyingPrice: "",
        price: "",
        category: "",
        percentage: "",
        stocks: "",
        images: [],
        imagesPreview: [],
        imagesCleared: false
    });

    // console.log(formData)

    const { id } = useParams();
    const { updateloading, loading, isProductUpdated, error, product } = useSelector((state) => state.productState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // console.log(isProductUpdated,error,product)



    useEffect(() => {
        if (product && product._id) {
            setFormData({
                ...formData,
                englishName: product.englishName,
                tamilName: product.tamilName,
                buyingPrice: product.buyingPrice,
                price: product.price,
                category: product.category,
                percentage: product.percentage,
                stocks: product.stocks,
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

    // const handleImagesChange = (e) => {
    //     const files = Array.from(e.target.files);

    //     files.forEach(file => {
    //         const reader = new FileReader();

    //         reader.onload = () => {
    //             if (reader.readyState === 2) {
    //                 setFormData({
    //                     ...formData,
    //                     imagesPreview: [...formData.imagesPreview, reader.result],
    //                     images: [...formData.images, file]
    //                 });
    //             }
    //         };

    //         reader.readAsDataURL(file);
    //     });
    // };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 5 * 1024 * 1024; // 10 MB in bytes
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
        formDataToSend.append('englishName', formData.englishName);
        formDataToSend.append('tamilName', formData.tamilName);
        formDataToSend.append('buyingPrice', formData.buyingPrice);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('percentage', formData.percentage);
        formDataToSend.append('stocks', formData.stocks);
        formData.images.forEach(image => formDataToSend.append('images', image));
        formDataToSend.append('imagesCleared', formData.imagesCleared);
        // console.log(formDataToSend)
        dispatch(updateProduct({ id, formDataToSend }));
    };

    useEffect(() => {
        dispatch(clearproduct())
    }, [])

    useEffect(() => {
        if (product && product._id !== id) {
            dispatch(getProduct(id));
        }
    }, [dispatch, id, product]);

    useEffect(() => {
        if (!product) {
            dispatch(getProduct(id));
        }
    }, [dispatch, id]);

    // useEffect(()=>{
    //     if(id){
    //         dispatch(getProduct(id));
    //     }
    // },[])

    useEffect(() => {
        if (formData.buyingPrice && formData.percentage) {
            const buyingPrice = parseFloat(formData.buyingPrice);
            const percentage = parseFloat(formData.percentage);
            if (!isNaN(buyingPrice) && !isNaN(percentage)) {
                const calculatedPrice = buyingPrice + (buyingPrice * (percentage / 100));
                setFormData(prevState => ({
                    ...prevState,
                    price: calculatedPrice.toFixed(2) // Set price with two decimal points
                }));
            }
        }
    }, [formData.buyingPrice, formData.percentage]);


    // useEffect(() => {
    //     if (isProductUpdated) {
    //         toast('Product updated successfully!', {
    //             type: 'success',
    //             position: "bottom-center",
    //             onOpen: () => dispatch(clearProductUpdated())
    //         });
    //     navigate('/admin/products');
    //     }

    //     if (error) {
    //         toast(error, {
    //             position: "bottom-center",
    //             type: 'error',
    //             onOpen: () => dispatch(clearError())
    //         });
    //     }

    //     dispatch(getProduct(id));
    // }, [dispatch, isProductUpdated, error]);
    useEffect(() => {
        if (isProductUpdated) {
            // toast('Product updated successfully!', {
            //     type: 'success',
            //     position: "bottom-center",
            //     onOpen: () => dispatch(clearProductUpdated())
            // });
            toast.dismiss();
            setTimeout(() => {
                toast.success('Product updated successfully!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearProductUpdated())
                });
            }, 300);
            dispatch(getAdminProducts())
            navigate('/admin/products');
        }

        if (error) {
            // toast(error, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => dispatch(clearError())
            // });
            toast.dismiss();
            setTimeout(() => {
                toast.error(error, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearError())
                });
            }, 300);
        }
    }, [dispatch, isProductUpdated, error, navigate]);

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
                    loading ? (
                        <div className="container loader-loading-center">
                            <Loader />
                        </div>

                    )  : (
                        <Fragment>
                            <div className="wrapper mt-0">
                                <form onSubmit={handleSubmit} className="shadow-lg" encType='multipart/form-data'>
                                    <h1 className="mb-4 admin-dashboard-x">Update Product</h1>

                                    <div className="form-group">
                                        <label htmlFor="name">English Name <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                            type="text"
                                            id="englishName"
                                            name="englishName"
                                            className="form-control"
                                            value={formData.englishName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Tamil Name <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                            type="text"
                                            id="tamilName"
                                            name="tamilName"
                                            className="form-control"
                                            value={formData.tamilName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="buyingPrice">Buying Price in (Rs) <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                            type="text"
                                            id="buyingPrice"
                                            name="buyingPrice"
                                            className="form-control"
                                            value={formData.buyingPrice}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="percentage">Percentage (%) <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                            type="text"
                                            id="percentage"
                                            name="percentage"
                                            className="form-control"
                                            value={formData.percentage}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="price"> Selling Price in (Rs)</label>
                                        <input
                                            type="text"
                                            id="price"
                                            name="price"
                                            className="form-control"
                                            value={formData.price}
                                            // onChange={handleChange}
                                            disabled
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="category">Category <span style={{ color: 'red' }}>*</span></label>
                                        <select
                                            id="category"
                                            name="category"
                                            className="form-control"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="Vegetables">Vegetables</option>
                                            <option value="Fruits">Fruits</option>
                                            <option value="Keerai">Keerai</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="stocks"> Stocks <span style={{ color: 'red' }}>*</span></label>
                                        <select
                                            type="text"
                                            id="stocks"
                                            name="stocks"
                                            className="form-control"
                                            value={formData.stocks}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="Stock">Stock</option>
                                            <option value="No Stock">No Stock</option>
                                        </select>
                                    </div>

                                    <div className='form-group'>
                                        <label>Images (*Size should be within 5mb) <span style={{ color: 'red' }}>*</span></label>
                                        <div className='custom-file'>
                                            <input
                                                type='file'
                                                name='product_images'
                                                accept='.jpg, .jpeg, .png' // Accepts only jpg, jpeg, and png files
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
                                        disabled={updateloading}
                                    >
                                        {updateloading ? <LoaderButton fullPage={false} size={20} /> : (
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

export default UpdateProduct;






