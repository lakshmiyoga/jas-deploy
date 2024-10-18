import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './Layouts/MetaData'
import { getProducts } from '../actions/productsActions'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Layouts/Loader'
import Product from './Product/Product'
import { toast } from 'react-toastify';
import Search from './Layouts/Search'
import Header from './Layouts/Header'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';

const Keerai = () => {
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
  const { category } = location.state || { category: 'Keerai' };
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

     // Sort the filtered keerai in ascending order by name
    const sortedKeerai = filteredKeerai.sort((a, b) => a.englishName.localeCompare(b.englishName));

    return (
        <Fragment>
            {/* <Header/> */}
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                    <div className="products_heading">Keerai</div>
                    {/* <div className=" search-responsive col-12 col-md-6 mt-2 mt-md-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minWidth: '100%', height: 'auto' }}>
                        <Search keyword={keyword} setKeyword={setKeyword} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop:'20px' }}>
                            <Link to="/fruits">
                                <Card style={{ width: '100px', marginRight:'15px' }}>
                                    <Card.Img  style={{ height: '50px', width: '99px' }} src='../images/fruits.jpg' />
                                    
                                </Card>
                            </Link>

                            <Link to="/vegetables">
                                <Card style={{ width: '100px' }}>
                                    <Card.Img  style={{ height: '50px', width: '96px' }} src='../images/vegetables.jpg' />
                                   
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
                        <div style={{ display: 'flex', flexDirection: 'row', position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center',marginTop:'20px' }}>
                        <div className="card card-vegetbles col-sm-2 col-md-2 col-lg-2 my-2 landingpage-card-vegetables">
                                <Link to="/vegetables" state={{ category: 'Vegetables' }} style={{ textDecoration: 'none' }}>
                                <div className="square-card">
                                        <div className="card-content">
                                            <img
                                                className="card-img-top-vegetable "
                                                src="../images/vegetables.jpg"
                                                alt="celeries"
                                            />
                                             <div className="card-title-vegetable">Vegetables</div>
                                        </div>
                                           
                                         
                                    </div>
                                </Link>
                            </div>
                            <div className="card card-vegetbles col-sm-2 col-md-2 col-lg-2 my-2 landingpage-card-vegetables">
                                <Link to="/fruits" state={{ category: 'Fruits' }} style={{ textDecoration: 'none' }}>
                                <div className="square-card">
                                        <div className="card-content">
                                            <img
                                                className="card-img-top-vegetable"
                                                src="../images/fruits.jpg"
                                                alt="fruits"
                                            />
                                              <div className="card-title-vegetable">Fruits</div>
                                        </div>
                                          
                                    </div>
                                </Link>
                            </div>
                           
                        </div>


                    </div>
                    {
                        sortedKeerai.length === 0 ? (
                            <h2 style={{ textAlign: 'center' }}>Product not found</h2>
                        ) : (
                            <section id="products" className="container">
                                <div className="row">
                                    {/* {vegetable && vegetable.map(product => (

                                        <Product key={product._id} product={product} />

                                    ))} */}
                                    <Product products={sortedKeerai} category={category} />

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
