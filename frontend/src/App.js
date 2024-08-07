import './App.css';
import Footer from './components/Layouts/Footer';
import Header from './components/Layouts/Header';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './components/Product/ProductDetail';
import ProductSearch from './components/Product/ProductSearch';
import Login from './components/user/Login';
import Register from './components/user/Register';
import { useEffect } from 'react';
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
import { getProducts } from './actions/productsActions';
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

function App() {
    const location = useLocation();

    useEffect(() => {
        store.dispatch(loadUser());
        store.dispatch(getProducts());
    }, []);

    return (
        <div className="App">
            <HelmetProvider>
                <Header />
                <ScrollToTop/>
                <Routes>
               
                    {/* <Route path="/*" element={<Login />} /> */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/vegetables" element={<Vegetables />} />
                    <Route path="/fruits" element={<Fruits />} />
                    <Route path="/keerai" element={<Keerai />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/enquiry" element={<Enquiry />} />
                    <Route path="/termsAndConditions" element={<TermsAndConditions />} />
                    <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                    <Route path="/refundPolicy" element={<RefundPolicy />} />
                    <Route path="/search/:keyword" element={<ProductSearch />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/myProfile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/myProfile/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
                    <Route path="/myProfile/update/password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
                    <Route path="/password/forgot" element={<ForgotPassword />} />
                    <Route path="/password/reset/:token" element={<ResetPassword />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/shipping" element={<Shipping />} />
                    {/* <Route path="/refund" element={<Refund />} /> */}
                    <Route path="/orders" element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
                    <Route path='/order/:id' element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                    <Route path='/payment/:id' element={<ProtectedRoute><PaymentDetails /></ProtectedRoute>} />
                    <Route path="/order/confirm" element={<ConfirmOrder />} />
                    <Route path="/payment/confirm/:id" element={<PaymentConfirm />} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
                    <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>} />
                    <Route path="/admin/products/create" element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} />
                    <Route path="/admin/product/:id" element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} />
                    <Route path="/getenquiry" element={<ProtectedRoute isAdmin={true}><EnquiryRequest /></ProtectedRoute>} />
                    <Route path='/admin/users' element={<ProtectedRoute isAdmin={true}><UserList /></ProtectedRoute>} />
                    <Route path='/admin/payments' element={<ProtectedRoute isAdmin={true}><PaymentList /></ProtectedRoute>} />
                    <Route path="/admin/dispatch/:id" element={<ProtectedRoute isAdmin={true}><Dispatch/></ProtectedRoute>} />
                    <Route path="/admin/dispatch" element={<ProtectedRoute isAdmin={true}><DispatchList/></ProtectedRoute>} />
                    <Route path="/admin/refund/:id" element={<ProtectedRoute isAdmin={true}><RefundOrder /></ProtectedRoute>} />
                    <Route path="/admin/refund" element={<ProtectedRoute isAdmin={true}><RefundList /></ProtectedRoute>} />
                    <Route path='/admin/user/:id' element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />
                    <Route path='/admin/products/updateprice' element={<ProtectedRoute isAdmin={true}><UpdatePrice /></ProtectedRoute>} />
                    <Route path='/admin/orders' element={<ProtectedRoute isAdmin={true}><OrderList /></ProtectedRoute>} />
                    <Route path='/admin/order/:id' element={<ProtectedRoute isAdmin={true}><UpdateOrder /></ProtectedRoute>} />
                    <Route path='/admin/order-summary' element={<ProtectedRoute isAdmin={true}><OrderSummary /></ProtectedRoute>} />
                    <Route path='/admin/user-summary' element={<ProtectedRoute isAdmin={true}><SummaryUser /></ProtectedRoute>} />
                </Routes>
                <Footer />
                <ToastContainer theme="dark" />
            </HelmetProvider>
        </div>
    );
}

function RootApp() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default RootApp;
