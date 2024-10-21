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



const Vegetables = () => {
  const location = useLocation();
  sessionStorage.setItem('redirectPath', location.pathname);
  const { category } = location.state || { category: 'Vegetables' };
  // const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.productsState);
  console.log(products);
  const [keyword, setKeyword] = useState("")

  //     useEffect(() => {
  //         if (error) {
  //             return toast.error(error, { position: "bottom-center" });
  //         }
  //         dispatch(getProducts());

  //     }, [error, dispatch])


  const vegetables = products ? products.filter((product) => product.category === 'Vegetables') : [];
  // console.log(vegetables);
  const filteredVegetable = keyword ? vegetables.filter((vegetable) => vegetable.englishName.toLowerCase().includes(keyword.toLowerCase())) : vegetables;
  console.log(filteredVegetable);


  // Sort the filtered vegetables in ascending order by name
  //  const sortedVegetables = filteredVegetable.sort();
  const sortedVegetables = filteredVegetable.sort((a, b) => a.englishName.localeCompare(b.englishName));

  return (
    <Fragment>
      {/* <Header/> */}
      {loading ? <Loader /> :
        <Fragment>
          {/* <MetaData title={'Vegetables'} /> */}
          <MetaData
            title="Fresh Vegetables"
            description="Discover a wide variety of fresh vegetables at our store. Search, filter, and explore organic and high-quality vegetables to add to your shopping cart."
          />

          <div className="products_heading">Vegetables</div>
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
              {/* Fruits Card */}
              <div className="card card-vegetbles  col-sm-2 col-md-2 col-lg-2 my-2 landingpage-card-vegetables">
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

              {/* Keerai Card */}
              <div className="card card-vegetbles  col-sm-2 col-md-2 col-lg-2 my-2 landingpage-card-vegetables">
                <Link to="/keerai" state={{ category: 'Keerai' }} style={{ textDecoration: 'none' }}>
                  <div className="square-card">
                    <div className="card-content">
                      <img
                        className="card-img-top-vegetable"
                        src="../images/products/arai_keerai.jpg"
                        alt="keerai"
                      />
                      <div className="card-title-vegetable">Keerai</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>




          </div>
          {
            sortedVegetables.length === 0 ? (
              <h2 style={{ textAlign: 'center' }}>Product not found</h2>
            ) : (
              <section id="products" className="container">
                <div className="row">
                  {/* {vegetable && vegetable.map(product => (

                                        <Product key={product._id} product={product} />

                                    ))} */}
                  <Product products={sortedVegetables} category={category} />

                </div>
              </section>
            )
          }

        </Fragment>
      }
    </Fragment>
  )
}

export default Vegetables