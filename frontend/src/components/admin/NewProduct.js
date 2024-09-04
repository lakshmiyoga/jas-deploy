import React, { Fragment } from 'react'
import Sidebar from '../admin/Sidebar'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import { createNewProduct } from '../../actions/productsActions';
import { clearProductCreated, clearError} from '../../slices/productSlice';
import {  toast } from 'react-toastify';
import MetaData from '../Layouts/MetaData';


const NewProduct = ({isActive,setIsActive}) => {
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const [englishName, setEnglishName] = useState("");
    const [tamilName, setTamilName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [imagesCleared, setImagesCleared] = useState(false);


    const { loading, isProductCreated, error } = useSelector(state => state.productState)

    const categories = [
        'Vegetables',
        'Fruits',
        'Keerai'
    ]

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            
            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState === 2 ) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, file])
                }
            }

            reader.readAsDataURL(file)


        })
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('englishName', englishName);
        formData.append('tamilName', tamilName);
        formData.append('price' , price);
        formData.append('category' , category);
        images.forEach (image => {
            formData.append('images', image)
        })
        formData.append('imagesCleared',imagesCleared);
        dispatch(createNewProduct(formData))
    }

    const clearImagesHandler = () => {
        setImages([]);
        setImagesPreview([]);
       setImagesCleared(true);
    };

    useEffect(() => {
        if(isProductCreated) {
            toast('Product Created Succesfully!',{
                type: 'success',
                position:"bottom-center",
                onOpen: () => dispatch(clearProductCreated())
            })
            navigate('/admin/products')
            return;
        }

        if(error)  {
            toast(error, {
                position:"bottom-center",
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }
    }, [isProductCreated, error, dispatch, navigate])

    return (
        <div>
             <MetaData title={`New Product`} />
       
        <div className="row">
            <div className="col-12 col-md-2">
            <div style={{display:'flex',flexDirection:'row',position:'fixed',top:'0px',zIndex:99999,backgroundColor:'#fff',minWidth:'100%'}}>
                <Sidebar isActive={isActive} setIsActive={setIsActive}/>
                </div>
            </div>
            <div className="col-12 col-md-10 smalldevice-space">
                <Fragment>
                    <div className="wrapper mt-0">
                        <form onSubmit={submitHandler}  className="shadow-lg" encType='multipart/form-data'>
                            <h1 className="mb-4">New Product</h1>

                            <div className="form-group">
                                <label htmlFor="englishName_field">English Name</label>
                                <input
                                    type="text"
                                    id="englishName_field"
                                    className="form-control"
                                    onChange={e => setEnglishName(e.target.value)}
                                    value={englishName}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="tamilName_field">Tamil Name</label>
                                <input
                                    type="text"
                                    id="tamilName_field"
                                    className="form-control"
                                    onChange={e => setTamilName(e.target.value)}
                                    value={tamilName}
                                />
                            </div>

                            <div className="form-group">
                                <label for="price_field">Price</label>
                                <input
                                    type="text"
                                    id="price_field"
                                    className="form-control"
                                    onChange={e => setPrice(e.target.value)}
                                    value={price}
                                />
                            </div>

                            {/* <div className="form-group">
                <label for="description_field">Description</label>
                <textarea className="form-control" id="description_field" rows="8" ></textarea>
              </div> */}

                            <div className="form-group">
                                <label for="category_field">Category</label>
                                <select onChange={e => setCategory(e.target.value)} className="form-control" id="category_field">
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

                            <div className='form-group'>
                                <label>Images</label>

                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='product_images'
                                        className='custom-file-input'
                                        accept='.jpg, .jpeg, .png' // Accepts only jpg, jpeg, and png files
                                        id='customFile'
                                        multiple
                                        onChange={onImagesChange}
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
                                disabled={loading}
                            >
                                CREATE
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
