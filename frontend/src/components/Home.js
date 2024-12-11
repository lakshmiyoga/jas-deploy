


// import React, { Fragment, useEffect, useState } from 'react'
// import MetaData from './Layouts/MetaData'
// import { getProducts } from '../actions/productsActions'
// import { useDispatch, useSelector } from 'react-redux'
// import Loader from './Layouts/Loader'
// import { toast } from 'react-toastify';
// import { getProduct } from '../actions/productAction'
// import { Link, useParams } from 'react-router-dom'
// import Dashboard from '../components/admin/Dashboard';
// import ProtectedRoute from '../components/route/ProtectedRoute';
// import ProductList from '../components/admin/ProductList';
// import NewProduct from '../components/admin/NewProduct';
// import UpdateProduct from '../components/admin/UpdateProduct';
// import Product from '../components/Product/Product';
// import LandingPage from '../components/LandingPage';
// import Vegetables from '../components/Vegetables';
// import Fruits from '../components/Fruits';
// import Profile from '../components/user/Profile';
// import UpdateProfile from '../components/user/UpdateProfile';
// import UpdatePassword from '../components/user/UpdatePassword';
// import ForgotPassword from '../components/user/ForgotPassword';
// import ResetPassword from '../components/user/ResetPassword';
// import Cart from '../components/cart/Cart';
// import Shipping from '../components/cart/Shipping';
// import ConfirmOrder from '../components/cart/ConfirmOrder';
// import About from '../components/Layouts/About';
// // import Contact from '../components/Layouts/Contact';
// import Keerai from '../components/Keerai';
// import Footer from '../components/Layouts/Footer';
// import Header from '../components/Layouts/Header';
// import { ToastContainer } from "react-toastify";
// import ProductDetail from '../components/Product/ProductDetail';
// import ProductSearch from '../components/Product/ProductSearch';

// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
// } from "react-router-dom";


// const Home = () => {
//     const { products, loading, error } = useSelector((state) => state.productsState);
//     const { getcategory } = useSelector((state) => state.categoryState);
//     const { user, loading } = useSelector(state => state.authState);
  
//     const categories = [
//         {
//           _id: "1",
//           name: "Fruits & Vegetables",
//           type: "Fresh",
//           image: "/images/jas-fruits.jpeg",
//           category: "Fresh",
//         },
//         {
//           _id: "2",
//           name: "Monthly Groceries",
//           type: "Groceries",
//           image: "/images/jas-groceries.jpeg",
//           category: "Groceries",
//         },
//       ];

//       return (
//         <div>
//         {/* <Header/> */}
  
//         <div className="products_heading">Home</div>
  
//         {/* <MetaData title={'Jas Home'} /> */}
//         <MetaData
//           title="Jas Home"
//           description="Discover a wide variety of fresh fruits,vegetables and keerai at our store. Search, filter, and explore organic and high-quality fruits, vegetables and keerai to add to your shopping cart."
//         />
//         <div className="container " style={{ marginTop: '60px' }}>
  
//           {
//             loading ? <Loader /> : (
  
//               <div className="row d-flex justify-content-center">
//                 {categories && categories.map((categoryItem) => (
//                   <div key={categoryItem._id} className="col-6 col-xs-5 col-sm-6 col-md-4 col-lg-3 my-3 landingpage-category-card ">
//                     <Link
//                       to={`/categories/${categoryItem.category}`} // Dynamic link based on category name
//                       state={{categoryItem:categoryItem }}
//                       style={{ textDecoration: 'none' }}
//                     >
//                       <div className="card p-1 rounded">
//                         <div className="d-flex justify-content-center align-items-center square-card">
//                           <div className="card-content">
//                           {categoryItem.image ? (
//                             <img
//                               className="card-img-top-homepage"
//                               src={categoryItem.image} // Adjust if the image path differs
//                               alt={categoryItem.name}
//                             />
//                           ) : (
//                             <div className="card-img-top-homepage">No Image</div>
//                           )}
//                           <div className="card-body d-flex flex-column">
//                           <h3 className="card-title-homepage">{categoryItem.name}</h3>
//                           {/* {categoryItem.description && (
//                             <p className="card-title-vegetable">{categoryItem.description}</p>
//                           )} */}
//                         </div>
//                         </div>
//                           </div>
                         
//                       </div>
//                     </Link>
//                   </div>
//                 ))}
//               </div>
  
  
  
//             )
//           }
  
//         </div>
  
//       </div>
//       )
// }

// export default Home

import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MetaData from './Layouts/MetaData';

const Home = () => {
  const { user } = useSelector((state) => state.authState);

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
      <div className="products_heading">Home</div>
      <MetaData
        title="Jas Home"
        description="Discover a wide variety of fresh fruits, vegetables, and keerai at our store. Search, filter, and explore organic and high-quality fruits, vegetables, and keerai to add to your shopping cart."
      />
      <div className="container" style={{ marginTop: '60px' }}>
        <div className="row d-flex justify-content-center">
          {categories && categories.map((categoryItem) => {
            // Display the Groceries card only if user exists and is admin
            if (
              categoryItem.category === "Groceries" &&
              (!user || user.role !== "admin")
            ) {
              return null;
            }

            return (
              <div
                key={categoryItem._id}
                className="col-6 col-xs-5 col-sm-6 col-md-4 col-lg-3 my-3 landingpage-category-card"
              >
                <Link
                  to={`/categories/${categoryItem.category}`}
                  state={{ categoryItem: categoryItem }}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="card p-1 rounded">
                    <div className="d-flex justify-content-center align-items-center square-card">
                      <div className="card-content">
                        {categoryItem.image ? (
                          <img
                            className="card-img-top-homepage"
                            src={categoryItem.image}
                            alt={categoryItem.name}
                          />
                        ) : (
                          <div className="card-img-top-homepage">No Image</div>
                        )}
                        <div className="card-body d-flex flex-column">
                          <h3 className="card-title-homepage">{categoryItem.name}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
