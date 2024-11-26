

// import React, { useEffect, useState } from 'react';
// import { Link, useLocation } from "react-router-dom"
// import { getProducts } from '../actions/productsActions'
// import { useDispatch, useSelector } from 'react-redux'
// import { toast } from 'react-toastify';
// import Loader from './Layouts/Loader';
// import Search from './Layouts/Search';
// import Header from './Layouts/Header';
// import Footer from './Layouts/Footer';
// import MetaData from './Layouts/MetaData';
// import { categoryGetSuccess } from '../slices/categorySlice';
// import { getCategories } from '../actions/categoryAction';

// const LandingPage = () => {
//   const dispatch = useDispatch();
//   // const location = useLocation();
//   // sessionStorage.setItem('redirectPath', location.pathname);
//   const { products, loading, error } = useSelector((state) => state.productsState);
//   const { getcategory } = useSelector((state) => state.categoryState);
//   const [types, setTypes] = useState(['Fresh', 'Groceries'])


//   console.log("getcategory", getcategory);


//   useEffect(() => {
//     if (!getcategory) {
//       dispatch(getCategories())
//     }

//   }, [])


//   return (
//     <div>


//       <div className="products_heading">Home</div>


//       <MetaData
//         title="Jas Home"
//         description="Discover a wide variety of fresh fruits,vegetables and keerai at our store. Search, filter, and explore organic and high-quality fruits, vegetables and keerai to add to your shopping cart."
//       />
//       <div className="container " style={{ marginTop: '60px' }}>

//         {
//           loading ? <Loader /> : (



//             <div className="container" style={{ marginTop: '60px' }}>
//               <div className="row d-flex justify-content-center">

//                 {/* <div className="col-6 col-xs-5 col-sm-6 col-md-4 col-lg-3 my-3 landingpage-category-card">
//                   <Link to={`/types/${getcategory.type}`}
//                   state={{ category: getcategory.category, type: getcategory.type}}
//                   style={{ textDecoration: 'none' }}>
//                     <div className="card p-1 rounded">
//                       <div className="d-flex justify-content-center align-items-center square-card">
//                         <img
//                           src="../images/fruits.jpg" 
//                           alt="Fruits & Vegetables"
//                           className='card-img-top-vegetable'
//                         />
//                       </div>
//                       <div className="card-body d-flex flex-column">
//                         <h3 className="card-title-vegetable">Fruits & Vegetables</h3>
//                       </div>
//                     </div>
//                   </Link>
//                 </div>

               
//                 <div className="col-6 col-xs-5 col-sm-6 col-md-4 col-lg-3 my-3 landingpage-category-card">
//                   <Link to={`/types/${getcategory.type}`} 
//                   state={{ category: getcategory.category, type: getcategory.type}}
//                   style={{ textDecoration: 'none' }}>
//                     <div className="card p-1 rounded">
//                       <div className="d-flex justify-content-center align-items-center square-card">
//                         <img
//                           src="../images/all.jpg"
//                           alt="Groceries"
//                           className='card-img-top-vegetable'
//                         />
//                       </div>
//                       <div className="card-body d-flex flex-column">
//                         <h3 className="card-title-vegetable">Monthly Groceries</h3>
//                       </div>
//                     </div>
//                   </Link>
//                 </div> */}

//                 {types.map((type, index) => (
//                   <div key={index} className="col-6 col-sm-6 col-md-4 col-lg-3 my-3 landingpage-category-card">
//                     {/* Conditional rendering based on type */}
//                     {type === 'Fresh' ? (
//                       <Link to={`/types/${type}`} 
//                       state={{ type: type}}
//                       style={{ textDecoration: 'none' }}>
//                       <div className="card p-1 rounded">
//                         <div className="d-flex justify-content-center align-items-center square-card">
//                           <img src="../images/fruits.jpg" alt="Fresh Products" className='card-img-top-vegetable' />
//                         </div>
//                         <div className="card-body d-flex flex-column">
//                           <h3 className="card-title-vegetable">Fresh Products</h3>
//                         </div>
                        
//                       </div>
//                       </Link>
//                     ) : type === 'Groceries' ? (
//                       <Link to={`/types/${type}`} 
//                       state={{ type: type}}
//                       style={{ textDecoration: 'none' }}>
//                       <div className="card p-1 rounded">
//                         <div className="d-flex justify-content-center align-items-center square-card">
//                           <img src="../images/all.jpg" alt="Groceries" className='card-img-top-vegetable' />
//                         </div>
//                         <div className="card-body d-flex flex-column">
//                           <h3 className="card-title-vegetable">Monthly Groceries</h3>
//                         </div>
//                       </div>
//                       </Link>
//                     ) : null}
//                   </div>
//                 ))}
//               </div>
//             </div>

//           )
//         }


//       </div>

//     </div>

//   );
// };

// export default LandingPage;


import React, { useEffect } from 'react';
import { Link, useLocation, useParams } from "react-router-dom"
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
  const location = useLocation();
  // sessionStorage.setItem('redirectPath', location.pathname);
  const { categoryItem } = location.state || {} ;
  const { category } = useParams();
  console.log("category",category)
   
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

  const filteredCategories = getcategory?.filter(
    (item) => item.type === category
  );

  console.log("filteredCategories",filteredCategories)


  return (
    <div>
      {/* <Header/> */}

      <div className="products_heading">{categoryItem && categoryItem.name}</div>

      {/* <MetaData title={'Jas Home'} /> */}
      <MetaData
        title="Jas Home"
        description="Discover a wide variety of fresh fruits,vegetables and keerai at our store. Search, filter, and explore organic and high-quality fruits, vegetables and keerai to add to your shopping cart."
      />
      <div className="container " style={{ marginTop: '60px' }}>

        {
          loading ? <Loader /> : (

            <div className="row d-flex justify-content-center">
              {filteredCategories && filteredCategories.map((categoryItem) => (
                <div key={categoryItem._id} className="col-6 col-xs-5 col-sm-6 col-md-4 col-lg-3 my-3 landingpage-category-card ">
                  <Link
                    to={`/categories/${categoryItem.category}`} // Dynamic link based on category name
                    state={{ category: categoryItem.category ,type: categoryItem.type }}
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



          )
        }

      </div>

    </div>
   
  );
};

export default LandingPage;