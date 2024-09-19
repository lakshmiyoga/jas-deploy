import React, { useEffect } from 'react';
import { Link, useLocation } from "react-router-dom"
import { getProducts } from '../actions/productsActions'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import Loader from './Layouts/Loader';
import Search from './Layouts/Search';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';

const LandingPage = () => {
  // const dispatch = useDispatch();
  const location = useLocation();
  sessionStorage.setItem('redirectPath', location.pathname);
  const { products, loading, error } = useSelector((state) => state.productsState);
  

  // //  console.log(products);

  //   useEffect(() => {
  //       if (error) {
  //           return toast.error(error, { position: "bottom-center" });
  //       }
  //       dispatch(getProducts());

  //   }, [error, dispatch])
  return (
    <div> 
      {/* <Header/> */}
      
      <div className="products_heading">Home</div>
      

      <div className="container " style={{ marginTop: '60px' }}>

        {
          loading ? <Loader /> : (
            <div className="row d-flex justify-content-center">
              
              <div className="col-sm-12 col-md-6 col-lg-3 my-3 landingpage-card">
              <Link to="/vegetables" state={{ category: 'Vegetables' }} style={{ textDecoration: 'none' }}>
                <div className="card p-3 rounded" >
                    <div className="d-flex justify-content-center align-items-center">
                      <img
                        className="card-img-top mx-auto"
                        src="../images/vegetables.jpg"
                        alt="Vegetables"
                      />
                    </div>
                 
                  <div className="card-body d-flex flex-column">
                    {/* <h5 className="card-title"> */}
                      <h3 className="card-title">Vegetables</h3>
                    {/* </h5> */}
                  </div>
                </div>
                </Link>
              </div>
              
             
              <div className="col-sm-12 col-md-6 col-lg-3 my-3 landingpage-card">
              <Link to="/fruits" state={{ category: 'Fruits' }} style={{ textDecoration: 'none' }}>
                <div className="card p-3 rounded">
                 
                    <div className="d-flex justify-content-center align-items-center">
                      <img
                        className="card-img-top mx-auto"
                        src="../images/fruits.jpg"
                        alt="fruits"
                      />
                    </div>
                 
                  <div className="card-body d-flex flex-column">
                    {/* <h5 className="card-title"> */}
                      <h3 className="card-title">Fruits</h3>
                    {/* </h5> */}
                  </div>
                </div>
                </Link>
              </div>
             
              
              <div className="col-sm-12 col-md-6 col-lg-3 my-3 landingpage-card">
              <Link to="/keerai" state={{ category: 'Keerai' }} style={{ textDecoration: 'none' }}>
                <div className="card p-3 rounded">
                
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    className="card-img-top mx-auto"
                    src="../images/products/arai_keerai.jpg"
                    alt="celeries"
                  />
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    {/* <h5 className="card-title"> */}
                      <h3 className="card-title">Keerai</h3>
                    {/* </h5> */}
                  </div>
                </div>
                </Link>
              </div>
             

            </div>
          )
        }

      </div>
      
    </div>
    
  );
};

export default LandingPage;
