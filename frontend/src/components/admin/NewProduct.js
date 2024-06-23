import React, { Fragment } from 'react'
import Sidebar from '../admin/Sidebar'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { createNewProduct } from '../../actions/productsActions';
import { clearProductCreated, clearError} from '../../slices/productSlice';
import {  toast } from 'react-toastify';


const NewProduct = () => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);


    const { loading, isProductCreated, error } = useSelector(state => state.productState)

    const categories = [
        'Vegetables',
        'Fruits'
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
        formData.append('name' , name);
        formData.append('price' , price);
        formData.append('category' , category);
        images.forEach (image => {
            formData.append('images', image)
        })
        dispatch(createNewProduct(formData))
    }

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
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper mt-0">
                        <form onSubmit={submitHandler}  className="shadow-lg" encType='multipart/form-data'>
                            <h1 className="mb-4">New Product</h1>

                            <div className="form-group">
                                <label for="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    onChange={e => setName(e.target.value)}
                                    value={name}
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
                                        id='customFile'
                                        multiple
                                        onChange={onImagesChange}
                                    />
                                    <label className='custom-file-label' for='customFile'>
                                        Choose Images
                                    </label>
                                </div>
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

    )
}

export default NewProduct
