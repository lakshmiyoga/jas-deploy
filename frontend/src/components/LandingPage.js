import React, { useEffect } from 'react';
import { Link, useLocation } from "react-router-dom"
import { getProducts } from '../actions/productsActions'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import Loader from './Layouts/Loader';
import Search from './Layouts/Search';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';
import MetaData from './Layouts/MetaData';
import { categoryGetSuccess } from '../slices/categorySlice';
import { getCategories } from '../actions/categoryAction';

const LandingPage = () => {
  const dispatch = useDispatch();
  // const location = useLocation();
  // sessionStorage.setItem('redirectPath', location.pathname);
  const { products, loading, error } = useSelector((state) => state.productsState);
  const { getcategory } = useSelector((state) => state.categoryState);



  console.log("getcategory", getcategory);

  //   useEffect(() => {
  //       if (error) {
  //           return toast.error(error, { position: "bottom-center" });
  //       }
  //       dispatch(getProducts());

  //   }, [error, dispatch])

  useEffect(() => {
    if (!getcategory) {
      dispatch(getCategories())
    }

  }, [])

  return (
    <div>
      {/* <Header/> */}

      <div className="products_heading">Home</div>

      {/* <MetaData title={'Jas Home'} /> */}
      <MetaData
        title="Jas Home"
        description="Discover a wide variety of fresh fruits,vegetables and keerai at our store. Search, filter, and explore organic and high-quality fruits, vegetables and keerai to add to your shopping cart."
      />
      <div className="container " style={{ marginTop: '60px' }}>

        {
          loading ? <Loader /> : (

            <div className="row d-flex justify-content-center">
              {getcategory && getcategory.map((categoryItem) => (
                <div key={categoryItem._id} className="col-6 col-xs-5 col-sm-6 col-md-4 col-lg-3 my-3 landingpage-category-card ">
                  <Link
                    to={`/categories/${categoryItem.category}`} // Dynamic link based on category name
                    state={{ category: categoryItem.category }}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="card p-1 rounded">
                      <div className="d-flex justify-content-center align-items-center square-card">
                        <div className="card-content">
                        {categoryItem.images && categoryItem.images.length > 0 ? (
                          <img
                            className="card-img-top-vegetable"
                            src={categoryItem.images[0].image} // Adjust if the image path differs
                            alt={categoryItem.name}
                          />
                        ) : (
                          <div className="card-img-top-vegetable">No Image</div>
                        )}
                        <div className="card-body d-flex flex-column">
                        <h3 className="card-title-vegetable">{categoryItem.name}</h3>
                        {/* {categoryItem.description && (
                          <p className="card-title-vegetable">{categoryItem.description}</p>
                        )} */}
                      </div>
                      </div>
                        </div>
                       
                    </div>
                  </Link>
                </div>
              ))}
            </div>

           
           
              //   <div style={{ display: 'flex', flexDirection: 'row', position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              //     <div className="card card-vegetbles col-sm-12 col-md-6 col-lg-3 my-3 landingpage-card-vegetables">
              //        {getcategory && getcategory.map((categoryItem) => (
                  
              //       <Link
              //         to={`/categories/${categoryItem.category}`} // Dynamic link based on category name
              //         state={{ category: categoryItem.category }}
              //         style={{ textDecoration: 'none' }}
              //       >
              //         <div className="square-card">
              //           <div className="card-content">
              //             {categoryItem.images && categoryItem.images.length > 0 ? (
              //               <img
              //                 className="card-img-top-vegetable"
              //                 src={categoryItem.images[0].image} // Adjust if the image path differs
              //                 alt={categoryItem.name}
              //               />
              //             ) : (
              //               <div className="card-img-top-vegetable">No Image</div>
              //             )}
              //             {/* <div className="card-title-vegetable">Vegetables</div> */}
              //             <h3 className="card-title-vegetable">{categoryItem.name}</h3>
              //           </div>


              //         </div>
              //       </Link>
                 
              // ))}
              //  </div>
              //   </div>




          )
        }

      </div>

    </div>
    // <div className="row d-flex justify-content-center">

    //   <div className="col-sm-12 col-md-6 col-lg-3 my-3 landingpage-card">
    //     <Link to="/vegetables" state={{ category: 'Vegetables' }} style={{ textDecoration: 'none' }}>
    //       <div className="card p-3 rounded" >
    //         <div className="d-flex justify-content-center align-items-center">
    //           <img
    //             className="card-img-top mx-auto"
    //             src="../images/vegetables.jpg"
    //             alt="Vegetables"
    //           />
    //         </div>

    //         <div className="card-body d-flex flex-column">

    //           <h3 className="card-title">Vegetables</h3>

    //         </div>
    //       </div>
    //     </Link>
    //   </div>


    //   <div className="col-sm-12 col-md-6 col-lg-3 my-3 landingpage-card">
    //     <Link to="/fruits" state={{ category: 'Fruits' }} style={{ textDecoration: 'none' }}>
    //       <div className="card p-3 rounded">

    //         <div className="d-flex justify-content-center align-items-center">
    //           <img
    //             className="card-img-top mx-auto"
    //             src="../images/fruits.jpg"
    //             alt="fruits"
    //           />
    //         </div>

    //         <div className="card-body d-flex flex-column">

    //           <h3 className="card-title">Fruits</h3>

    //         </div>
    //       </div>
    //     </Link>
    //   </div>


    //   <div className="col-sm-12 col-md-6 col-lg-3 my-3 landingpage-card">
    //     <Link to="/keerai" state={{ category: 'Keerai' }} style={{ textDecoration: 'none' }}>
    //       <div className="card p-3 rounded">

    //         <div className="d-flex justify-content-center align-items-center">
    //           <img
    //             className="card-img-top mx-auto"
    //             src="../images/products/arai_keerai.jpg"
    //             alt="celeries"
    //           />
    //         </div>

    //         <div className="card-body d-flex flex-column">

    //           <h3 className="card-title">Keerai</h3>

    //         </div>
    //       </div>
    //     </Link>
    //   </div>


    // </div>

    // <div>
    //   <div className="products_heading">Home</div>
    // <div className="container mt-4">
    //         {/* <h2 className="text-center mb-4">Product Categories</h2> */}
    //         <div className="row">
    //             {getcategory && getcategory.map((categoryItem) => (
    //                 <div key={categoryItem._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
    //                     <div className="category-card shadow-sm">
    //                         {categoryItem.images && categoryItem.images.length > 0 ? (
    //                             <img
    //                                 src={categoryItem.images[0].image} // Adjust if image path differs
    //                                 alt={categoryItem.name}
    //                                 className="category-card-img"
    //                             />
    //                         ) : (
    //                             <div className="category-card-img-placeholder">
    //                                 No Image
    //                             </div>
    //                         )}
    //                         <div className="category-card-body">
    //                             <h5 className="category-card-title">{categoryItem.name}</h5>
    //                             {/* <p className="category-card-category">{categoryItem.category}</p> */}
    //                             {categoryItem.description && (
    //                                 <p className="category-card-description">{categoryItem.description}</p>
    //                             )}
    //                         </div>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    //     </div>
  );
};

export default LandingPage;