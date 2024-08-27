// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { NavDropdown } from 'react-bootstrap';
// import { logout } from '../../actions/userActions';
// import { useDispatch} from 'react-redux';


// const Sidebar = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const logoutHandler = () => {
//         dispatch(logout);
//         navigate('/')
//       }

//     return (
//         <div className="sidebar-wrapper">
//             <nav id="sidebar">
//                 <ul className="list-unstyled components">
//                     <li>
//                         <Link to='/admin/dashboard'><i className='fas fa-tachometer-alt'></i> Dashboard</Link>
//                     </li>

//                     <li>
//                         <NavDropdown title={<i className='fa fa-product-hunt'> Product</i>}>
//                             <NavDropdown.Item onClick={() => navigate('/admin/products')}> <i className='fa fa-shopping-basket product-dropdown'> All</i></NavDropdown.Item>
//                             <NavDropdown.Item onClick={() => navigate('/admin/products/create')}> <i className='fa fa-plus product-dropdown'> Create </i></NavDropdown.Item>
//                             <NavDropdown.Item onClick={() => navigate('/admin/products/updateprice')}> <i className='fa fa-upload product-dropdown'> UpdatePrice </i></NavDropdown.Item>
//                         </NavDropdown>
//                     </li>

//                     <li>
//                         <NavDropdown title={<i className='fa fa-shopping-basket'> Orders</i>}>
//                             <NavDropdown.Item onClick={() => navigate('/admin/orders')}> <i className='fa fa-list'> Order List</i></NavDropdown.Item>
//                             <NavDropdown.Item onClick={() => navigate('/admin/order-summary')}> <i className='fa fa-file-text'> Order Summary </i></NavDropdown.Item>     
//                         </NavDropdown>
//                     </li>

//                     {/* <li>
//                         <Link to='/admin/orders'><i className='fa fa-shopping-basket'></i> Orders</Link>
//                     </li> */}

//                     <li>
//                         {/* <Link to='/admin/users'><i className='fa fa-users'></i> Users</Link> */}

//                         <NavDropdown title={<i className="fa fa-users"> Users</i>}>
//                             <NavDropdown.Item onClick={() => navigate('/admin/users')}> <i className='fa fa-list'> User List</i></NavDropdown.Item>
//                             <NavDropdown.Item onClick={() => navigate('/admin/user-summary')}> <i className='fa fa-file-text'> User Summary </i></NavDropdown.Item>     
//                         </NavDropdown>
//                     </li>
//                     <li>
//                         <Link to="/admin/payments"><i className="fa fa-credit-card"></i> Payments</Link>
//                     </li>
//                     <li>
//                         <Link to="/admin/dispatch"><i className="fa fa-truck"></i> Dispatch</Link>

//                     </li>
//                     <li>
//                         <Link to="/admin/refund"><i className="fa fa-reply"></i> Refund</Link>
//                     </li>

//                     <li>
//                         <Link onClick={logoutHandler}><i className="fa fa-sign-out"></i> Logout</Link>
//                     </li>
//                 </ul>
//             </nav>
//         </div>
//     )
// }

// export default Sidebar;


import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/userActions';

const Sidebar = () => {
    const [isActive, setIsActive] = useState(false);
    const { user, isAuthenticated } = useSelector(state => state.authState);
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleSidebar = () => {
        setIsActive(!isActive);
    }

    const closeSidebar = () => {
        if (window.innerWidth < 768) {
            setIsActive(false);
        }
    }

    const logoutHandler = () => {   
        
        dispatch(logout); // Call the action as a function
        closeSidebar();
        // sessionStorage.removeItem('redirectPath'); // Remove redirectPath
        // navigate('/'); // Redirect to landing page
    }

    useEffect(()=>{
        if(!isAuthenticated){
            sessionStorage.removeItem('redirectPath');
            navigate('/');
        }
    },[isAuthenticated])

    return (
        <>
            {!isActive ? (
                <button id="sidebarCollapse" onClick={toggleSidebar}>
                    <i className="fa fa-bars"></i>
                </button>
            ) : (
                <button id="sidebar-close" onClick={toggleSidebar}>
                    <i className="fa fa-close"></i>
                </button>
            )

            }
            <div className={`sidebar-wrapper ${isActive ? 'active' : ''}`}>

                <nav id="sidebar">
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
                        <li>
                            <Link to="/admin/refund" onClick={closeSidebar}><i className="fa fa-reply"></i> Refund</Link>
                        </li>
                        <li>
                            <Link onClick={logoutHandler}><i className="fa fa-sign-out"></i> Logout</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default Sidebar;
