import React, { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import { userOrdersClear } from '../../slices/orderSlice';
import { clearUser, clearlogout, reset } from '../../slices/authSlice';
import { Slide, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../actions/userActions';

// import Search from './Search'
import { useDispatch, useSelector } from 'react-redux';

const SidebarButtons = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, loggedoutmessage, isloggedout } = useSelector(state => state.authState);
    const [refresh, setRefresh] = useState(false);

    const dispatch = useDispatch();
    const { loading, userOrders, error } = useSelector(state => state.orderState)

  const buttons = [
    { name: 'Profile', icon: <PersonIcon />, onClick: () =>  navigate('/myprofile') },
    // { name: 'Dashboard', icon: <DashboardIcon />, onClick: () =>navigate('/admin/dashboard') },
    ...(user.role === 'admin' || user.role === 'subadmin'
    ? [{ name: 'Dashboard', icon: <DashboardIcon />, onClick: () => navigate('/admin/dashboard') }]
    : []),
    { name: 'My Orders', icon: <ShoppingCartIcon />, onClick: () =>  navigate('/orders') },
    { name: 'Logout', icon: <LogoutIcon />, onClick: (e) =>  logoutHandler(e) },
  ];

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

  return (
    <div style={styles.container}>
      {buttons.map((button, index) => (
        <button
          key={index}
          style={styles.button}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          onClick={button.onClick}
        >
          <span style={styles.icon}>{button.icon}</span>
          <span style={styles.text}>{button.name}</span>
        </button>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop:'50px',
    gap: '15px', // Increased spacing between buttons
    padding: '20px', // Add padding around the button container
    backgroundColor: '#f9fafb', // Light background for the sidebar
    borderRadius: '10px', // Rounded corners for the container
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '15px 20px', // Added padding for larger clickable area
    backgroundColor: '#ffffff', // Button background
    border: '1px solid #e0e0e0', // Border for definition
    borderRadius: '8px', // Rounded button corners
    fontSize: '18px', // Slightly larger font
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.3s ease', // Smooth hover transition
    color: '#4a4a4a', // Neutral text color
  },
  buttonHover: {
    backgroundColor: '#e6f7ff', // Light blue hover effect
  },
  icon: {
    marginRight: '15px', // Increased spacing for better separation
    fontSize: '22px', // Larger icon size
    color: '#007bff', // Blue color for icons
  },
  text: {
    fontWeight: '600', // Bolder text
  },
};

export default SidebarButtons;
