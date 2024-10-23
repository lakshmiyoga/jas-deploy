import './App.css';
import Footer from './components/Layouts/Footer';
import Header from './components/Layouts/Header';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate, Navigate, matchPath } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './components/Product/ProductDetail';
import ProductSearch from './components/Product/ProductSearch';
import Login from './components/user/Login';
import Register from './components/user/Register';
import { useEffect, useMemo, useState } from 'react';
import store from './store';
import { loadUser } from './actions/userActions';
import Dashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/route/ProtectedRoute';
import ProductList from './components/admin/ProductList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import Product from './components/Product/Product';
import LandingPage from './components/LandingPage';
import Vegetables from './components/Vegetables';
import Fruits from './components/Fruits';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import { getAdminProducts, getProducts } from './actions/productsActions';
import About from './components/Layouts/About';
import Keerai from './components/Keerai';
import TermsAndConditions from './components/Layouts/TermsAndConditions'
import PrivacyPolicy from './components/Layouts/PrivacyPolicy';
import RefundPolicy from './components/Layouts/RefundPolicy';
import Enquiry from './components/user/Enquiry';
import EnquiryRequest from './components/admin/EnquiryRequest';
import UserList from './components/admin/UserList';
import UpdateUser from './components/admin/UpdateUser';
import UpdatePrice from './components/admin/UpdatePrice';
import UserOrders from './components/order/UserOrders';
import OrderDetail from './components/order/OrderDetail';
import PaymentConfirm from './components/order/PaymentConfirm';
// import PaymentFailed from './components/order/FailedPayment';
// import FailedPayment from './components/order/FailedPayment';
import OrderList from './components/admin/OrderList';
import UpdateOrder from './components/admin/UpdateOrder';
// import Refund from './components/order/Refund';
import PaymentList from './components/admin/PaymentList';
import PaymentDetails from './components/order/PaymentDetails';
import OrderSummary from './components/order/OrderSummary';
import UserSummary from './components/admin/SummaryUser';
import SummaryUser from './components/admin/SummaryUser';
import ScrollToTop from './components/Layouts/ScrollToTop';
import Dispatch from './components/admin/Dispatch';
import RefundOrder from './components/admin/RefundOrder';
import DispatchList from './components/admin/DispatchList';
import RefundList from './components/admin/RefundList';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './components/Layouts/Loader';
import AllOrders from './components/admin/AllOrders';
import AdminOrderDetail from './components/admin/AdminOrderDetail';
import Analysis from './components/admin/Analysis';
import Unauthorized from './components/Layouts/Unauthorized';
import PageNotFound from './components/Layouts/PageNotFound';

function App() {
    const location = useLocation();
    // const navigate = useNavigate();
    // const redirectPath = sessionStorage.getItem('redirectPath') || location.pathname;
    const [email, setEmail] = useState("");
    // console.log("location path",location.pathname)
    // const redirectPath = useMemo(() => sessionStorage.getItem('redirectPath') || '/', []);

    // if (!redirectPath && !location) {
    //     navigate('/')
    //     sessionStorage.setItem('redirectPath', '/');
    // }
    // if(!redirectPath){
    //     sessionStorage.setItem('redirectPath', '/');
    // }
    // console.log("redirectPath", redirectPath);


    const { isAuthenticated, loading, user } = useSelector(state => state.authState);
    const { products, loading: productLoading } = useSelector((state) => state.productsState);
    const [openSide, setOpenSide] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const dispatch = useDispatch();
    const [userLoaded, setUserLoaded] = useState(false);
    console.log("isAuthenticated",isAuthenticated,user);
    console.log("userLoaded",userLoaded)

    useEffect(() => {
        const loadInitialData = async () => {
            await store.dispatch(loadUser());
            await store.dispatch(getProducts());
            setUserLoaded(true); // Set the flag once the user data is loaded
        };
        loadInitialData();
    }, [])

    useEffect(()=>{
          if(user && user.role === 'admin'){
                  dispatch(getAdminProducts());
          }
    },[user])

    // const validRoutes = [
    //     '/', '/login', '/register', '/vegetables', '/fruits', '/unauthorized', '/keerai', '/about', 
    //     '/enquiry', '/termsAndConditions', '/privacyPolicy', '/refundPolicy', '/search/:keyword', 
    //     '/product/:id', '/cart', '/password/forgot', '/password/reset/:token', '/myProfile', 
    //     '/myProfile/update', '/myProfile/update/password', '/shipping', '/orders', '/order/:id', 
    //     '/payment/:id', '/order/confirm', '/payment/confirm/:id', '/admin/dashboard', 
    //     '/admin/products', '/admin/products/create', '/admin/product/:id', '/admin/getenquiry', 
    //     '/admin/users', '/admin/payments', '/admin/dispatch/:id', '/admin/dispatch', 
    //     '/admin/refund/:id', '/admin/refund', '/admin/user/:id', '/admin/products/updateprice', 
    //     '/admin/orders', '/admin/analysis', '/admin/order/:id', '/admin/order-summary', 
    //     '/admin/user-summary', '/admin/allorders', '/admin/orderdetail/:id'
    // ];

    // useEffect(() => {
    //     const isValidRoute = validRoutes.some((route) => matchPath(route, location.pathname));

    //     if (!isValidRoute) {
    //         navigate('/page-not-found');
    //     }
    // }, [location.pathname, navigate]);



    // useEffect(() => {
    //     if (!isAuthenticated || !user && !userLoaded ) {
    //         const loadInitialData = async () => {
    //             await store.dispatch(loadUser());
    //             setUserLoaded(true); // Set the flag once the user data is loaded
    //         };
    //         loadInitialData();
    //     }
    //     if (!products) {
    //         store.dispatch(getProducts());
    //     }
    // }, [isAuthenticated, products, userLoaded]);
    

    
    useEffect(() => {
        if (!isAuthenticated || !user && userLoaded) {
            
                 store.dispatch(loadUser());
                // setUserLoaded(true); // Set the flag once the user data is loaded
         
        }
        if (!products) {
            store.dispatch(getProducts());
        }
    }, [isAuthenticated, products, userLoaded]);


    // let isAdminRoute = true;

    // useEffect(() => {
    //     if ( userLoaded) {
    //         // if (redirectPath) {
    //         // const redirectPath = sessionStorage.getItem('redirectPath') || '/';
    //         // return navigate(redirectPath);
    //         // const redirectPath = sessionStorage.getItem('redirectPath');
    //         if (redirectPath && location.pathname === redirectPath) {
    //             sessionStorage.removeItem('redirectPath');
    //             navigate(redirectPath, { replace: true });
    //         }
    //         // else if (redirectPath && location.pathname === redirectPath){
    //         //     sessionStorage.removeItem('redirectPath');
    //         //     navigate(redirectPath, { replace: true });
    //         // }
    //         // sessionStorage.removeItem('redirectPath');
    //         // }
    //     }
    //     // if (redirectPath) {
    //     //     const redirectPath = sessionStorage.getItem('redirectPath') || '/';
    //     //     return navigate(redirectPath);
    //     //     // sessionStorage.removeItem('redirectPath');
    //     // }
    //     // if (!isAuthenticated || !user) {
    //     //     navigate('/')
    //     // }

    //     // store.dispatch(loadUser());
    //     // store.dispatch(getProducts());
    // }, [ navigate, userLoaded]);

    
    // useEffect(() => {
    //     // const redirectPath = sessionStorage.getItem('redirectPath') || ;
    //     // console.log("redirectPath before navigation:", redirectPath);
    //     // console.log("location.pathname:", location.pathname);
    //     // const isPasswordResetRoute = location.pathname.includes("/password/reset");
        
    //     if (
    //         // isAuthenticated && 
    //         // user && 
    //         userLoaded
    //         //  || 
    //         //  isPasswordResetRoute
    //     ) {
    //         if (redirectPath && location.pathname === redirectPath) {
    //             sessionStorage.removeItem('redirectPath');
    //             console.log("Navigating to redirectPath:", redirectPath);
    //             navigate(redirectPath, { replace: true });
    //         }
    //     }
    // }, [isAuthenticated, navigate, userLoaded, user, location.pathname]);
    

    // useEffect(() => {
    //     if (!product) {
    //         store.dispatch(getProducts());
    //     }
    // }, [product]);



    // const isAdminRoute = location.pathname.includes('/admin') || (user && user.role === 'admin');
    const isAdminRoute = location.pathname.includes('/admin') || location.pathname.includes('/unauthorized') || location.pathname.includes('/page-not-found')

    // if (!userLoaded || loading) {
    //     return <Loader />;
    // }

    useEffect(() => {
        const handleScroll = () => {
            const headerElement = document.querySelector('.header');
            if (window.scrollY > 20) {
                headerElement && headerElement.classList.add('header-shadow');
            } else {
                headerElement && headerElement.classList.remove('header-shadow');
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`${openSide ? "App-blure" : isActive ? "App-blure" : "App"}`}>
            <HelmetProvider>
                {
                    productLoading || !userLoaded ? (
                        <div style={{minHeight:'100vh',minWidth:'100vw',position:'absolute',display:'flex',justifyContent:'center',alignItems:'center'}}>
                            <Loader />
                        </div>

                    )

                        : (
                            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                {/* <Header /> */}

                                <div className="header">
                                    {!isAdminRoute && <Header openSide={openSide} setOpenSide={setOpenSide} />}
                                </div>
                                <ScrollToTop />
                                <div className={isAdminRoute ? "" : openSide ? "content-blure" : isActive ? "content-blure" : "content"}>
                                    <Routes>
                                        {/* <Route path="/*" element={<Login />} /> */}
                                        <Route path="/login" element={<Login email={email} setEmail={setEmail} />} />
                                        <Route path="/register" element={<Register />} />
                                        {
                                            user  && user.role === "admin" ?
                                                <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard isActive={isActive} setIsActive={setIsActive}/></ProtectedRoute>} />
                                                // <Route path="/admin/dashboard" element={<LandingPage />} />
                                                :
                                                <Route path="/" element={<LandingPage />} />
                                        }
                                       <Route path="/" element={<LandingPage />} />
                                        
                                        {/* <Route path="/" element={<LandingPage />} /> */}
                                        <Route path="/vegetables" element={<Vegetables />} />
                                        <Route path="/fruits" element={<Fruits />} />
                                        <Route path="/unauthorized" element={<Unauthorized />} />
                                        <Route path="/keerai" element={<Keerai />} />
                                        <Route path="/about" element={<About />} />
                                        <Route path="/enquiry" element={<Enquiry />} />
                                        <Route path="/termsAndConditions" element={<TermsAndConditions />} />
                                        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                                        <Route path="/refundPolicy" element={<RefundPolicy />} />
                                        <Route path="/search/:keyword" element={<ProductSearch />} />
                                        <Route path="/product/:id" element={<ProductDetail />} />
                                        <Route path="/cart" element={<Cart />} />
                                        <Route path="/password/forgot" element={<ForgotPassword email={email} setEmail={setEmail} />} />
                                           <Route path="/password/reset/:token" element={<ResetPassword />} />

                                        <Route path="/myProfile" element={<ProtectedRoute isAdmin={false}><Profile /></ProtectedRoute>} />
                                        <Route path="/myProfile/update" element={<ProtectedRoute isAdmin={false}><UpdateProfile /></ProtectedRoute>} />
                                        <Route path="/myProfile/update/password" element={<ProtectedRoute isAdmin={false}><UpdatePassword /></ProtectedRoute>} />

                                        <Route path="/password/reset/:token" element={<ProtectedRoute isAdmin={false}><ResetPassword /></ProtectedRoute>} />

                                        <Route path="/shipping" element={<ProtectedRoute isAdmin={false} ><Shipping /></ProtectedRoute>} />
                                        {/* <Route path="/refund" element={<Refund />} /> */}
                                        <Route path="/orders" element={<ProtectedRoute isAdmin={false}><UserOrders /></ProtectedRoute>} />
                                        <Route path='/order/:id' element={<ProtectedRoute isAdmin={false}><OrderDetail /></ProtectedRoute>} />
                                        <Route path='/payment/:id' element={<ProtectedRoute isAdmin={false}><PaymentDetails /></ProtectedRoute>} />
                                        <Route path="/order/confirm" element={<ProtectedRoute isAdmin={false}><ConfirmOrder /></ProtectedRoute>} />
                                        <Route path="/payment/confirm/:id" element={<ProtectedRoute isAdmin={false}><PaymentConfirm /></ProtectedRoute>} />
                                        {/* {
                                    user && (
                                        <> */}

                                        <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductList isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path="/admin/products/create" element={<ProtectedRoute isAdmin={true}><NewProduct isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path="/admin/product/:id" element={<ProtectedRoute isAdmin={true}><UpdateProduct isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path="/admin/getenquiry" element={<ProtectedRoute isAdmin={true}><EnquiryRequest isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path='/admin/users' element={<ProtectedRoute isAdmin={true}><UserList isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path='/admin/payments' element={<ProtectedRoute isAdmin={true}><PaymentList isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path="/admin/dispatch/:id" element={<ProtectedRoute isAdmin={true}><Dispatch isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path="/admin/dispatch" element={<ProtectedRoute isAdmin={true}><DispatchList isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path="/admin/refund/:id" element={<ProtectedRoute isAdmin={true}><RefundOrder isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path="/admin/refund" element={<ProtectedRoute isAdmin={true}><RefundList isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path='/admin/user/:id' element={<ProtectedRoute isAdmin={true}><UpdateUser isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path='/admin/products/updateprice' element={<ProtectedRoute isAdmin={true}><UpdatePrice isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path='/admin/orders' element={<ProtectedRoute isAdmin={true}><OrderList isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path='/admin/analysis' element={<ProtectedRoute isAdmin={true}><Analysis isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path='/admin/order/:id' element={<ProtectedRoute isAdmin={true}><UpdateOrder isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path='/admin/order-summary' element={<ProtectedRoute isAdmin={true}><OrderSummary isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path='/admin/user-summary' element={<ProtectedRoute isAdmin={true}><SummaryUser isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path='/admin/allorders' element={<ProtectedRoute isAdmin={true}><AllOrders isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path='/admin/orderdetail/:id' element={<ProtectedRoute isAdmin={true}><AdminOrderDetail isActive={isActive} setIsActive={setIsActive} /></ProtectedRoute>} />
                                        <Route path="*" element={<Navigate to="/page-not-found" replace />} />
                                        <Route path="/page-not-found" element={<PageNotFound />} />
                                        {/* </>
                                        
                                    )

                                } */}

                                    </Routes>
                                    {!isAdminRoute && <Footer className='footer' />}
                                    <ToastContainer theme="dark" />

                                </div>

                                {/* {!isAdminRoute && <Header/>} */}


                                {/* <Footer /> */}
                            </div>
                        )
                }


            </HelmetProvider>
        </div>
    );
}

function RootApp() {

    // useEffect(() => {
    //     store.dispatch(loadUser());
    // }, [])
    return (
        <Router>
            <App />
        </Router>
    );
}

export default RootApp;
