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

    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>
          <Link to="/" className="navbar-brand">
            <img width="300px" src="/images/logo.png" alt="logo" />
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

