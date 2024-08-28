import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {useLocation, useParams} from 'react-router-dom'
import { getProduct } from '../../actions/productAction';
import Loader from '../Layouts/Loader';
import MetaData from '../Layouts/MetaData';
import AddCart from './AddCart';


const ProductDetail = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    const {id} = useParams();
    // console.log(id)
    const { product, loading} = useSelector((state) => state.productState)

    useEffect(() =>{
        dispatch(getProduct(id))
    },[dispatch,id])


    return (
        <Fragment>
         {loading ? <Loader/>:
         <Fragment>
            <MetaData title={product.name}/>
            {product && product.images && product.images.length > 0 ? (
                 <div className="row f-flex justify-content-around">
                 <div className="col-12 col-lg-5 img-fluid" id="product_image">
                     <img className="d-block w-100" src={product.images[0].image} alt={product.name} height="400" width="400" />
                 </div>
     
                 <div className="col-12 col-lg-5 mt-5">
                     <h3>{product.name}</h3>
                     <hr />
     
                     <div className="rating-outer">
                         <div className="rating-inner" style={{ width: `${product.ratings / 5 * 100}%` }}></div>
                     </div>
                     <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
     
                     <hr />
     
                     <p id="product_price">${product.price}</p>
                     {/* <div className="stockCounter d-inline">
                         <span className="btn btn-danger minus">-</span>
     
                         <input type="number" className="form-control count d-inline" value="1" readOnly />
     
                         <span className="btn btn-primary plus">+</span>
                     </div> */}
                     {/* <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4">Add to Cart</button> */}
                     <AddCart productId={id} />
     
                     <hr />
     
                     {/* <p>Status: <span id="stock_status">In Stock</span></p> */}
     
                     {/* <hr /> */}
     
                     {/* <h4 className="mt-2">Description:</h4>
                     <p>Processor: Intel i5-1235U (3.30 GHz up to 4.40 GHz), 10 Cores & 12MB Cache
                         RAM & Storage: 8GB, 8Gx1, DDR4, 2666MHz Ach & 512GB SSD
                         Display & Graphics: 15.6" FHD WVA AG 120Hz 250 nits Narrow Border & Integrated Graphics</p>
                     <hr />
                     <p id="product_seller mb-3">Sold by: <strong>Amazon</strong></p> */}
     
                     <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                         Submit Your Review
                     </button>
     
                     <div className="row mt-2 mb-5">
                         <div className="rating w-50">
     
                             <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                 <div className="modal-dialog" role="document">
                                     <div className="modal-content">
                                         <div className="modal-header">
                                             <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                             <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                 <span aria-hidden="true">&times;</span>
                                             </button>
                                         </div>
                                         <div className="modal-body">
     
                                             <ul className="stars" >
                                                 <li className="star"><i className="fa fa-star"></i></li>
                                                 <li className="star"><i className="fa fa-star"></i></li>
                                                 <li className="star"><i className="fa fa-star"></i></li>
                                                 <li className="star"><i className="fa fa-star"></i></li>
                                                 <li className="star"><i className="fa fa-star"></i></li>
                                             </ul>
     
                                             <textarea name="review" id="review" className="form-control mt-3">
     
                                             </textarea>
     
                                             <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close">Submit</button>
                                         </div>
                                     </div>
                                 </div>
                             </div>
     
                         </div>
     
                     </div>
                 </div>
     
             </div>

            ): (
                <p>No product images found</p>
            )}
        
         </Fragment>
         }
        </Fragment>
    

    
)}

export default ProductDetail
