import React, { useEffect, useState } from 'react'
import Search from './Search'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Image } from 'react-bootstrap'
import { logout } from '../../actions/userActions';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { userOrdersClear } from '../../slices/orderSlice';
import { clearUser, clearlogout, reset } from '../../slices/authSlice';
import { Slide, toast } from 'react-toastify';
import { clearProducts } from '../../slices/productsSlice';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Header = ({ openSide, setOpenSide }) => {

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
  const { isAuthenticated, user, loggedoutmessage, isloggedout } = useSelector(state => state.authState);
  const { items: cartItems } = useSelector(state => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const { loading, userOrders, error } = useSelector(state => state.orderState)

  console.log('loggedout message',loggedoutmessage,isloggedout)

  const logoutHandler =  (e) => {
    // e.preventDefault();
    // setOpenSide(!openSide);
    // sessionStorage.removeItem('redirectPath');
    // sessionStorage.setItem('redirectPath', '/');
    // dispatch(userOrdersClear());
    if(userOrders){
      dispatch(userOrdersClear());
    }
     dispatch(logout);
     sessionStorage.clear();
    // sessionStorage.removeItem('redirectPath');
    // navigate('/');   
    setRefresh(true);
    // return
    // sessionStorage.removeItem('redirectPath');
    // navigate('/')
  }

  useEffect(() => {
    if (isloggedout && !isAuthenticated && !user && refresh) {
      sessionStorage.clear();
      setRefresh(false);
      // if(userOrders){
      //   dispatch(userOrdersClear());
      // }
     
      // dispatch(clearUser());
      // setOpenSide(!openSide);
      toast.dismiss();
      setTimeout(() => {
        toast.success(loggedoutmessage, {
          position: 'bottom-center',
          type: 'success',
          autoClose: 700,
          transition: Slide,
          hideProgressBar: true,
          className: 'small-toast',
          // onOpen: () => { window.location.replace('/'); },
          onClose: () => {  window.close();window.open('/', '_blank');},
        });
           
       
        dispatch(clearlogout());
      //   setTimeout(() => {
      //     // window.close();
      //     // window.open('/', '_blank');
      //     window.location.replace('/'); // Fallback to replace current page
      //     // window.open('/', '_blank');
      // }, 200);
       
      //   sessionStorage.clear(); 
      // // Redirect without leaving a history entry
      // window.location.replace('/'); 
      // dispatch(clearlogout());
            // sessionStorage.clear();
            // window.close();

            // Open a new tab with the target URL (home or login page)
           
           

            // Close the current tab
            // window.close();
      }, 100);
      // Clear session storage
      // setTimeout(() => {  
      // sessionStorage.clear(); 
      // // Redirect without leaving a history entry
      // window.location.replace('/'); 
     
      // }, 400);

   
      
      // sessionStorage.setItem('redirectPath', '/');
     
      // return
    }
  }, [isloggedout,dispatch, refresh])

  // const [openSide, setOpenSide] = useState(false);
  const changeToggle = () => {
    setOpenSide(!openSide);
  }
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (

    // <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
    //   <Container>
    //     <Navbar.Brand>
    //       <Link to="/" className="navbar-brand">
    //         <img width="300px" src="/images/logo.png" alt="logo" />
    //       </Link>
    //     </Navbar.Brand>
    //     <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    //     <Navbar.Collapse id="responsive-navbar-nav" style={{}}>
    //       <Nav className="me-auto" style={{ display: 'flex', gap: '1rem',justifyContent: 'space-evenly', alignItems: 'center' }}>
    //         <Nav.Link>
    //           <Link to="/" className="navbar-link">HOME</Link>
    //         </Nav.Link>
    //         <Nav.Link>
    //           <Link to="/about" className="navbar-link">ABOUT US</Link>
    //         </Nav.Link>
    //         <NavDropdown title={<div className="d-inline-flex align-items-center">ORDER NOW</div>} id="collapsible-nav-dropdown">
    //           <NavDropdown.Item onClick={() => navigate('/vegetables')}>Vegetables</NavDropdown.Item>
    //           <NavDropdown.Item onClick={() => navigate('/fruits')}>Fruits</NavDropdown.Item>
    //           <NavDropdown.Item onClick={() => navigate('/keerai')}>Keerai</NavDropdown.Item>
    //         </NavDropdown>
    //         <Nav.Link>
    //           <Link to="/enquiry" className="navbar-link">CONTACT</Link>
    //         </Nav.Link>

    //         {isAuthenticated ? (
    //           <NavDropdown title={<div className=" d-inline-flex align-items-center"><div className=" avatar-initials">{getInitials(user.name)}</div></div>} id="collapsible-nav-dropdown">
    //             {user.role === 'admin' && (
    //               <NavDropdown.Item onClick={() => navigate('admin/dashboard')} className="text-dark">
    //                 Dashboard
    //               </NavDropdown.Item>
    //             )}
    //             <NavDropdown.Item onClick={() => navigate('/myprofile')}>Profile</NavDropdown.Item>
    //             <NavDropdown.Item onClick={() => navigate('/orders')}>Orders</NavDropdown.Item>
    //             <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
    //           </NavDropdown>
    //         ) : (
    //           <Nav.Link>
    //             <Link to="/login" className="navbar-link" id="login_btn">
    //               LOGIN
    //             </Link>
    //           </Nav.Link>
    //         )}

    //         <Nav.Link>
    //           <Link to="/cart" className="navbar-link cart-container">
    //             <i className="fa fa-shopping-cart cart-icon"></i>
    //             <span className="badge bg-secondary ml-1" id="cart_count">
    //               {cartItems.length}
    //             </span>
    //           </Link>
    //         </Nav.Link>
    //       </Nav>
    //     </Navbar.Collapse>

    //   </Container>
    // </Navbar>
    // <div style={{position:'fixed' }}>
    <>
      <Navbar collapseOnSelect expand="sm" className="bg-body-tertiary custom-navbar">
        {windowWidth > 576 ? (
          <Container>
            <Navbar.Brand>
              {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{zIndex:'99999',border:'none'}} onClick={changeToggle}/> */}
              <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                style={{ zIndex: '99999', border: 'none', position: 'relative' }}
                onClick={changeToggle}
              >
                {openSide ? (
                  <i className="fa fa-times"></i> // Cancel (X) icon when open
                ) : (
                  <i className="fa fa-bars"></i>  // Bars icon when closed
                )}
              </Navbar.Toggle>
              <Link to="/" className="navbar-brand">
                <img width="250px" height="75px" style={{ padding: '0px', margin: '0px' }} className="logo" src="/images/logo.png" alt="logo" />
              </Link>
            </Navbar.Brand>

            <Navbar.Collapse id="responsive-navbar-nav" className="custom-collapse">
              {/* {
      !openSide && ( */}
              <Nav className="me-auto custom-nav" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', alignItems: 'center', minWidth: '100%' }}>
                {/* <Nav.Link> */}
                <Link to="/" className="navbar-link">HOME</Link>
                {/* </Nav.Link> */}
                {/* <Nav.Link> */}
                <Link to="/about" className="navbar-link">ABOUT US</Link>
                {/* </Nav.Link> */}
                <NavDropdown title={<div className="d-inline-flex align-items-center dropdown-display navbar-link">ORDER NOW</div>} id="collapsible-nav-dropdown">
                  <NavDropdown.Item className='dropdown-display' onClick={() => navigate('/vegetables')}>Vegetables</NavDropdown.Item>
                  <NavDropdown.Item className='dropdown-display' onClick={() => navigate('/fruits')}>Fruits</NavDropdown.Item>
                  <NavDropdown.Item className='dropdown-display' onClick={() => navigate('/keerai')}>Keerai</NavDropdown.Item>
                </NavDropdown>
                {/* <Nav.Link> */}
                <Link to="/enquiry" className="navbar-link">CONTACT</Link>
                {/* </Nav.Link> */}

                {isAuthenticated && user ? (
                  <NavDropdown title={<div className="d-inline-flex align-items-center"><div className="avatar-initials">{getInitials(user.name)}</div></div>} id="collapsible-nav-dropdown" className='dropdown-nav-menu'>
                    {user.role === 'admin' && (
                      <NavDropdown.Item onClick={() => navigate('admin/dashboard')} className="text-dark">
                        Dashboard
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Item onClick={() => navigate('/myprofile')}>Profile</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigate('/orders')}>Orders</NavDropdown.Item>
                    <NavDropdown.Item onClick={(e) => logoutHandler(e)}>Logout</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  // <Nav.Link>
                  <Link to="/login" className="navbar-link" id="login_btn">LOGIN</Link>
                  // </Nav.Link>
                )}

                {/* <Nav.Link> */}
                <Link to="/cart" className="navbar-link cart-container">
                  <i className="fa fa-shopping-cart cart-icon"></i>
                  <span className="badge bg-secondary ml-1" id="cart_count">{cartItems.length}</span>
                </Link>
                {/* </Nav.Link> */}
              </Nav>
              {/* )
    } */}

            </Navbar.Collapse>
          </Container>
        ) : (
          <Container >
            <Navbar.Brand>
              {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{zIndex:'99999',border:'none'}} onClick={changeToggle}/> */}
              <div
                aria-controls="responsive-navbar-nav"
                style={{ zIndex: '99999', border: 'none', position: 'relative', cursor: 'pointer' }}
                onClick={changeToggle}
              >
                {openSide ? (
                  <i className="fa fa-times"></i> // Cancel (X) icon when open
                ) : (
                  <i className="fa fa-bars"></i>  // Bars icon when closed
                )}
              </div>
              <Link to="/" className="navbar-brand">
                <img width="300px" height="90px" className="logo" src="/images/logo.png" alt="logo" />
              </Link>
            </Navbar.Brand>
            <Link to="/cart" className="navbar-link cart-container navbar-link-badge">
              <i className="fa fa-shopping-cart cart-icon"></i>
              <span className="badge bg-secondary ml-1" id="cart_count">{cartItems.length}</span>
            </Link>
            <div className={`${openSide ? "custom-collapse open" : "custom-collapse-close"}`}>
              {/* {
      !openSide && ( */}
              <Nav style={{ display: 'flex', flexDirection: 'column' }}>
                {
                  isAuthenticated ? (
                    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                      <div className="avatar-initials">{getInitials(user && user.name)}</div>
                      <div className='sidebar-username'>
                        {
                          user && user.name
                        }

                      </div>

                    </div>


                  ) : (
                    // <Nav.Link>
                    <Link to="/login" className="navbar-link" id="login_btn" onClick={changeToggle}>LOGIN <i className="fa fa-sign-in" style={{ marginLeft: '3px' }}></i></Link>
                    // </Nav.Link>
                  )
                }

                <div className='sidebar-components' >
                  {/* <div className={`${openSide ? 'sidebar-open sidebar-components' : 'sidebar-closed sidebar-components'}`} > */}


                  <hr style={{ width: '90%', marginLeft: '2px', height: '1px', backgroundColor: 'grey', border: 'none' }}></hr>
                  {
                    isAuthenticated && (
                      <>
                        {/* <Nav.Link> */}
                        {user.role === 'admin' && (
                          <Link to="/admin/dashboard" className="navbar-names" onClick={changeToggle}>Dashboard</Link>
                        )}
                        <Link to="/myprofile" className="navbar-names" onClick={changeToggle}>Profile</Link>
                        {/* </Nav.Link> */}
                        {/* <Nav.Link> */}
                        <Link to="/orders" className="navbar-names" onClick={changeToggle}>Orders</Link>


                        {/* </Nav.Link> */}
                      </>

                    )
                  }

                  {/* <Nav.Link> */}
                  <Link to="/about" className="navbar-names" onClick={changeToggle}>AboutUs</Link>
                  {/* </Nav.Link> */}
                  {/* <Nav.Link> */}
                  <Link to="/enquiry" className="navbar-names" onClick={changeToggle}>ContactUs</Link>
                  {/* </Nav.Link> */}
                  {
                    isAuthenticated && (
                      // <Nav.Link>
                      <Link onClick={logoutHandler} className="navbar-names">Logout<i className="fa fa-sign-out" style={{ marginLeft: '3px' }}></i></Link>
                      // </Nav.Link>
                    )
                  }
                </div>


              </Nav>
              {/* )
    } */}

            </div>
            {openSide && (
              <>
                <div className="overlay" onClick={changeToggle}></div>
                <div className="blur-effect"></div>
              </>
            )}
          </Container>

        )}

      </Navbar>

    </>

  );


}

export default Header

