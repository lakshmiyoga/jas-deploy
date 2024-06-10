import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './Layouts/MetaData'
import { getProducts } from '../actions/productsActions'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Layouts/Loader'
import Product from './Product/Product'
import { toast } from 'react-toastify';
import Search from './Layouts/Search'
import Header from './Layouts/Header'
import Footer from './Layouts/Footer'




const Fruits = () => {

    // const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.productsState);
    const [keyword, setKeyword] = useState("")

    // useEffect(() => {
    //     if (error) {
    //         return toast.error(error, { position: "bottom-center" });
    //     }
    //     dispatch(getProducts());

    // }, [error, dispatch])
   

    const fruits = products ? products.filter((product) => product.category === 'Fruits') : [];
    // console.log(fruits);
    const filteredFruits = keyword ? fruits.filter((fruit) => fruit.englishName.toLowerCase().includes(keyword.toLowerCase())) : fruits;
     console.log(filteredFruits);
    return (
        <Fragment>
            {/* <Header/> */}
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                    <div className="products_heading">Fruits</div>
                    <div className="col-12 col-md-6 mt-2 mt-md-0">
                        <Search keyword={keyword} setKeyword={setKeyword}/>
                    </div>
                    {
                        filteredFruits.length === 0 ? (
                            <h2 style={{textAlign:'center'}}>Product not found</h2>
                        ) : (
                            <section id="products" className="container mt-5">
                                <div className="row">
                                    {/* {fruits && fruits.map(product => (

                                        <Product key={product._id} product={product} />

                                    ))} */}
                                    <Product products={filteredFruits} />

                                </div>
                            </section>
                        )
                    }

                </Fragment>
            }
            {/* <Footer/> */}
        </Fragment>
    )
}

export default Fruits
