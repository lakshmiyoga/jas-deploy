import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './Layouts/MetaData'
import { getProducts } from '../actions/productsActions'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Layouts/Loader'
import Product from './Product/Product'
import { toast } from 'react-toastify';
import Search from './Layouts/Search'
import Header from './Layouts/Header'


const Keerai = () => {
    const { products, loading, error } = useSelector((state) => state.productsState);
    const [keyword, setKeyword] = useState("")

    console.log(products);

    //     useEffect(() => {
    //         if (error) {
    //             return toast.error(error, { position: "bottom-center" });
    //         }
    //         dispatch(getProducts());

    //     }, [error, dispatch])


    const Keeraigal = products ? products.filter((product) => product.category === 'Keerai') : [];
    const filteredKeerai = keyword ? Keeraigal.filter((Keerai) => Keerai.englishName.toLowerCase().includes(keyword.toLowerCase())) : Keeraigal;
     console.log(filteredKeerai);

    return (
        <Fragment>
            {/* <Header/> */}
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                    <div className="products_heading">Keerai</div>
                    <div className="col-12 col-md-6 mt-2 mt-md-0">
                        <Search keyword={keyword} setKeyword={setKeyword}/>
                    </div>
                    {
                        filteredKeerai.length === 0 ? (
                            <h2 style={{ textAlign: 'center' }}>Product not found</h2>
                        ) : (
                            <section id="products" className="container mt-5">
                                <div className="row">
                                    {/* {vegetable && vegetable.map(product => (

                                        <Product key={product._id} product={product} />

                                    ))} */}
                                    <Product products={filteredKeerai} />

                                </div>
                            </section>
                        )
                    }

                </Fragment>
            }
        </Fragment>
    )
}

export default Keerai
