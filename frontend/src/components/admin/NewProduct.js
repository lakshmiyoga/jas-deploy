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


const NewProduct = ({ isActive, setIsActive }) => {
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const [englishName, setEnglishName] = useState("");
    const [tamilName, setTamilName] = useState("");
    const [buyingPrice, setBuyingPrice] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [percentage, setPercentage] = useState("40");
    const [stocks, setStocks] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [imagesCleared, setImagesCleared] = useState(false);
    const [measurement, setMeasurement] = useState("");
    const [rangeForGrams, setRangeForGrams] = useState(""); // New state for range


    const { newloading, isProductCreated, error } = useSelector(state => state.productState)

    const categories = [
        'Vegetables',
        'Fruits',
        'Keerai'
    ]

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
        const maxSize = 5 * 1024 * 1024; // 10 MB in bytes
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
        formData.append('englishName', englishName);
        formData.append('tamilName', tamilName);
        formData.append('buyingPrice', buyingPrice);
        formData.append('price', price);
        formData.append('percentage', percentage);
        formData.append('category', category);
        formData.append('measurement', measurement);
        if (measurement === "Grams") {
            formData.append('rangeForGrams', rangeForGrams)
        }; // Append range if provided
        formData.append('stocks', stocks);
        images.forEach(image => {
            formData.append('images', image)
        })
        formData.append('imagesCleared', imagesCleared);
        dispatch(createNewProduct(formData))
    }

    const clearImagesHandler = () => {
        setImages([]);
        setImagesPreview([]);
        setImagesCleared(true);
    };

    useEffect(() => {
        if (isProductCreated) {
            // toast('Product Created Succesfully!', {
            //     type: 'success',
            //     position: "bottom-center",
            //     onOpen: () => dispatch(clearProductCreated())
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.success('Product Created Succesfully!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearProductCreated())
                });
            }, 300);
            dispatch(getAdminProducts())
            navigate('/admin/products')
            return;
        }

        if (error) {
            // toast(error, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => { dispatch(clearError()) }
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.error(error, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearError()) }
                });
            }, 300);
            return
        }
    }, [isProductCreated, error, dispatch, navigate])

    useEffect(() => {
        // Calculate price whenever buyingPrice or percentage changes
        if (buyingPrice && percentage) {
            const calculatedPrice = parseFloat(buyingPrice) + (parseFloat(buyingPrice) * (parseFloat(percentage) / 100));
            setPrice(calculatedPrice.toFixed(2)); // Setting the price with two decimal points
        } else {
            setPrice(""); // Reset price if buyingPrice or percentage is empty
        }
    }, [buyingPrice, percentage]);


    return (
        <div>
            {/* <MetaData title={`New Product`} /> */}
            <MetaData
                title="Add New Product"
                description="Create new products for your store. Define product details, upload images, and manage stock levels to keep your catalog up to date."
            />


            <div className="row">
                <div className="col-12 col-md-2">
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>
                <div className="col-12 col-md-10 smalldevice-space">
                    <Fragment>
                        <div className="wrapper mt-0">
                            <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                                <h1 className="mb-4">New Product</h1>

                                <div className="form-group">
                                    <label htmlFor="englishName_field">English Name  <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        id="englishName_field"
                                        className="form-control"
                                        onChange={e => setEnglishName(e.target.value)}
                                        value={englishName}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tamilName_field">Tamil Name  <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        id="tamilName_field"
                                        className="form-control"
                                        onChange={e => setTamilName(e.target.value)}
                                        value={tamilName}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="buyingPrice">Buying Price  <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        id="buyingPrice"
                                        className="form-control"
                                        onChange={e => setBuyingPrice(e.target.value)}
                                        value={buyingPrice}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="percentage">Percentage  <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        id="percentage"
                                        className="form-control"
                                        onChange={e => setPercentage(e.target.value)}
                                        value={percentage}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label for="price_field">Selling Price</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        // onChange={e => setPrice(e.target.value)}
                                        value={price}
                                        disabled
                                    />
                                </div>

                                {/* <div className="form-group">
                <label for="description_field">Description</label>
                <textarea className="form-control" id="description_field" rows="8" ></textarea>
              </div> */}

                                <div className="form-group">
                                    <label for="category_field">Category  <span style={{ color: 'red' }}>*</span></label>
                                    <select onChange={e => setCategory(e.target.value)} className="form-control" id="category_field" required>
                                        <option value="">Select</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* <div className="form-group">
                <label for="stock_field">Stock</label>
                <input
                  type="number"
                  id="stock_field"
                  className="form-control"
                  value=""
                />
              </div> */}

                                {/* <div className="form-group">
                <label for="seller_field">Seller Name</label>
                <input
                  type="text"
                  id="seller_field"
                  className="form-control"
                  value=""
                />
              </div> */}
                               
                                <div className="form-group">
                                    <label for="measurement_field">Measurement  <span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        type="text"
                                        id="measurement_field"
                                        className="form-control"
                                        onChange={e => setMeasurement(e.target.value)}
                                        value={measurement}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Kg">Kg</option>
                                        <option value="Piece">Piece</option>
                                        <option value="Box">Box</option>
                                        <option value="Grams">Grams</option>
                                    </select>
                                </div>
                                {/* Range input for grams */}
                                {measurement === "Grams" && (
                                    <div className="form-group">
                                        <label htmlFor="range_field">Range for Grams(per piece) <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                            type="text"
                                            id="range_field"
                                            className="form-control"
                                            onChange={e => setRangeForGrams(e.target.value)}
                                            value={rangeForGrams}
                                            placeholder="Enter range in grams"
                                        />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label for="stock_field">Stocks  <span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        type="text"
                                        id="stock_field"
                                        className="form-control"
                                        onChange={e => setStocks(e.target.value)}
                                        value={stocks}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Stock">Stock</option>
                                        <option value="No Stock">No Stock</option>
                                    </select>
                                </div>


                                <div className='form-group'>
                                    <label>Images  (*Size should be within 5mb)  <span style={{ color: 'red' }}>*</span> </label>

                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='product_images'
                                            className='custom-file-input'
                                            accept='.jpg, .jpeg, .png, .webp' // Accepts only jpg, jpeg, and png files
                                            id='customFile'
                                            multiple
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
                                    disabled={newloading}
                                >
                                    {newloading ? <LoaderButton fullPage={false} size={20} /> : (
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

export default NewProduct
