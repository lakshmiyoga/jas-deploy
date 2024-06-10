// import React, { Fragment, useEffect, useState } from 'react'
// import MetaData from './Layouts/MetaData'
// import { getProducts } from '../actions/productsActions'
// import { useDispatch, useSelector } from 'react-redux'
// import Loader from './Layouts/Loader'
// import { toast } from 'react-toastify';
// import { getProduct } from '../actions/productAction'
// import { useParams } from 'react-router-dom'
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
// import Contact from '../components/Layouts/Contact';
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

//     const dispatch = useDispatch();
//     const { products, loading, error } = useSelector((state) => state.productsState)



//     return (
//         <Fragment>
//             {/* <Router> */}
//            {/* <div className="container container-fluid"> */}
//             <ToastContainer theme="dark" />
//             <Header/>
//             {/* <Routes> */}
//               <Route path='/' element={<LandingPage />}></Route>
//               {/* <Route path='/allProducts' element={<Home />} ></Route> */}
//               <Route path='/vegetables' element={<Vegetables />} ></Route>
//               <Route path='/fruits' element={<Fruits />} ></Route>
//               <Route path='/keerai' element={<Keerai />} ></Route>
//               <Route path='/about' element={<About />} ></Route>
//               <Route path='/contact' element={<Contact />} ></Route>
//                {/* <Route path='/' element={<Home />} ></Route> */}
//               <Route path='/search/:keyword' element={<ProductSearch />}></Route>
//               <Route path='/product/:id' element={<ProductDetail />}></Route>
              
//               <Route path='/myProfile' element={<ProtectedRoute><Profile/></ProtectedRoute>}></Route>
//               <Route path='/myProfile/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>}></Route>
//               <Route path='/myProfile/update/password' element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>}></Route>
//               <Route path='/password/forgot' element={<ForgotPassword />}></Route>
//               <Route path='/password/reset/:token' element={<ResetPassword />}></Route>
//               <Route path='/cart' element={<Cart />}></Route>
//               <Route path='/shipping' element={<Shipping/>}></Route>
//               <Route path='/order/confirm' element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute>}></Route>
//             {/* </Routes> */}
//           {/* </div> */}

//           {/* Admin Routes */}
//           {/* <Routes> */}
//           <Route path='/admin/dashboard' element={ <ProtectedRoute isAdmin={true}><Dashboard/></ProtectedRoute> } />
//           <Route path='/admin/products' element={ <ProtectedRoute isAdmin={true}><ProductList/></ProtectedRoute> } />
//           <Route path='/admin/products/create' element={ <ProtectedRoute isAdmin={true}><NewProduct/></ProtectedRoute> } />
//           <Route path='/admin/product/:id' element={ <ProtectedRoute isAdmin={true}><UpdateProduct/></ProtectedRoute> } />
//           {/* </Routes> */}
//           <Footer/>
//           {/* </Router> */}
//         </Fragment>
//     )
// }

// export default Home
