



// import React, { useEffect } from 'react';
// import { Link, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import Loader from './Layouts/Loader';
// import MetaData from './Layouts/MetaData';
// import { getCategories } from '../actions/categoryAction';

// const Home = () => {
//     const dispatch = useDispatch();
//     const location = useLocation();
//     const { category, type } = location.state || {}; // Get category and type from the location state
//     const { loading, error } = useSelector((state) => state.productsState);
//     const { getcategory } = useSelector((state) => state.categoryState);  // List of categories

//     useEffect(() => {
//         if (!getcategory) {
//             dispatch(getCategories()); // Fetch categories if they are not already loaded
//         }
//     }, [dispatch, getcategory]);

//     // Filter categories based on the type
//     const filteredCategories = getcategory?.filter((categoryItem) => categoryItem.type === type);
//     // const filteredCategories = getcategory?.filter(
//     //     (categoryItem) => categoryItem.type?.toLowerCase() === type?.toLowerCase()
//     // );


//     console.log("filteredCategories", filteredCategories)

//     return (
//         <div>
//             <div className="products_heading">{type}</div>
//             <MetaData
//                 title="Jas Home"
//                 description="Discover a wide variety of fresh fruits, vegetables, and keerai at our store. Search, filter, and explore organic and high-quality fruits, vegetables, and keerai to add to your shopping cart."
//             />
//             <div className="container" style={{ marginTop: '60px' }}>

//                 {
//                     loading ? <Loader /> : (
//                         <div className="row d-flex justify-content-center">
//                             {/* {filteredCategories && filteredCategories.length > 0 ? (
//                                 filteredCategories.map((categoryItem) => (
//                                     <div key={categoryItem._id} className="col-6 col-xs-5 col-sm-6 col-md-4 col-lg-3 my-3 landingpage-category-card">
//                                         <Link
//                                             to={`/categories/${categoryItem.category}`}  // Dynamic link based on category name
//                                             state={{ category: categoryItem.category, type: categoryItem.type }}  // Pass category and type as state
//                                             style={{ textDecoration: 'none' }}
//                                         >
//                                             <div className="card p-1 rounded">
//                                                 <div className="d-flex justify-content-center align-items-center square-card">
//                                                     <div className="card-content">
//                                                         {categoryItem.images && categoryItem.images.length > 0 ? (
//                                                             <img
//                                                                 className="card-img-top-vegetable"
//                                                                 src={categoryItem.images[0].image}  // Display first image from the images array
//                                                                 alt={categoryItem.name}
//                                                             />
//                                                         ) : (
//                                                             <div className="card-img-top-vegetable">No Image</div>
//                                                         )}
//                                                         <div className="card-body d-flex flex-column">
//                                                             <h3 className="card-title-vegetable">{categoryItem.category}</h3>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </Link>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p>No products available for this category type.</p>  // If no categories match the selected type
//                             )} */}

//                             {filteredCategories && filteredCategories.length > 0 ? (
//                                 filteredCategories.map((categoryItem) => (
//                                     <div key={categoryItem._id} className="col-6 col-xs-5 col-sm-6 col-md-4 col-lg-3 my-3 landingpage-category-card">
//                                         <Link
//                                             to={`/categories/${categoryItem.category}`}
//                                             state={{ category: categoryItem.category, type: categoryItem.type }}
//                                             style={{ textDecoration: 'none' }}
//                                         >
//                                             <div className="card p-1 rounded">
//                                                 <div className="d-flex justify-content-center align-items-center square-card">
//                                                     <div className="card-content">
//                                                         {categoryItem.images?.length > 0 ? (
//                                                             <img
//                                                                 className="card-img-top-vegetable"
//                                                                 src={categoryItem.images[0]?.image || ''}
//                                                                 alt={categoryItem.name}
//                                                             />
//                                                         ) : (
//                                                             <div className="card-img-top-vegetable">No Image</div>
//                                                         )}
//                                                         <div className="card-body d-flex flex-column">
//                                                             <h3 className="card-title-vegetable">{categoryItem.category}</h3>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </Link>
//                                     </div>
                                    
//                                 ))
//                             ) : (
//                                 <p>No products available for this category type.</p>
//                             )}

//                         </div>
//                     )
//                 }

//             </div>
//         </div>
//     );
// };

// export default Home;


import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './Layouts/MetaData'
import { getProducts } from '../actions/productsActions'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Layouts/Loader'
import { toast } from 'react-toastify';
import { getProduct } from '../actions/productAction'
import { Link, useParams } from 'react-router-dom'
import Dashboard from '../components/admin/Dashboard';
import ProtectedRoute from '../components/route/ProtectedRoute';
import ProductList from '../components/admin/ProductList';
import NewProduct from '../components/admin/NewProduct';
import UpdateProduct from '../components/admin/UpdateProduct';
import Product from '../components/Product/Product';
import LandingPage from '../components/LandingPage';
import Vegetables from '../components/Vegetables';
import Fruits from '../components/Fruits';
import Profile from '../components/user/Profile';
import UpdateProfile from '../components/user/UpdateProfile';
import UpdatePassword from '../components/user/UpdatePassword';
import ForgotPassword from '../components/user/ForgotPassword';
import ResetPassword from '../components/user/ResetPassword';
import Cart from '../components/cart/Cart';
import Shipping from '../components/cart/Shipping';
import ConfirmOrder from '../components/cart/ConfirmOrder';
import About from '../components/Layouts/About';
// import Contact from '../components/Layouts/Contact';
import Keerai from '../components/Keerai';
import Footer from '../components/Layouts/Footer';
import Header from '../components/Layouts/Header';
import { ToastContainer } from "react-toastify";
import ProductDetail from '../components/Product/ProductDetail';
import ProductSearch from '../components/Product/ProductSearch';

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";


const Home = () => {
    const { products, loading, error } = useSelector((state) => state.productsState);
    const { getcategory } = useSelector((state) => state.categoryState);
  
    const categories = [
        {
          _id: "1",
          name: "Fruits & Vegetables",
          type: "Fresh",
          image: "/images/jas-fruits.jpeg",
          category: "Fresh",
        },
        {
          _id: "2",
          name: "Monthly Groceries",
          type: "Groceries",
          image: "/images/jas-groceries.jpeg",
          category: "Groceries",
        },
      ];

      return (
        <div>
        {/* <Header/> */}
  
        <div className="products_heading">Home</div>
  
        {/* <MetaData title={'Jas Home'} /> */}
        <MetaData
          title="Jas Home"
          description="Discover a wide variety of fresh fruits,vegetables and keerai at our store. Search, filter, and explore organic and high-quality fruits, vegetables and keerai to add to your shopping cart."
        />
        <div className="container " style={{ marginTop: '60px' }}>
  
          {
            loading ? <Loader /> : (
  
              <div className="row d-flex justify-content-center">
                {categories && categories.map((categoryItem) => (
                  <div key={categoryItem._id} className="col-6 col-xs-5 col-sm-6 col-md-4 col-lg-3 my-3 landingpage-category-card ">
                    <Link
                      to={`/categories/${categoryItem.category}`} // Dynamic link based on category name
                      state={{categoryItem:categoryItem }}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="card p-1 rounded">
                        <div className="d-flex justify-content-center align-items-center square-card">
                          <div className="card-content">
                          {categoryItem.image ? (
                            <img
                              className="card-img-top-homepage"
                              src={categoryItem.image} // Adjust if the image path differs
                              alt={categoryItem.name}
                            />
                          ) : (
                            <div className="card-img-top-homepage">No Image</div>
                          )}
                          <div className="card-body d-flex flex-column">
                          <h3 className="card-title-homepage">{categoryItem.name}</h3>
                          {/* {categoryItem.description && (
                            <p className="card-title-vegetable">{categoryItem.description}</p>
                          )} */}
                        </div>
                        </div>
                          </div>
                         
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
  
  
  
            )
          }
  
        </div>
  
      </div>
      )
}

export default Home
