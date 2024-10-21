import React from 'react'
import Sidebar from './Sidebar'
import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from "react";
import { getAdminProducts } from "../../actions/productsActions";
import {getUsers, loadUser} from "../../actions/userActions";
import {adminOrders as adminOrdersAction} from '../../actions/orderActions'
import {Link, useLocation} from 'react-router-dom'
import { getEnquiryDetails } from '../../actions/enquiryActions';
import LoaderButton from '../Layouts/LoaderButton';
import store from '../../store';
import MetaData from '../Layouts/MetaData';
 
const Dashboard = ({isActive,setIsActive}) => {
 
    const { products  } = useSelector( state => state.productsState);
    const {enquiry } = useSelector(state => state.enquiryState);
    const { users  } = useSelector( state => state.userState);
    const { adminOrders  } = useSelector( state => state.orderState);
    const dispatch = useDispatch();
    // const { isAuthenticated, user } = useSelector(state => state.authState);

    // useEffect(()=>{
    //   if(!isAuthenticated){
    //     store.dispatch(loadUser());  
    //   }
    // },[isAuthenticated])

    console.log("adminOrders",adminOrders)

    let totalAmount = 0;
    if (adminOrders && adminOrders.length > 0) {
        adminOrders.forEach( order => {
          if(order.paymentStatus === 'CHARGED')
            totalAmount += order.totalPrice
        })
    }


    // useEffect( () => {
    //     dispatch(getAdminProducts());
    //     // dispatch(getEnquiryDetails());
    //     // dispatch(getUsers());
    //     // dispatch(adminOrdersAction());
    //  }, [dispatch])

    //  useEffect(()=>{
    //   if(!enquiry){
    //     dispatch(getEnquiryDetails());
    //   }
    //   if(!adminOrders){
    //     dispatch(adminOrdersAction());
    //   }
    //   if(!users){
    //     dispatch(getUsers());
    //   }

    //   if(!products){
    //     dispatch(getAdminProducts());
    //   }
     
    //  },[enquiry,adminOrders,users,products])

     useEffect(()=>{
      if(!enquiry){
        dispatch(getEnquiryDetails());
      }
     
     },[enquiry])

     useEffect(()=>{
      if(!adminOrders){
        dispatch(adminOrdersAction());
      }
     },[adminOrders])

     useEffect(()=>{
      if(!users){
        dispatch(getUsers());
      }
     
     },[users])

     useEffect(()=>{
      if(!products){
        dispatch(getAdminProducts());
      }
     
     },[products])
 
// console.log(enquiry)
// console.log(products)
    return (
        // <div className="row">
        //     <div className="col-2 ">
        //         <Sidebar />
        //     </div>
        //     <div className="col-10 ">
        //         <h1 className="my-4">Dashboard</h1>
        //         <div className="row pr-4">
        //             <div className="col-xl-12 col-sm-12 mb-3">
        //                 <div className="card text-white o-hidden h-100" style={{backgroundColor:'#02441E'}}>
        //                     <div className="card-body">
        //                         <div className="text-center card-font-size">Total Amount<br /> <b>Rs.{parseFloat(totalAmount).toFixed(2)}</b>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div> 

        //         <div className="row pr-4">
        //             <div className="col-xl-3 col-sm-6 mb-3">
        //                 <div className="card text-white o-hidden h-100" style={{backgroundColor:'#FED235'}}>
        //                     <div className="card-body">
        //                         <div className="text-center card-font-size">Products<br /> <b>{products.length}</b></div>
        //                     </div>
        //                     <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
        //                         <span className="float-left">View Details</span>
        //                         <span className="float-right">
        //                             <i className="fa fa-angle-right"></i>
        //                         </span>
        //                     </Link>
        //                 </div>
        //             </div>


        //             <div className="col-xl-3 col-sm-6 mb-3">
        //                 <div className="card text-white o-hidden h-100" style={{backgroundColor:'#02441E'}}>
        //                     <div className="card-body">
        //                         <div className="text-center card-font-size">Orders<br /> <b>{adminOrders.length}</b></div>
        //                     </div>
        //                     <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
        //                         <span className="float-left">View Details</span>
        //                         <span className="float-right">
        //                             <i className="fa fa-angle-right"></i>
        //                         </span>
        //                     </Link>
        //                 </div>
        //             </div>


        //             <div className="col-xl-3 col-sm-6 mb-3">
        //                 <div className="card text-white o-hidden h-100" style={{backgroundColor:'#FED235'}}>
        //                     <div className="card-body">
        //                         <div className="text-center card-font-size">Users<br /> <b>{users.length}</b></div>
        //                     </div>
        //                     <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
        //                         <span className="float-left">View Details</span>
        //                         <span className="float-right">
        //                             <i className="fa fa-angle-right"></i>
        //                         </span>
        //                     </Link>
        //                 </div>
        //             </div>
        //             <div className="col-xl-3 col-sm-6 mb-3">
        //                 <div className="card text-white o-hidden h-100" style={{backgroundColor:'#02441E'}}>
        //                     <div className="card-body">
        //                         <div className="text-center card-font-size">Enquiry<br /> <b>{enquiry && enquiry.length}</b></div>
        //                     </div>
        //                     <Link className="card-footer text-white clearfix small z-1" to="/getenquiry">
        //                         <span className="float-left">View Details</span>
        //                         <span className="float-right">
        //                             <i className="fa fa-angle-right"></i>
        //                         </span>
        //                     </Link>
        //                 </div>
        //             </div>

                

                    
        //         </div>
        //     </div>
        // </div>
<div >
<MetaData
  title="Admin Dashboard" 
  description="Access a comprehensive overview of your eCommerce store, including order statistics, sales performance, and user activity." 
/>

  <div className="row" style={{margin:'10px'}}>
    <div className="col-md-2 col-12">
    <div style={{display:'flex',flexDirection:'row',position:'fixed',top:'0px',zIndex:99999,backgroundColor:'#fff',minWidth:'100%'}}>
      <Sidebar isActive={isActive} setIsActive={setIsActive}/>
      </div>
    </div>
    <div className="col-md-10 col-12 smalldevice-space-dashboard ">

      <h1 className="mb-4 admin-dashboard-x">Dashboard</h1>

      {/* Total Amount Card */}
      <div className="row" >
        <div className="col-12 mb-3">
          <div className="card text-white o-hidden h-100" style={{ backgroundColor: '#02441E' }}>
            <div className="card-body">
              <div className="text-center card-font-size">
                Total Amount<br />
                <b>Rs.{parseFloat(totalAmount).toFixed(2)}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Cards */}
      <div className="row " style={{display:'flex',justifyContent:'center',alignItems:'center',flexWrap:'wrap'}}> 
        <div className="col-lg-3 col-md-3 col-6 mb-3">
          <div className="card text-white o-hidden h-100" style={{ backgroundColor: '#FED235' }}>
            <div className="card-body">
              <div className="text-center card-font-size">
                Products<br />
                <b>{products && products.length ? products.length : <LoaderButton fullPage={false} size={20} />}</b>
              </div>
            </div>
            <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
              <span className="float-left">View Details</span>
              <span className="float-right">
                <i className="fa fa-angle-right"></i>
              </span>
            </Link>
          </div>
        </div>

        <div className="col-lg-3 col-md-3 col-6 mb-3">
          <div className="card text-white o-hidden h-100" style={{ backgroundColor: '#02441E' }}>
            <div className="card-body">
              <div className="text-center card-font-size">
                Orders<br />
                <b>{adminOrders && adminOrders.length ? adminOrders.length :<LoaderButton fullPage={false} size={20} />}</b>
              </div>
            </div>
            <Link className="card-footer text-white clearfix small z-1" to="/admin/allorders">
              <span className="float-left">View Details</span>
              <span className="float-right">
                <i className="fa fa-angle-right"></i>
              </span>
            </Link>
          </div>
        </div>

        <div className="col-lg-3 col-md-3 col-6 mb-3">
          <div className="card text-white o-hidden h-100" style={{ backgroundColor: '#FED235' }}>
            <div className="card-body">
              <div className="text-center card-font-size">
                Users<br />
                <b>{users && users.length ?  users.length :<LoaderButton fullPage={false} size={20} />}</b>
              </div>
            </div>
            <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
              <span className="float-left">View Details</span>
              <span className="float-right">
                <i className="fa fa-angle-right"></i>
              </span>
            </Link>
          </div>
        </div>

        <div className="col-lg-3 col-md-3 col-6 mb-3">
          <div className="card text-white o-hidden h-100" style={{ backgroundColor: '#02441E' }}>
            <div className="card-body">
              <div className="text-center card-font-size">
                Enquiry<br />
                <b>{enquiry && enquiry.length ? enquiry.length :<LoaderButton fullPage={false} size={20} />}</b>
              </div>
            </div>
            <Link className="card-footer text-white clearfix small z-1" to="/admin/getenquiry">
              <span className="float-left">View Details</span>
              <span className="float-right">
                <i className="fa fa-angle-right"></i>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


    )
}

export default Dashboard
