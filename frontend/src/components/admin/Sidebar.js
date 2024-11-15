

// import React, { useEffect, useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { NavDropdown } from 'react-bootstrap';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../../actions/userActions';

// const Sidebar = ({isActive,setIsActive}) => {
//     // const [isActive, setIsActive] = useState(false);
//     const { user, isAuthenticated } = useSelector(state => state.authState);
//     const location = useLocation();
//     sessionStorage.setItem('redirectPath', location.pathname);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const toggleSidebar = () => {
//         setIsActive(!isActive);
//     }

//     const closeSidebar = () => {
//         if (window.innerWidth < 768) {
//             setIsActive(false);
//         }
//     }

//     const logoutHandler = () => {   

//         dispatch(logout); // Call the action as a function
//         closeSidebar();
//         // sessionStorage.removeItem('redirectPath'); // Remove redirectPath
//         // navigate('/'); // Redirect to landing page
//     }

//     useEffect(()=>{
//         if(!isAuthenticated){
//             sessionStorage.removeItem('redirectPath');
//             navigate('/');
//         }
//     },[isAuthenticated])

//     return (
//         <>
//             {!isActive ? (
//                 <button id="sidebarCollapse" onClick={toggleSidebar}>
//                     <i className="fa fa-bars"></i>
//                 </button>
//             ) : (
//                 <button id="sidebar-close" onClick={toggleSidebar}>
//                     <i className="fa fa-close"></i>
//                 </button>
//             )

//             }
//             <div className={`sidebar-wrapper ${isActive ? 'active' : ''}`}>

//                 <nav id="sidebar">
//                     <ul className="list-unstyled components">
//                         <li>
//                             <Link to='/admin/dashboard' onClick={closeSidebar}><i className='fas fa-tachometer-alt'></i> Dashboard</Link>
//                         </li>
//                         <li>
//                             <NavDropdown title={<i className='fa fa-product-hunt'> Product</i>}>
//                                 <NavDropdown.Item onClick={() => { navigate('/admin/products'); closeSidebar(); }}>
//                                     <i className='fa fa-shopping-basket product-dropdown'> All</i>
//                                 </NavDropdown.Item>
//                                 <NavDropdown.Item onClick={() => { navigate('/admin/products/create'); closeSidebar(); }}>
//                                     <i className='fa fa-plus product-dropdown'> Create </i>
//                                 </NavDropdown.Item>
//                                 <NavDropdown.Item onClick={() => { navigate('/admin/products/updateprice'); closeSidebar(); }}>
//                                     <i className='fa fa-upload product-dropdown'> UpdatePrice </i>
//                                 </NavDropdown.Item>
//                             </NavDropdown>
//                         </li>
//                         <li>
//                             <NavDropdown title={<i className='fa fa-shopping-basket'> Orders</i>}>
//                                 <NavDropdown.Item onClick={() => { navigate('/admin/orders'); closeSidebar(); }}>
//                                     <i className='fa fa-list'> Order List</i>
//                                 </NavDropdown.Item>
//                                 <NavDropdown.Item onClick={() => { navigate('/admin/order-summary'); closeSidebar(); }}>
//                                     <i className='fa fa-file-text'> Order Summary </i>
//                                 </NavDropdown.Item>
//                             </NavDropdown>
//                         </li>
//                         <li>
//                             <NavDropdown title={<i className="fa fa-users"> Users</i>}>
//                                 <NavDropdown.Item onClick={() => { navigate('/admin/users'); closeSidebar(); }}>
//                                     <i className='fa fa-list'> User List</i>
//                                 </NavDropdown.Item>
//                                 <NavDropdown.Item onClick={() => { navigate('/admin/user-summary'); closeSidebar(); }}>
//                                     <i className='fa fa-file-text'> User Summary </i>
//                                 </NavDropdown.Item>
//                             </NavDropdown>
//                         </li>
//                         <li>
//                             <Link to="/admin/payments" onClick={closeSidebar}><i className="fa fa-credit-card"></i> Payments</Link>
//                         </li>
//                         <li>
//                             <Link to="/admin/dispatch" onClick={closeSidebar}><i className="fa fa-truck"></i> Dispatch</Link>
//                         </li>
//                         <li>
//                             <Link to="/admin/refund" onClick={closeSidebar}><i className="fa fa-reply"></i> Refund</Link>
//                         </li>
//                         <li>
//                             <Link onClick={logoutHandler}><i className="fa fa-sign-out"></i> Logout</Link>
//                         </li>
//                     </ul>
//                 </nav>
//             </div>
//             {isActive && (
//           <>
//             <div className="overlay" onClick={closeSidebar}></div>
//             <div className="blur-effect"></div>
//           </>
//         )}

//         </>
//     );
// }

// export default Sidebar;

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, NavDropdown, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/userActions';
import { adminOrderClear, userOrdersClear } from '../../slices/orderSlice';
import { Slide, toast } from 'react-toastify';
import { clearlogout, reset } from '../../slices/authSlice';
import { clearProducts } from '../../slices/productsSlice';

const Sidebar = ({ isActive, setIsActive }) => {
    const { user, isAuthenticated,loggedoutmessage,isloggedout } = useSelector(state => state.authState);
    const { loading, userOrders, error } = useSelector(state => state.orderState)
    const { adminOrders  } = useSelector( state => state.orderState);
    useEffect(() => {
        console.log({ isloggedout, isAuthenticated, user });
    }, [isloggedout, isAuthenticated, user]);

 
    const useWindowWidth = () => {
        const [windowWidth, setWindowWidth] = useState(window.innerWidth);

        useEffect(() => {
            const handleResize = () => setWindowWidth(window.innerWidth);

            window.addEventListener('resize', handleResize);

            // Cleanup event listener on component unmount
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        return windowWidth;
    };
    const windowWidth = useWindowWidth();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState(false);

    // sessionStorage.setItem('redirectPath', location.pathname);

    const toggleSidebar = () => {
        setIsActive(!isActive);
    }

    const closeSidebar = () => {
        setIsActive(false);
    }

    // const logoutHandler = (e) => {
    //     // e.preventDefault();
    //     // sessionStorage.removeItem('redirectPath');
    //     // closeSidebar();
    //     // dispatch(userOrdersClear());
    //     // sessionStorage.setItem('redirectPath', '/');
    //     // navigate('/');
    //     dispatch(logout); // Call the action as a function
    //     setRefresh(true);
    //     // return;
    // }
    const logoutHandler =  (e) => {
        e.preventDefault();
        // Dispatch the logout action
        if(userOrders){
            dispatch(userOrdersClear());
          }
        //   if(adminOrders){
        //     dispatch(adminOrderClear());
        //   }
        
         dispatch(logout);
         sessionStorage.clear(); 
        setRefresh(true); // Set refresh to true to trigger useEffect
        // dispatch(clearProducts());
    }

    // useEffect(() => {
    //     if (isloggedout && !isAuthenticated && !user && refresh) {
    //         setRefresh(false);
    //         // dispatch(userOrdersClear());
    //         // dispatch(clearUser());
    //         // setOpenSide(!openSide);
    //         toast.dismiss();
    //         setTimeout(() => {
    //           toast.success(loggedoutmessage, {
    //             position: 'bottom-center',
    //             type: 'success',
    //             autoClose: 700,
    //             transition: Slide,
    //             hideProgressBar: true,
    //             className: 'small-toast',
    //             onClose: () => {window.close(); },
    //           });
    //           dispatch(clearlogout());
    //             setTimeout(() => {
    //                 window.open('/', '_blank');
    //                 // window.close();
    //                 // window.open('/', '_blank');
    //                 window.location.replace('/'); // Fallback to replace current page
    //             }, 200);
    //             // Clear session storage and dispatch necessary actions
                
    //         }, 300);
    //         // return;
    //     }
    // }, [isloggedout,dispatch, refresh]);

    useEffect(() => {
        if (isActive) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [isActive]);

    useEffect(() => {
        const handleScroll = () => {
            const headerElement = document.querySelector('.custom-navbar');
            if (window.scrollY > 20) {
                headerElement && headerElement.classList.add('custom-navbar-shadow');
            } else {
                headerElement && headerElement.classList.remove('custom-navbar-shadow');
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className={`sidebar-wrapper ${isActive ? 'active' : ''}`} >
                <nav id="sidebar">
                    {windowWidth > 767 && (
                        // <Navbar collapseOnSelect expand="sm" className="bg-body-tertiary custom-navbar">
                        //     <Container >
                        //         <Navbar.Brand>
                        <Link to="/">
                            <img className="logo-admin" src="/images/logo.png" alt="logo" />
                        </Link>
                        //         </Navbar.Brand>
                        //     </Container>
                        // </Navbar>
                    )}
                    <ul className="list-unstyled components">

                        <li>
                            <Link to='/admin/dashboard' onClick={closeSidebar}><i className='fas fa-tachometer-alt'></i> Dashboard</Link>
                        </li>
                        <li>
                            <NavDropdown title={<i className='fa fa-product-hunt'> Product</i>}>
                                <NavDropdown.Item onClick={() => { navigate('/admin/products'); closeSidebar(); }}>
                                    <i className='fa fa-shopping-basket product-dropdown'> All</i>
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { navigate('/admin/products/create'); closeSidebar(); }}>
                                    <i className='fa fa-plus product-dropdown'> Create </i>
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { navigate('/admin/products/updateprice'); closeSidebar(); }}>
                                    <i className='fa fa-upload product-dropdown'> UpdatePrice </i>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </li>
                        <li>
                            <Link to="/admin/category" onClick={closeSidebar}><i className="fa fa-tags"></i>Category</Link>
                        </li>
                        <li>
                            <Link to="/admin/measurement" onClick={closeSidebar}><i className="fa fa-balance-scale"></i>Measurement</Link>
                        </li>
                        <li>
                            <NavDropdown title={<i className='fa fa-shopping-basket'> Orders</i>}>
                                <NavDropdown.Item onClick={() => { navigate('/admin/orders'); closeSidebar(); }}>
                                    <i className='fa fa-list'> Order List</i>
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { navigate('/admin/order-summary'); closeSidebar(); }}>
                                    <i className='fa fa-file-text'> Order Summary </i>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </li>
                        <li>
                            <NavDropdown title={<i className="fa fa-users"> Users</i>}>
                                <NavDropdown.Item onClick={() => { navigate('/admin/users'); closeSidebar(); }}>
                                    <i className='fa fa-list'> User List</i>
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { navigate('/admin/user-summary'); closeSidebar(); }}>
                                    <i className='fa fa-file-text'> User Summary </i>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </li>
                        <li>
                            <Link to="/admin/payments" onClick={closeSidebar}><i className="fa fa-credit-card"></i> Payments</Link>
                        </li>
                        <li>
                            <Link to="/admin/dispatch" onClick={closeSidebar}><i className="fa fa-truck"></i> Dispatch</Link>
                        </li>
                        {/* <li>
                            <Link to="/admin/analysis" onClick={closeSidebar}><i className="fa fa-pie-chart"></i> Analysis</Link>
                        </li>
                        <li>
                            <Link to="/admin/refund" onClick={closeSidebar}><i className="fa fa-reply"></i> Refund</Link>
                        </li> */}
                        {user && user.role === 'admin' && (
                            <li>
                                <Link to="/admin/analysis" onClick={closeSidebar}>
                                    <i className="fa fa-pie-chart"></i> Analysis
                                </Link>
                            </li>
                        )}

                        {user && user.role === 'admin' && (
                            <li>
                                <Link to="/admin/refund" onClick={closeSidebar}><i className="fa fa-reply"></i> Refund</Link>
                            </li>
                        )}
                        <li>
                            <Link onClick={(e) =>logoutHandler(e)}><i className="fa fa-sign-out"></i> Logout</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            {windowWidth < 768 && (
                <Navbar collapseOnSelect expand="sm" className="bg-body-tertiary custom-navbar">
                    {!isActive ? (
                        <button id="sidebarCollapse" onClick={toggleSidebar} style={{ zIndex: '99999', border: 'none', position: 'relative', fontSize: '20px' }}>
                            <i className="fa fa-bars"></i>
                        </button>
                    ) : (
                        <button id="sidebar-close" onClick={toggleSidebar} style={{ zIndex: '99999', border: 'none', fontSize: '20px' }}>
                            <i className="fa fa-close"></i>
                        </button>
                    )}
                    {/* <Container > */}
                    <Navbar.Brand>
                        <Link to="/">
                            <img width="300px" height="90px" className="logo admin-logo" src="/images/logo.png" alt="logo" />
                        </Link>
                    </Navbar.Brand>
                    {/* </Container> */}
                </Navbar>
            )}

            {isActive && (
                <>
                    <div className="overlay" onClick={closeSidebar}></div>
                    <div className="blur-effect"></div>
                </>
            )}
        </>
    );
}

export default Sidebar;
