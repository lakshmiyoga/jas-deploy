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
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';




const Fruits = () => {
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const { category } = location.state || { category: 'Fruits' };
    // const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.productsState);
    const [keyword, setKeyword] = useState("")
    console.log("category",category)

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

    // Sort the filtered fruits in ascending order by name
    const sortedFruits = filteredFruits.sort((a, b) => a.englishName.localeCompare(b.englishName));

    return (
        <Fragment>
            {/* <Header/> */}
            {loading ? <Loader /> :
                <Fragment>
                    {/* <MetaData title={'Fruits'} /> */}
                    <MetaData
                        title="Fresh Fruits"
                        description="Discover a wide variety of fresh Fruits at our store. Search, filter, and explore organic and high-quality Fruits to add to your shopping cart."
                    />
                    <div className="products_heading">Fruits</div>
                    {/* <div className=" search-responsive col-12 col-md-6 mt-2 mt-md-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minWidth: '100%', height: 'auto' }}>
                        <Search keyword={keyword} setKeyword={setKeyword} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop:'20px' }}>
                            <Link to="/vegetables">
                                <Card style={{ width: '100px', marginRight:'15px' }}>
                                    <Card.Img  style={{ height: '50px', width: '99px' }} src='../images/vegetables.jpg' />
                                </Card>
                            </Link>

                            <Link to="/keerai">
                                <Card style={{ width: '100px' }}>
                                    <Card.Img  style={{ height: '50px', width: '96px' }} src='../images/celeries.jpg' />
                                   
                                </Card>
                            </Link>
                        </div>

                    </div> */}
                   <div className=" search-responsive col-12 col-md-6 mt-2 mt-md-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minWidth: '100%', height: 'auto', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Search keyword={keyword} setKeyword={setKeyword} />
                        </div>

                        {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginTop:'20px' }}>
                            <Link to="/fruits">
                                <Card style={{ width: '100px', marginRight:'15px' }}>
                                    <Card.Img  style={{ height: '50px', width: '99px' }} src='../images/fruits.jpg' />
                                    
                                </Card>
                            </Link>

                            <Link to="/keerai">
                                <Card style={{ width: '100px' }}>
                                    <Card.Img  style={{ height: '50px', width: '96px' }} src='../images/celeries.jpg' />
                                   
                                </Card>
                            </Link>
                        </div> */}
                        <div style={{ display: 'flex', flexDirection: 'row', position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                        <div className="card card-vegetbles  col-sm-2 col-md-2 col-lg-2 my-2 landingpage-card-vegetables">
                                <Link to="/vegetables" state={{ category: 'Vegetables' }} style={{ textDecoration: 'none' }}>
                                <div className="square-card">
                                        <div className="card-content">
                                            <img
                                                className="card-img-top-vegetable"
                                                src="../images/vegetables.jpg"
                                                alt="celeries"
                                            />
                                            <div className="card-title-vegetable">Vegetables</div>
                                            
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="card card-vegetbles col-sm-2 col-md-2 col-lg-2 my-2 landingpage-card-vegetables ">
                                <Link to="/keerai" state={{ category: 'Keerai' }} style={{ textDecoration: 'none' }}>
                                <div className="square-card">
                                        <div className="card-content">
                                            <img
                                                className="card-img-top-vegetable"
                                                src="../images/products/arai_keerai.jpg"
                                                alt="fruits"
                                            />
                                      
                                            <div className="card-title-vegetable">Keerai</div>
                                            
                                        </div>

                                    </div>
                                </Link>
                            </div>
                           
                        </div>


                    </div>

                    {
                        sortedFruits.length === 0 ? (
                            <h2 style={{ textAlign: 'center' }}>Product not found</h2>
                        ) : (
                            <section id="products" className="container">
                                <div className="row">
                                    {/* {fruits && fruits.map(product => (

                                        <Product key={product._id} product={product} />

                                    ))} */}
                                    <Product products={sortedFruits} category={category} />

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