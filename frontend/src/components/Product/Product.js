import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import AddCart from './AddCart';
import { addCartItem } from '../../actions/cartActions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'



const Product = ({ products, category }) => {
    console.log("product", products)
    // const {id} = useParams();
    // console.log(category)
    const [weight, setWeight] = useState({});
    const [quantity, setQuantity] = useState(1)
    const [selectedProduct, setSelectedProduct] = useState(null);
    const dispatch = useDispatch();
    // console.log(weight)
    const handleWeightChange = (productId, weight) => {
        setWeight(prevWeights => ({ ...prevWeights, [productId]: weight }));
        setSelectedProduct(productId);
    };

    const calculateRate = (price, weight) => {
        return (price * weight).toFixed(2);
    };

    const handleAddToCart = (product) => {
        // console.log(product)
        const productWeight = weight[product._id];
        //   console.log(productWeight);
        if (selectedProduct) {
            dispatch(addCartItem({ productId: selectedProduct, quantity, productWeight }));
            // Reset selected product and quantity

            toast('Item added succesfully!', {
                type: 'success',
                position: "bottom-center",
            });
            setSelectedProduct(null);
            setQuantity(1);
            setWeight({})
        } else {
            toast('Please select weight', {
                type: 'error',
                position: "bottom-center",
            });
        }
    };

    const capitalizeFirstLetter = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    return (
        <div className="container mt-5">
            <div className="table-responsive">
                <table className="table table-bordered " >
                    <thead >
                        <tr>
                            <th>S.No</th>
                            <th>Products Image</th>
                            <th>Products Name</th>
                            <th>Price</th>
                            <th>Weight</th>
                            <th>Rate (As Per Weight)</th>
                            <th>Stock</th>
                            <th>Add to Cart</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.map((product,index) => (
                            <tr key={product._id}>
                                <td className="serial-number">{index+1}</td>
                                <td className="Products Image" style={{width:'15rem'}}>
                                    {product.images[0] && product.images[0].image && (
                                        <img
                                            // className="img-fluid"
                                            className="img-size"
                                            src={product.images[0].image}
                                            alt={capitalizeFirstLetter(product.englishName)}
                                        />
                                    )}
                                </td>
                                <td className="Products Name">
                                    {capitalizeFirstLetter(product.englishName)}/{capitalizeFirstLetter(product.tamilName)}
                                  
                                </td>
                               

                                <td className="Price">Rs.{product.price} 
                                {product.category === 'Keerai'?'(per piece)':'(per kg)'}</td>
                                <td className="Weight">
                                    <select
                                        value={weight[product._id] || ''}
                                        onChange={(e) => handleWeightChange(product._id, parseFloat(e.target.value))}
                                        className="form-select"
                                    >
                                        <option value=""> Select</option>
                                        {product.category === 'Keerai'
                                            ? [...Array(10).keys()].map(i => (
                                                <option key={i} value={i + 1}>{i + 1} </option>
                                            ))
                                            : [...Array(20).keys()].map(i => (
                                                <option key={i} value={(i + 1) * 0.5}>{(i + 1) * 0.5} kg</option>
                                            ))}
                                    </select>
                                </td>
                                <td className="Rate (As Per Weight)">
                                    {weight[product._id] ? `Rs.${calculateRate(product.price, weight[product._id])}` : 'Rs.0.00'}
                                </td>
                                <td className="Stock">{product.stocks}</td>
                                <td className="Add to Cart">
                                   
                                    <button className="btn d-inline ml-4" 
                                    onClick={()=>handleAddToCart(product)}
                                    style={{
                                        backgroundColor:" #02441E", 
                                        color:"white",
                                         borderRadius:"40px",
                                         cursor: product.stocks === 'Available' ? 'pointer' : 'not-allowed'
                                         }}
                                         disabled={product.stocks === 'Not Available'}
                                         >Add</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Product
