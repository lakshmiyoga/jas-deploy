import React, { Fragment, useEffect, useState } from 'react'
import MetaData from '../Layouts/MetaData'
import { getProducts } from '../../actions/productsActions'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Layouts/Loader'
import Product from '.././Product/Product'
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom'



const ProductSearch = () => {

    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.productsState)
    const { keyword } = useParams();
    const [category, setCategory] = useState(null);
    console.log(category);


    const categories = [
        'Vegetables',
        'Fruits'
    ];
    console.log(categories)

    useEffect(() => {
        if (error) {
            return toast.error(error, { position: "bottom-center" });
        }
        dispatch(getProducts({ keyword, category }));

    }, [error, dispatch, keyword, category])

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                    <h1 id="products_heading">Search Products</h1>

                    <section id="products" className="product_container mt-5">
                        <div className="row product_container">
                            {/* <div className="col-md-2 mb-3"> */}
                                {/* Category Filter */}
                                {/* <div className="mt-3">
                                    <h4 className="mb-3 mr-2">Categories</h4>
                                    <ul className="list-unstyled">
                                        {categories.map((items, index) =>
                                            <li
                                                className="mb-3"
                                                style={{
                                                    cursor: "pointer"
                                                }}

                                                key={index}
                                                onClick={() => {
                                                    setCategory(items)
                                                }}
                                            >
                                                {items}
                                            </li>

                                        )}

                                    </ul>
                                </div> */}
                            {/* </div> */}


                            <div className=" col-md-12 ">
                                <div className="row">
                                    {/* 
                                    {products && products.map(product => (

                                        <Product key={product._id} product={product} />

                                    ))} */}

                                    <Product products={products} />
                                </div>
                            </div>

                        </div>
                    </section>
                </Fragment>
            }
        </Fragment>
    )
}

export default ProductSearch
