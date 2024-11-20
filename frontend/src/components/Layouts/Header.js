

// import React, { useEffect, useState } from 'react'
// import Search from './Search'
// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux';
// import { Dropdown, Image } from 'react-bootstrap'
// import { logout } from '../../actions/userActions';
// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import { userOrdersClear } from '../../slices/orderSlice';
// import { clearUser, clearlogout, reset } from '../../slices/authSlice';
// import { Slide, toast } from 'react-toastify';
// import { clearProducts } from '../../slices/productsSlice';

// const Header = ({ openSide, setOpenSide, onLoginClick }) => {

//   const useWindowWidth = () => {
//     const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//     useEffect(() => {
//       const handleResize = () => setWindowWidth(window.innerWidth);

//       window.addEventListener('resize', handleResize);

//       // Cleanup event listener on component unmount
//       return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     return windowWidth;
//   };
//   const windowWidth = useWindowWidth();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const { isAuthenticated, user, loggedoutmessage, isloggedout } = useSelector(state => state.authState);
//   const { items: cartItems } = useSelector(state => state.cartState);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [refresh, setRefresh] = useState(false);
//   const { loading, userOrders, error } = useSelector(state => state.orderState)

//   console.log('loggedout message', loggedoutmessage, isloggedout)

//   const logoutHandler = (e) => {
//     // e.preventDefault();
//     // setOpenSide(!openSide);
//     // sessionStorage.removeItem('redirectPath');
//     // sessionStorage.setItem('redirectPath', '/');
//     // dispatch(userOrdersClear());
//     if (userOrders) {
//       dispatch(userOrdersClear());
//     }
//     dispatch(logout);
//     sessionStorage.clear();
//     // sessionStorage.removeItem('redirectPath');
//     // navigate('/');   
//     setRefresh(true);
//     // return
//     // sessionStorage.removeItem('redirectPath');
//     // navigate('/')
//   }

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   useEffect(() => {
//     if (isloggedout && !isAuthenticated && !user && refresh) {
//       sessionStorage.clear();
//       setRefresh(false);
//       // if(userOrders){
//       //   dispatch(userOrdersClear());
//       // }

//       // dispatch(clearUser());
//       // setOpenSide(!openSide);
//       toast.dismiss();
//       setTimeout(() => {
//         toast.success(loggedoutmessage, {
//           position: 'bottom-center',
//           type: 'success',
//           autoClose: 100,
//           transition: Slide,
//           hideProgressBar: true,
//           className: 'small-toast',
//           // onOpen: () => { window.location.replace('/'); },
//           // onClose: () => {  window.close();window.open('/', '_blank');},
//           onClose: () => {
//             dispatch(clearlogout());
//             dispatch(clearUser());
//           },

//         });


//         // dispatch(clearlogout());
//         setTimeout(() => {
//           // window.close();
//           // window.open('/', '_blank');
//           window.location.replace('/'); // Fallback to replace current page
//           // window.open('/', '_blank');
//         }, 200);

//         //   sessionStorage.clear(); 
//         // // Redirect without leaving a history entry
//         // window.location.replace('/'); 
//         // dispatch(clearlogout());
//         // sessionStorage.clear();
//         // window.close();

//         // Open a new tab with the target URL (home or login page)



//         // Close the current tab
//         // window.close();
//       }, 10);
//       // Clear session storage
//       // setTimeout(() => {  
//       // sessionStorage.clear(); 
//       // // Redirect without leaving a history entry
//       // window.location.replace('/'); 

//       // }, 400);



//       // sessionStorage.setItem('redirectPath', '/');

//       // return
//     }
//   }, [isloggedout, dispatch, refresh])

//   // const [openSide, setOpenSide] = useState(false);
//   const changeToggle = () => {
//     setOpenSide(!openSide);
//   }
//   const getInitials = (name) => {
//     return name ? name.charAt(0).toUpperCase() : '';
//   };

//   return (
//     <>
//       <Navbar collapseOnSelect expand="sm" className="bg-body-tertiary custom-navbar">
//         {windowWidth > 576 ? (
//           <Container>
//             <Navbar.Brand>
//               {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{zIndex:'99999',border:'none'}} onClick={changeToggle}/> */}
//               <Navbar.Toggle
//                 aria-controls="responsive-navbar-nav"
//                 style={{ zIndex: '99999', border: 'none', position: 'relative' }}
//                 onClick={changeToggle}
//               >
//                 {openSide ? (
//                   <i className="fa fa-times"></i> // Cancel (X) icon when open
//                 ) : (
//                   <i className="fa fa-bars"></i>  // Bars icon when closed
//                 )}
//               </Navbar.Toggle>
//               <Link to="/" className="navbar-brand">
//                 <img width="250px" height="75px" style={{ padding: '0px', margin: '0px' }} className="logo" src="/images/logo.png" alt="logo" />
//               </Link>
//             </Navbar.Brand>

//             <Navbar.Collapse id="responsive-navbar-nav" className="custom-collapse">
//               {/* {
//            !openSide && ( */}
//               <Nav className="me-auto custom-nav" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', alignItems: 'center', minWidth: '100%' }}>
//                 {/* <Nav.Link> */}
//                 <Link to="/" className="navbar-link">HOME</Link>
//                 {/* </Nav.Link> */}
//                 {/* <Nav.Link> */}
//                 <Link to="/about" className="navbar-link">ABOUT US</Link>
//                 {/* </Nav.Link> */}
//                 <NavDropdown title={<div className="d-inline-flex align-items-center dropdown-display navbar-link">ORDER NOW <i className="fa fa-solid fa-caret-down" style={{ marginLeft: '5px' }}></i></div>} id="collapsible-nav-dropdown">
//                   <NavDropdown.Item className='dropdown-display' onClick={() => navigate('/vegetables')}>Vegetables</NavDropdown.Item>
//                   <NavDropdown.Item className='dropdown-display' onClick={() => navigate('/fruits')}>Fruits</NavDropdown.Item>
//                   <NavDropdown.Item className='dropdown-display' onClick={() => navigate('/keerai')}>Keerai</NavDropdown.Item>
//                 </NavDropdown>
//                 {/* <Nav.Link> */}
//                 <Link to="/enquiry" className="navbar-link">CONTACT</Link>
//                 {/* </Nav.Link> */}

//                 {isAuthenticated && user ? (
//                   <NavDropdown title={<div className="d-inline-flex dropdown-display align-items-center ">
//                     {/* <div className="text-dark dropdown-display">welcome</div> */}
//                     <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
//                       {user && user.name ? (
//                         <>
//                           <div className="avatar-initials">{getInitials(user.name)}</div>
//                         </>
//                       ) : (
//                         <div className="text-dark dropdown-display">Welcome</div>
//                       )}

//                     </div>

//                     <i className="fa fa-solid fa-caret-down" style={{ marginLeft: '5px' }}></i>
//                   </div>}
//                     id="collapsible-nav-dropdown" className='dropdown-nav-menu'>
//                     { (user && user.role === 'admin' || user && user.role === 'subadmin') && (
//                       <NavDropdown.Item onClick={() => navigate('admin/dashboard')} className="text-dark dropdown-display" >
//                         Dashboard
//                       </NavDropdown.Item>
//                     )}
//                     <NavDropdown.Item className='dropdown-display' onClick={() => navigate('/myprofile')}>Profile</NavDropdown.Item>
//                     <NavDropdown.Item className='dropdown-display' onClick={() => navigate('/orders')}>Orders</NavDropdown.Item>
//                     <NavDropdown.Item className='dropdown-display' onClick={(e) => logoutHandler(e)}>Logout</NavDropdown.Item>
//                   </NavDropdown>
//                 ) : (
//                   // <Nav.Link>
//                   // <Link to="/loginForm" className="navbar-link" id="login_btn">LOGIN</Link>
//                   <Link onClick={onLoginClick} className="navbar-link" id="login_btn">
//                     LOGIN <i className="fa fa-sign-out" style={{ marginLeft: '3px' }}></i>
//                   </Link>
//                   // </Nav.Link>
//                 )}

//                 {/* <Nav.Link> */}
//                 <button className="btn btn-success" >               
//                 <Link to="/cart" className="navbar-link cart-container">
//                   <i className="fa fa-shopping-cart cart-icon"></i>
//                   <span className="" id="cart_count">{cartItems.length} items</span>
//                   {cartItems.length > 0 && (
//                     <span className="cart-amount ml-1 text-white">
//                       ₹{cartItems.reduce((total, item) => total + item.price * item.productWeight, 0).toFixed(2)}
//                     </span>
//                   )}

//                 </Link>
//                 </button>
//                 {/* </Nav.Link> */}
//               </Nav>
//               {/* )
//     } */}

//             </Navbar.Collapse>
//           </Container >
//         ) : (
//           <Container >
//             <Navbar.Brand>
//               {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{zIndex:'99999',border:'none'}} onClick={changeToggle}/> */}
//               <div
//                 aria-controls="responsive-navbar-nav"
//                 style={{ zIndex: '99999', border: 'none', position: 'relative', cursor: 'pointer' }}
//                 onClick={changeToggle}
//               >
//                 {openSide ? (
//                   <i className="fa fa-times"></i> // Cancel (X) icon when open
//                 ) : (
//                   <i className="fa fa-bars"></i>  // Bars icon when closed
//                 )}
//               </div>
//               <Link to="/" className="navbar-brand">
//                 <img width="300px" height="90px" className="logo" src="/images/logo.png" alt="logo" />
//               </Link>
//             </Navbar.Brand>
//             <Link to="/cart" className="navbar-link cart-container navbar-link-badge">
//               <i className="fa fa-shopping-cart cart-icon"></i>
//               <span className="badge bg-secondary ml-1" id="cart_count">{cartItems.length}</span>
//             </Link>
//             <div className={`${openSide ? "custom-collapse open" : "custom-collapse-close"}`}>
//               {/* {
//       !openSide && ( */}
//               <Nav style={{ display: 'flex', flexDirection: 'column' }}>
//                 {
//                   isAuthenticated ? (
//                     <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
//                       {user && user.name ? (
//                         <>
//                           <div className="avatar-initials">{getInitials(user.name)}</div>
//                           <div className="sidebar-username">{user.name}</div>
//                         </>
//                       ) : (
//                         <div className=" text-center mt-5 sidebar-username">Welcome</div>
//                       )}

//                     </div>


//                   ) : (
//                     // <Nav.Link>
//                     // <Link to="/login" className="navbar-link" id="login_btn" onClick={changeToggle}>LOGIN <i className="fa fa-sign-in" style={{ marginLeft: '3px' }}></i></Link>
//                     // </Nav.Link>
//                     <Link onClick={onLoginClick} className="navbar-link" id="login_btn">
//                       LOGIN <i className="fa fa-sign-out" style={{ marginLeft: '3px' }}></i>
//                     </Link>
//                   )
//                 }

//                 <div className='sidebar-components' >
//                   {/* <div className={${openSide ? 'sidebar-open sidebar-components' : 'sidebar-closed sidebar-components'}} > */}


//                   <hr style={{ width: '90%', marginLeft: '2px', height: '1px', backgroundColor: 'grey', border: 'none' }}></hr>
//                   {
//                     isAuthenticated && (
//                       <>
//                         {/* <Nav.Link> */}
//                         {user.role === 'admin' && (
//                           <Link to="/admin/dashboard" className="navbar-names" onClick={changeToggle}>Dashboard</Link>
//                         )}
//                         <Link to="/myprofile" className="navbar-names" onClick={changeToggle}>Profile</Link>
//                         {/* </Nav.Link> */}
//                         {/* <Nav.Link> */}
//                         <Link to="/orders" className="navbar-names" onClick={changeToggle}>Orders</Link>


//                         {/* </Nav.Link> */}
//                       </>

//                     )
//                   }

//                   {/* <Nav.Link> */}
//                   <Link to="/about" className="navbar-names" onClick={changeToggle}>AboutUs</Link>
//                   {/* </Nav.Link> */}
//                   {/* <Nav.Link> */}
//                   <Link to="/enquiry" className="navbar-names" onClick={changeToggle}>ContactUs</Link>
//                   {/* </Nav.Link> */}
//                   {
//                     isAuthenticated && (
//                       // <Nav.Link>
//                       <Link onClick={logoutHandler} className="navbar-names">Logout<i className="fa fa-sign-out" style={{ marginLeft: '3px' }}></i></Link>
//                       // </Nav.Link>
//                     )
//                   }
//                 </div>


//               </Nav>
//               {/* )
//     } */}

//             </div>
//             {openSide && (
//               <>
//                 <div className="overlay" onClick={changeToggle}></div>
//                 <div className="blur-effect"></div>
//               </>
//             )}
//           </Container>

//         )}

//       </Navbar >

//     </>

//   );


// }

// export default Header

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import InputBase from '@mui/material/InputBase';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import { styled, alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
// import Search from './Search'
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Image } from 'react-bootstrap'
import { logout } from '../../actions/userActions';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { userOrdersClear } from '../../slices/orderSlice';
import { clearUser, clearlogout, reset } from '../../slices/authSlice';
import { Slide, toast } from 'react-toastify';
import { clearProducts } from '../../slices/productsSlice';


const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff', // Replace with your desired color
          color: 'black', // Text color
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff', // Replace with your desired color
          color: 'black', // Text color
        },
      },
    },
  },
});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  transition: 'all 0.3s ease-in-out',
  minWidth: '90%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const Header = ({ openSide, setOpenSide, onLoginClick }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastNonSearchRoute, setLastNonSearchRoute] = useState(null);
  const navigate = useNavigate();
  const { getcategory } = useSelector((state) => state.categoryState);
  console.log("getcategory", getcategory);


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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, user, loggedoutmessage, isloggedout } = useSelector(state => state.authState);
  const { items: cartItems } = useSelector(state => state.cartState);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const { loading, userOrders, error } = useSelector(state => state.orderState)

  console.log('loggedout message', loggedoutmessage, isloggedout)

  const logoutHandler = (e) => {
    // e.preventDefault();
    // setOpenSide(!openSide);
    // sessionStorage.removeItem('redirectPath');
    // sessionStorage.setItem('redirectPath', '/');
    // dispatch(userOrdersClear());
    if (userOrders) {
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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
          autoClose: 100,
          transition: Slide,
          hideProgressBar: true,
          className: 'small-toast',
          // onOpen: () => { window.location.replace('/'); },
          // onClose: () => {  window.close();window.open('/', '_blank');},
          onClose: () => {
            dispatch(clearlogout());
            dispatch(clearUser());
          },

        });


        // dispatch(clearlogout());
        setTimeout(() => {
          // window.close();
          // window.open('/', '_blank');
          window.location.replace('/'); // Fallback to replace current page
          // window.open('/', '_blank');
        }, 200);

        //   sessionStorage.clear(); 
        // // Redirect without leaving a history entry
        // window.location.replace('/'); 
        // dispatch(clearlogout());
        // sessionStorage.clear();
        // window.close();

        // Open a new tab with the target URL (home or login page)



        // Close the current tab
        // window.close();
      }, 10);
      // Clear session storage
      // setTimeout(() => {  
      // sessionStorage.clear(); 
      // // Redirect without leaving a history entry
      // window.location.replace('/'); 

      // }, 400);



      // sessionStorage.setItem('redirectPath', '/');

      // return
    }
  }, [isloggedout, dispatch, refresh])

  // const [openSide, setOpenSide] = useState(false);
  const changeToggle = () => {
    setOpenSide(!openSide);
  }
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };


  const handleNavigation = (route) => {
    navigate(route);
  };

  const [monthlyGroceriesAnchorEl, setMonthlyGroceriesAnchorEl] = useState(null);

  const handleMonthlyGroceriesClick = (event) => {
    setMonthlyGroceriesAnchorEl(event.currentTarget);
  };
  const handleMonthlyGroceriesClose = () => {
    setMonthlyGroceriesAnchorEl(null);
  };

  const HandelProfile = () => {
    if (!user || !isAuthenticated) {
      onLoginClick();
    }
    else {
      navigate('/profile');
    }
  }

  // useEffect(() => {
  //   if(searchOpen){
  //     const debounceTimeout = setTimeout(() => {
  //       if (searchQuery.trim() !== '') {
  //         navigate(`/product/search?query=${encodeURIComponent(searchQuery)}`);
  //       } else {
  //         navigate(-1); // Navigate to empty search route
  //       }
  //     }, 300); // Debounce delay
  //     return () => clearTimeout(debounceTimeout);
  //   }

  // }, [searchQuery, navigate]);


  useEffect(() => {
    // Track the last route before opening the search
    if (searchOpen && searchQuery === '') {
      const currentPath = window.location.pathname + window.location.search;
      if (!currentPath.includes('/product/search')) {
        setLastNonSearchRoute(currentPath);
      }
    }
  }, [searchOpen, searchQuery]);

  useEffect(() => {
    if (searchOpen) {
      const debounceTimeout = setTimeout(() => {
        if (searchQuery.trim() !== '') {
          navigate(`/product/search?query=${encodeURIComponent(searchQuery)}`);
        } else if (lastNonSearchRoute) {
          navigate(lastNonSearchRoute); // Navigate back to the last valid route
        } else {
          navigate('/'); // Fallback to the home page
        }
      }, 300); // Debounce delay
      return () => clearTimeout(debounceTimeout);
    }
  }, [searchQuery, searchOpen, navigate, lastNonSearchRoute]);

  const handleSearchClose = () => {
    setSearchOpen(false);
    if (lastNonSearchRoute) {
      navigate(lastNonSearchRoute); // Navigate back to the last route when closing search
    } else {
      navigate('/'); // Fallback to the home page
    }
  };



  const handleSearchOpen = () => setSearchOpen(true);
  // const handleSearchClose = () => {setSearchOpen(false);}

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleCategoryClick = (event) => setCategoryAnchorEl(event.currentTarget);
  const handleCategoryClose = () => setCategoryAnchorEl(null);

  const categories = Array.from({ length: 100 }, (_, index) => `Category ${index + 1}`);

  return (
    <header className="main-header">
      <AppBar
        position="sticky"
        sx={{
          top: 0,
          zIndex: 1300,
          backgroundColor: '#fff', // Inlined for specificity
          color: 'black',
          boxShadow: 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>


            {searchOpen ? (
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '100%' }}>
                <IconButton onClick={handleSearchClose} color="inherit">
                  <ArrowBackIcon />
                </IconButton>
                <Search sx={{ display: 'flex', minWidth: '98%' }}>
                  <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </Search>
              </Box>
            ) : (
              <>
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                    display: { xs: searchOpen ? 'none' : 'block', md: 'block' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.2rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  <Link to="/" className="navbar-brand">
                    <img
                      src="/images/logo.png"
                      alt="logo"
                      // className="logo"
                      style={{
                        padding: '3px',
                        margin: '0px',
                        width: '100%',
                        maxWidth: '200px',
                        height: 'auto', // Adjust height to maintain aspect ratio
                      }}
                    />
                  </Link>
                </Typography>

                <Box sx={{ flexGrow: 1 }} />
                <IconButton onClick={handleSearchOpen} color="inherit" sx={{ ml: 'auto' }}>
                  <SearchIcon />
                </IconButton>

                <IconButton
                  onClick={handleCategoryClick}
                  className='navbar-link'
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column', // Arrange items vertically
                    alignItems: 'center', // Center align items horizontally
                    justifyContent: 'center',
                    mr: 1,
                    backgroundColor: 'transparent', // Remove background color
                    border: 'none', // Remove border
                    outline: 'none', // Remove outline
                    boxShadow: 'none', // Remove any box shadow that may appear on click/focus
                    '&:hover': {
                      backgroundColor: 'transparent', // Ensure no background color on hover
                    },
                    '&:focus': {
                      outline: 'none', // Remove the outline when the button is focused
                    },
                    '&:active': {
                      backgroundColor: 'transparent', // Ensure no background color on active (click)
                      boxShadow: 'none', // Remove box shadow on active state
                    },
                    transition: 'none', // Remove any transition animation for a smooth, no-effect experience
                  }}
                >
                  <div>
                    <Typography variant="button" color="inherit" style={{ color: 'black', fontWeight: '700px' }}>
                      OrderNow
                    </Typography>
                    <ArrowDropDownIcon />
                  </div>
                  <Typography
                    variant="caption" // Smaller text size
                    color="inherit"
                    sx={{

                      marginTop: '-4px', // Slightly move text closer to the "OrderNow" text
                      fontSize: '10px', // Very small font size
                      color: '#757575', // Optional: Set a lighter color for contrast
                    }}
                  >
                    Fruits & Vegetables
                  </Typography>
                </IconButton>



                <Menu
                  anchorEl={categoryAnchorEl}
                  open={Boolean(categoryAnchorEl)}
                  onClose={handleCategoryClose}
                  slotProps={{
                    paper: {
                      width: 'auto',
                      minWidth: '100%',
                      padding: '8px',
                      maxHeight: 'calc(50vh)', // Max height for the category list
                      overflow: 'hidden', // Hide overflow to prevent scrolling
                    },
                  }}
                  anchorOrigin={{
                    vertical: 'bottom', // Align the menu's bottom edge with the bottom of the button
                    horizontal: 'center', // Center the menu horizontally relative to the button
                  }}
                  transformOrigin={{
                    vertical: 'top', // Align the top edge of the menu with the bottom of the button
                    horizontal: 'center', // Center the menu horizontally relative to the button
                  }}
                >
                  {/* Display categories in rows of 3 columns, each with 10 items */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${Math.min(Math.ceil(getcategory?.filter(cat => cat.type === 'Fresh').length / 10), 4)}, 1fr)`, // Adjust columns dynamically based on item count, max 4 columns
                      gap: 2,
                      maxHeight: 'calc(50vh)', // Limit the max height of the grid
                      overflowY: 'auto', // Allow vertical scrolling if categories exceed the height
                      // marginTop: 2,
                      justifyContent: 'center',
                    }}
                  >
                    {Array.from({ length: Math.ceil(getcategory?.filter(cat => cat.type === 'Fresh').length / 10) }).map((_, columnIndex) => (
                      <Box key={columnIndex} sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Create a column with up to 10 "Fresh" categories */}
                        {getcategory?.filter(category => category.type === 'Fresh') // Filter for "Fresh" type
                          .slice(columnIndex * 10, columnIndex * 10 + 10) // Slice for pagination
                          .map((category) => (
                            <MenuItem
                              key={category._id}

                              onClick={() => {
                                navigate(`/categories/${category.category.toLowerCase()}`, {
                                  state: { category: category.category },
                                });
                                handleCategoryClose();
                              }}
                              sx={{ py: 1 }}
                            >
                              {category.category}
                            </MenuItem>
                          ))}
                      </Box>
                    ))}
                  </Box>
                </Menu>
                <IconButton
                  onClick={handleMonthlyGroceriesClick}
                  className='navbar-link'
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                    '&:active': {
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                    },
                    transition: 'none',
                  }}
                >
                  <div>
                    <Typography variant="button" color="inherit" style={{ color: 'black', fontWeight: '700px' }}>
                      Monthly Groceries
                    </Typography>
                    <ArrowDropDownIcon />
                  </div>
                  <Typography
                    variant="caption"
                    color="inherit"
                    sx={{
                      marginTop: '-4px',
                      fontSize: '10px',
                      color: '#757575',
                    }}
                  >
                    Essentials & More
                  </Typography>
                </IconButton>

                <Menu
                  anchorEl={monthlyGroceriesAnchorEl}
                  open={Boolean(monthlyGroceriesAnchorEl)}
                  onClose={handleMonthlyGroceriesClose}
                  sx={{
                    width: 'auto',

                    padding: '8px',
                    maxHeight: 'calc(50vh)',
                    overflow: 'hidden',
                    display: 'flex',
                    // justifyContent: 'center',
                    // alignItems:'center',
                  }}
                  anchorOrigin={{
                    vertical: 'bottom', // Align the menu's bottom edge with the bottom of the button
                    horizontal: 'center', // Center the menu horizontally relative to the button
                  }}
                  transformOrigin={{
                    vertical: 'top', // Align the top edge of the menu with the bottom of the button
                    horizontal: 'center', // Center the menu horizontally relative to the button
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      minWidth: '100px',
                      gridTemplateColumns: `repeat(${Math.min(Math.ceil(getcategory?.filter(cat => cat.type === 'Groceries').length / 10), 4)}, 1fr)`, // Adjust columns dynamically based on item count, max 4 columns
                      gap: 2,
                      maxHeight: 'calc(50vh)', // Limit the max height of the grid
                      overflowY: 'auto', // Allow vertical scrolling if categories exceed the height
                      // marginTop: 2,
                    }}
                  >
                    {/* {['Rice', 'Pulses', 'Spices', 'Cooking Oil', 'dols', 'waters',].map((item) => (
                      <MenuItem
                        key={item}
                        onClick={handleMonthlyGroceriesClose}
                        sx={{ py: 1 }}
                      >
                        {item}
                      </MenuItem>
                    ))} */}
                    {Array.from({ length: Math.ceil(getcategory?.filter(cat => cat.type === 'Groceries').length / 10) }).map((_, columnIndex) => (
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Create a column with up to 10 "Fresh" categories */}
                        {getcategory?.filter(category => category.type === 'Groceries') // Filter for "Fresh" type
                          // .slice(columnIndex * 10, columnIndex * 10 + 10) // Slice for pagination
                          .map((category) => (
                            <MenuItem
                              key={category._id}
                              // onClick={handleCategoryClose}
                              onClick={() => {
                                navigate(`/categories/${category.category.toLowerCase()}`, {
                                  state: { category: category.category },
                                });
                                handleMonthlyGroceriesClose();
                              }}
                              sx={{ py: 1 }}
                            >
                              {category.category}
                            </MenuItem>
                          ))}
                      </Box>
                    ))}
                  </Box>
                </Menu>

                {/* <IconButton onClick={handleAvatarClick} sx={{
                  display: {
                    xs: 'none', md: 'flex', mr: 2, backgroundColor: 'transparent', // Remove background color
                    border: 'none', // Remove border
                    outline: 'none', // Remove outline
                    boxShadow: 'none', // Remove any box shadow that may appear on click/focus
                    '&:hover': {
                      backgroundColor: 'transparent', // Ensure no background color on hover
                    },
                    '&:focus': {
                      outline: 'none', // Remove the outline when the button is focused
                    },
                    '&:active': {
                      backgroundColor: 'transparent', // Ensure no background color on active (click)
                      boxShadow: 'none', // Remove box shadow on active state
                    },
                    transition: 'none',
                  }
                }}>
                  <Avatar alt="User Profile" src="/static/images/avatar/2.jpg" />
                </IconButton>
                <Menu
                  sx={{ ml: 3, mt: 6 }}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => {
                    navigate('/myprofile');
                    handleMenuClose();
                  }}>
                    Profile
                  </MenuItem>

                  <MenuItem onClick={() => {
                    navigate('/orders');
                    handleMenuClose();
                  }}>
                    Orders
                  </MenuItem>

                  <MenuItem onClick={(e) => {
                    logoutHandler(e);
                    handleMenuClose();
                  }}>
                    Logout
                  </MenuItem>
                </Menu> */}
                {isAuthenticated && user ? (
                  <>
                    <IconButton
                      onClick={handleAvatarClick}
                      sx={{
                        display: {
                          xs: 'none', md: 'flex', mr: 2, backgroundColor: 'transparent',
                          border: 'none', outline: 'none', boxShadow: 'none',
                          '&:hover': { backgroundColor: 'transparent' },
                          '&:focus': { outline: 'none' },
                          '&:active': { backgroundColor: 'transparent', boxShadow: 'none' },
                          transition: 'none',
                        }
                      }}>
                      {/* <Avatar alt="" src={user?.profilePicture || "/static/images/avatar/2.jpg"} /> */}
                      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        {user && user.name ? (
                          <>
                            <div className="avatar-initials">{getInitials(user.name)}</div>
                          </>
                        ) : (
                          <div className="text-dark dropdown-display">Welcome  <ArrowDropDownIcon /></div>
                        )}

                      </div>
                    </IconButton>
                    <Menu
                      sx={{ ml: 3, mt: 6 }}
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >

                      {(user && user.role === 'admin' || user && user.role === 'subadmin') && (
                        <MenuItem onClick={() => {
                          navigate('/admin/dashboard');
                          handleMenuClose();
                        }}>
                          Dashboard
                        </MenuItem>

                      )}

                      {/* Profile menu items */}
                      <MenuItem onClick={() => {
                        navigate('/myprofile');
                        handleMenuClose();
                      }}>
                        Profile
                      </MenuItem>

                      <MenuItem onClick={() => {
                        navigate('/orders');
                        handleMenuClose();
                      }}>
                        Orders
                      </MenuItem>

                      <MenuItem onClick={(e) => {
                        logoutHandler(e);
                        handleMenuClose();
                      }}>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  // If not authenticated, show login button
                  // <Link onClick={onLoginClick} className="navbar-link" id="login_btn">
                  //   LOGIN <i className="fa fa-sign-out" style={{ marginLeft: '3px' }}></i>
                  // </Link>
                  <IconButton
                    onClick={handleAvatarClick}
                    sx={{
                      display: {
                        xs: 'none', md: 'flex', mr: 2, backgroundColor: 'transparent',
                        border: 'none', outline: 'none', boxShadow: 'none',
                        '&:hover': { backgroundColor: 'transparent' },
                        '&:focus': { outline: 'none' },
                        '&:active': { backgroundColor: 'transparent', boxShadow: 'none' },
                        transition: 'none',
                      }
                    }}>
                    {/* <Avatar alt="" src={user?.profilePicture || "/static/images/avatar/2.jpg"} /> */}
                    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', fontSize: '18px' }}>
                      <Link onClick={onLoginClick} className="navbar-link" id="login_btn">
                        LOGIN <i className="fa fa-sign-out" style={{ marginLeft: '3px' }}></i>
                      </Link>
                    </div>
                  </IconButton>
                )}

                <button
                  className="btn btn-success header-button"
                  style={{
                    margin: '12px',
                    // width: '100%', // Make the width responsive
                    maxWidth: '200px', // Restrict maximum width
                    height: 'auto', // Allow height to adjust based on content
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row', // Align items horizontally
                  }}
                >
                  <Link
                    to="/cart"
                    className="navbar-link cart-container"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    {cartItems.length > 0 ? (
                      <i
                      className="fa fa-shopping-cart cart-icon"
                      style={{
                        marginRight: '7px', // Spacing between icon and text
                      }}
                    ></i>
                    ):(
                      <>
                       <i
                      className="fa fa-shopping-cart cart-icon"
                      style={{
                        marginRight: '7px', // Spacing between icon and text
                      }}
                    ></i>
                   <span
                        className="text-white cart-text"
                        style={{
                          // top:'1px',
                          margin: '2px',
                          fontSize: '13px', // Adjust text size for smaller screens
                        }}
                      >
                        My Cart
                      </span>
                      </>
                     
                    )}
                    
                    {cartItems.length > 0 && (
                      <span
                        id="cart_count"
                        className="text-white"
                        style={{
                          // top:'1px',
                          margin: '2px',
                          fontSize: '10px', // Adjust text size for smaller screens
                        }}
                      >
                        {cartItems.length} items
                      </span>
                    )}


                    {cartItems.length > 0 && (
                      <span
                        className="cart-amount  text-white"
                        style={{
                          // top:'1px',
                          // padding: '2px',
                          margin: '2px',
                          fontSize: '10px', // Adjust text size for smaller screens
                        }}
                      >
                        ₹{cartItems.reduce((total, item) => total + item.price * item.productWeight, 0).toFixed(2)}
                      </span>
                    )}

                  </Link>
                </button>

              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <BottomNavigation
        showLabels
        value={bottomNavValue}
        onChange={(event, newValue) => setBottomNavValue(newValue)}
        className='navbar-link'
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0,
          width: '100%',
          zIndex: 1300,
          backgroundColor: '#fff',
          color: 'black',
          border: 'none', // Remove border
          outline: 'none', // Remove outline
          boxShadow: 'none', // Remove any box shadow that may appear on click/focus
          '&:hover': {
            color:'#FED235'
          },
          '&:focus': {
            outline: 'none', // Remove the outline when the button is focused
          },
          '&:active': {
            // Ensure no background color on active (click)
            boxShadow: 'none', // Remove box shadow on active state
          },
          transition: 'none',
        }}
      >
        <BottomNavigationAction sx={{
          '&.Mui-selected': {
            color: '#FED235', // Set label color to yellow when active
          },
          border: 'none', // Remove border
          outline: 'none', // Remove outline
          boxShadow: 'none', // Remove any box shadow that may appear on click/focus
          '&:hover': {
            color:'#FED235'
          },
          '&:focus': {
            outline: 'none', // Remove the outline when the button is focused
          },
          '&:active': {
            // Ensure no background color on active (click)
            boxShadow: 'none', // Remove box shadow on active state
          },
          transition: 'none',
        }} label="Home" icon={<img
          src="/home.png"
          alt="Fresh"
          style={{ width: '24px', height: '24px' }} // Adjust the size as needed
        />} onClick={() => handleNavigation('/')} className='navbar-link' />
        <BottomNavigationAction sx={{
          '&.Mui-selected': {
            color: '#FED235', // Set label color to yellow when active
          },
          border: 'none', // Remove border
          outline: 'none', // Remove outline
          boxShadow: 'none', // Remove any box shadow that may appear on click/focus
          '&:hover': {
            color:'#FED235'
          },
          '&:focus': {
            outline: 'none', // Remove the outline when the button is focused
          },
          '&:active': {
            // Ensure no background color on active (click)
            boxShadow: 'none', // Remove box shadow on active state
          },
          transition: 'none',
        }} label="Fresh"
          onClick={() => handleNavigation('/fresh')} icon={
            <img
              src="/healthy-food.png"
              alt="Fresh"
              style={{ width: '24px', height: '24px' }} // Adjust the size as needed
            />} className='navbar-link' />
        <BottomNavigationAction sx={{
          '&.Mui-selected': {
            color: '#FED235', // Set label color to yellow when active
          },
          border: 'none', // Remove border
          outline: 'none', // Remove outline
          boxShadow: 'none', // Remove any box shadow that may appear on click/focus
          '&:hover': {
            color:'#FED235'
          },
          '&:focus': {
            outline: 'none', // Remove the outline when the button is focused
          },
          '&:active': {
            // Ensure no background color on active (click)
            boxShadow: 'none', // Remove box shadow on active state
          },
          transition: 'none',
        }} label="Monthly Groceries"
          icon={<img
            src="/shopping-basket.png"
            alt="Fresh"
            style={{ width: '24px', height: '24px' }} // Adjust the size as needed
          />}
          onClick={() => handleNavigation('/groceries')} className='navbar-link' />
        <BottomNavigationAction sx={{
          '&.Mui-selected': {
            color: '#FED235', // Set label color to yellow when active
          },
          border: 'none', // Remove border
          outline: 'none', // Remove outline
          boxShadow: 'none', // Remove any box shadow that may appear on click/focus
          '&:hover': {
            color:'#FED235'
          },
          '&:focus': {
            outline: 'none', // Remove the outline when the button is focused
          },
          '&:active': {
            // Ensure no background color on active (click)
            boxShadow: 'none', // Remove box shadow on active state
          },
          transition: 'none',
        }} label="Profile" icon={<img
          src="/user.png"
          alt="Fresh"
          style={{ width: '24px', height: '24px' }} // Adjust the size as needed
        />} onClick={HandelProfile} className='navbar-link' />
      </BottomNavigation>

    </header>
  );
}


// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <Header />
//     </ThemeProvider>
//   );
// }

export default Header;

