import React from 'react'
import Search from './Search'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Image } from 'react-bootstrap'
import { logout } from '../../actions/userActions';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Header = () => {

  const { isAuthenticated, user } = useSelector(state => state.authState);
  const { items: cartItems } = useSelector(state => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = () => {
    dispatch(logout);
    navigate('/')
  }

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    // <nav className="navbar row">
    //   <div className="col-12 col-md-3">
    //     <div className="navbar-brand">
    //         <Link to='/'>
    //       <img width="180px" src="../images/logo.png" alt="logo"/>
    //       </Link>
    //     </div>
    //   </div>
    //   <div>
    //   <Link to='/'><span id="cart" className="ml-3">HOME</span></Link>
    //   <Link to='/about'><span id="cart" className="ml-3">ABOUT US</span></Link>
    //   <Link to='/cart'><span id="cart" className="ml-3">ORDER NOW</span></Link>
    //   <Link to='/contact'><span id="cart" className="ml-3">CONTACT</span></Link>

    //   <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
    //   {isAuthenticated ?
    //     (
    //       <Dropdown className='d-inline' >
    //           <Dropdown.Toggle variant='default text-white pr-5' id='dropdown-basic'>
    //           <figure className='avatar avatar-nav'>
    //                   <Image width="50px" src={user.avatar??'./images/default_avatar.png'}  />
    //                 </figure>
    //             <span>{user.name}</span>
    //           </Dropdown.Toggle>
    //           <Dropdown.Menu>
    //               { user.role === 'admin' && <Dropdown.Item onClick={() => {navigate('admin/dashboard')}} className='text-dark'>Dashboard</Dropdown.Item> }
    //               <Dropdown.Item onClick={() => {navigate('/myprofile')}} className='text-dark'>Profile</Dropdown.Item>
    //               <Dropdown.Item onClick={() => {navigate('/orders')}} className='text-dark'>Orders</Dropdown.Item>
    //               <Dropdown.Item onClick={logoutHandler} className='text-danger'>Logout</Dropdown.Item>
    //           </Dropdown.Menu>
    //       </Dropdown>
    //     ) 
    //    :
    //    <Link to='/login' className="btn" id="login_btn">Login</Link>}


    //     <Link to='/cart'><span id="cart" className="ml-3">Cart</span></Link>
    //     <span className="ml-1" id="cart_count">{cartItems.length}</span>
    //   </div>
    //   </div>
    // </nav>


    // <nav className="navbar navbar-expand-lg navbar-light ">
    //   <div className=" container container-fluid">
    //     <div>
    //       <Link to="/" className="navbar-brand">
    //         <img width="300px" src="../images/logo.png" alt="logo" />
    //       </Link>
    //       <button
    //         className="navbar-toggler"
    //         type="button"
    //         data-bs-toggle="collapse"
    //         data-bs-target="#navbarNav"
    //         aria-controls="navbarNav"
    //         aria-expanded="false"
    //         aria-label="Toggle navigation"
    //         // style={{display:'flex',alignItems:'center', justifyContent:'center'}}
    //       >
    //         <span className="navbar-toggler-icon"></span>
    //       </button>
    //     </div>
    //     <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
    //       <ul className="navbar-nav">
    //         <li className="nav-item">
    //           <Link to="/" className="navbar-link">HOME</Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link to="/about" className="navbar-link">ABOUT US</Link>
    //         </li>
    //         {/* <li className="nav-item">
    //           <Link to="/cart" className="nav-link">ORDER NOW</Link>
    //         </li> */}
    //         <li className="nav-item dropdown">
    //           <Dropdown>
    //             <Dropdown.Toggle as="div" className="navbar-link" id="orderNowDropdown">
    //               ORDER NOW
    //             </Dropdown.Toggle>
    //             <Dropdown.Menu aria-labelledby="orderNowDropdown">
    //               <Dropdown.Item onClick={() => navigate('/vegetables')} className="text-dark">
    //                 Vegetables
    //               </Dropdown.Item>
    //               <Dropdown.Item onClick={() => navigate('/fruits')} className="text-dark">
    //                 Fruits
    //               </Dropdown.Item>
    //               <Dropdown.Item onClick={() => navigate('/keerai')} className="text-dark">
    //                 Keerai
    //               </Dropdown.Item>
    //             </Dropdown.Menu>
    //           </Dropdown>
    //         </li>
    //         <li className="nav-item">
    //           <Link to="/enquiry" className="navbar-link">CONTACT</Link>
    //         </li>
    //         {isAuthenticated ? (
    //           <li className="nav-item dropdown">
    //             <Dropdown>
    //               <Dropdown.Toggle variant="default" id="dropdown-basic">
    //                 <figure className="avatar avatar-nav">
    //                   <Image width="40px" src={user.avatar ?? './images/default_avatar.png'} />
    //                 </figure>
    //                 {/* <span>{user.name}</span> */}
    //               </Dropdown.Toggle>
    //               <Dropdown.Menu>
    //                 {user.role === 'admin' && (
    //                   <Dropdown.Item onClick={() => navigate('admin/dashboard')} className="text-dark">
    //                     Dashboard
    //                   </Dropdown.Item>
    //                 )}
    //                 <Dropdown.Item onClick={() => navigate('/myprofile')} className="text-dark">
    //                   Profile
    //                 </Dropdown.Item>
    //                 <Dropdown.Item onClick={() => navigate('/orders')} className="text-dark">
    //                   Orders
    //                 </Dropdown.Item>
    //                 <Dropdown.Item onClick={logoutHandler} className="text-danger">
    //                   Logout
    //                 </Dropdown.Item>
    //               </Dropdown.Menu>
    //             </Dropdown>
    //           </li>
    //         ) : (
    //           <li className="nav-item">
    //             <Link to="/login" className="navbar-link" id="login_btn">
    //               LOGIN
    //             </Link>
    //           </li>
    //         )}
    //         <li className="nav-item">
    //           <Link to="/cart" className="navbar-link">
    //             CART
    //             <span className="badge bg-secondary ml-1" id="cart_count">
    //               {cartItems.length}
    //             </span>
    //           </Link>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </nav>

    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>
          <Link to="/" className="navbar-brand">
            <img width="300px" src="../images/logo.png" alt="logo" />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Nav className="me-auto">
            <Nav.Link >
              <Link to="/" className="navbar-link">HOME</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/about" className="navbar-link">ABOUT US</Link>
            </Nav.Link>
            <NavDropdown title="OREDR NOW" id="collapsible-nav-dropdown">
              {/* <NavDropdown.Item href="#action/3.1"></NavDropdown.Item> */}
              <NavDropdown.Item onClick={() => navigate('/vegetables')}>
                Vegetables
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate('/fruits')}>Fruits</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate('/keerai')}>
                Keerai
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link >
              <Link to="/enquiry" className="navbar-link">CONTACT</Link>
            </Nav.Link>

          </Nav>
          <Nav>
            {isAuthenticated ? (
              <NavDropdown
                title={
                  <div className="d-inline-flex align-items-center">
                    <div className="avatar-initials">
                      {getInitials(user.name)}
                    </div>
                    {/* <span className="ml-2">{user.firstName}</span> */}
                  </div>
                }
                id="collapsible-nav-dropdown"
              >
                {user.role === 'admin' && (
                  <NavDropdown.Item onClick={() => navigate('admin/dashboard')} className="text-dark">
                    Dashboard
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item onClick={() => navigate('/myprofile')}>Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/orders')}>Orders</NavDropdown.Item>
                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
              </NavDropdown>

            ) : (
              <Nav.Link>
                <Link to="/login" className="navbar-link" id="login_btn">
                  LOGIN
                </Link>
              </Nav.Link>
            )}
            </Nav>
            <Nav>
            <Nav.Link>
              <Link to="/cart" className="navbar-link">
                CART
                <span className="badge bg-secondary ml-1" id="cart_count">
                  {cartItems.length}
                </span>
              </Link>
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );


}

export default Header

