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
import CarouselLayout from './Layouts/CarouselLayout'



const Categories = () => {
  const location = useLocation();
//   sessionStorage.setItem('redirectPath', location.pathname);
  const { category } = location.state ;
  // const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.productsState);
  console.log(products);
  console.log("category",category);
  const [keyword, setKeyword] = useState("")

  const filterCategories = products ? products.filter((product) => product.category === category) : [];
  // console.log(vegetables);
  const searchCategory = keyword ? filterCategories.filter((filterCategory) => filterCategory.englishName.toLowerCase().includes(keyword.toLowerCase())) : filterCategories;
  console.log(searchCategory);


  // Sort the filtered vegetables in ascending order by name
  //  const sortedVegetables = filteredVegetable.sort();
  const sortedCategories = searchCategory.sort((a, b) => a.englishName.localeCompare(b.englishName));

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

          <div className="products_heading">{category}</div>
          <div className="search-responsive col-12 col-md-6 mt-2 mt-md-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minWidth: '100%', height: 'auto', flexDirection: 'column',margin:'0px',padding:'0px',overflowX:'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'row', position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Search keyword={keyword} setKeyword={setKeyword} />
            </div>
            
            {/* <div style={{ display: 'flex', flexDirection: 'row', position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
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
            </div> */}
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',position:'relative',maxWidth:'100vw',height:'auto',marginTop:'30px',overflowX:'hidden'}}>
            <CarouselLayout category={category}/>
            </div>
          </div>
          {
            sortedCategories.length === 0 ? (
              <h2 style={{ textAlign: 'center' }}>Product not found</h2>
            ) : (
              <section id="products" className="container">
                <div className="row">
                  {/* {vegetable && vegetable.map(product => (

                                        <Product key={product._id} product={product} />

                                    ))} */}
                  <Product products={sortedCategories} category={category} />

                </div>
              </section>
            )
          }

        </Fragment>
      }
    </Fragment>
  )
}

export default Categories