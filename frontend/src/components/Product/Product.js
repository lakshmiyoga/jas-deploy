import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addCartItem } from '../../actions/cartActions';
import NumberInput from '../Layouts/NumberInput';
import { useLocation } from 'react-router-dom';

const Product = ({ products, category }) => {
    const [weight, setWeight] = useState({});
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);

    console.log("products",products)

    const handleWeightChange = (productId, value) => {
        const weightValue = parseFloat(value);
        setWeight(prevWeights => ({ ...prevWeights, [productId]: weightValue }));
    };
    // const handleWeightChange = (productId, value) => {
    //     const weightValue = parseFloat(value);
    //     // if (!isNaN(weightValue) && weightValue < 0.2) {
    //     //     setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //     // } 
    //     if (!isNaN(weightValue) && weightValue < 0.25) {
    //         setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //         toast.error('the value should not be less than 0.25kg')
    //     } 
    //     else {
    //         // Optionally, you can show an error or reset the weight if the value is invalid
    //         setWeight(prevWeights => ({ ...prevWeights, [productId]: weightValue }));  
    //     }
    // };


    const calculateRate = (price, weight) => {
        return (price * weight).toFixed(2);
    };

    const handleAddToCart = (product, productId) => {

        const productWeight = weight[product._id];
        if (!isNaN(productWeight) && productWeight < 0.25) {
            setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
            return toast('The value should not be less than 0.25kg', {
                type: 'error',
                position: 'bottom-center',
            });

        }
        if (productWeight >= 0.25) {
            dispatch(addCartItem({ productId: product._id, quantity, productWeight }));
            toast('Item added successfully!', {
                type: 'success',
                position: 'bottom-center',
            });
            setQuantity(1);
            setWeight(prevWeights => ({ ...prevWeights, [product._id]: undefined })); // Reset weight for the added product
        } else {
            toast('Please select weight for the correct item', {
                type: 'error',
                position: 'bottom-center',
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
        <div className="container mt-2  table-product">
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Products Image</th>
                            <th>Products Name</th>
                            <th>Price</th>
                            {category === 'Keerai' ? <th>Weight(Piece)</th>:<th>Weight(KG)</th>}   
                            <th>Rate (As Per Weight)</th>
                            <th>Stock</th>
                            <th>Add to Cart</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.map((product, index) => (
                            <tr key={product._id}>
                                <td className="serial-number">{index + 1}</td>
                                <td className="products-image">
                                    {product.images[0] && product.images[0].image && (
                                        <img
                                            className="img-size"
                                            src={product.images[0].image}
                                            alt={capitalizeFirstLetter(product.englishName)}
                                        />
                                    )}
                                </td>
                                <td className="Products Name" style={{fontSize:'17px'}}>
                                    {capitalizeFirstLetter(product.englishName)}/{capitalizeFirstLetter(product.tamilName)}
                                </td>
                                <td className="Price" style={{whiteSpace:'nowrap'}}>Rs.{product.price}
                                    {product.category === 'Keerai' ? '(per piece)' : '(per kg)'}</td>
                                {/* <td className="Weight">
                                    <select
                                        value={weight[product._id] || ''}
                                        onChange={(e) => handleWeightChange(product._id, parseFloat(e.target.value))}
                                        className="form-select"
                                    >
                                        <option value="">Select</option>
                                        {product.category === 'Keerai'
                                            ? [...Array(10).keys()].map(i => (
                                                <option key={i} value={i + 1}>{i + 1}</option>
                                            ))
                                            : [...Array(20).keys()].map(i => (
                                                <option key={i} value={(i + 1) * 0.5}>{(i + 1) * 0.5} kg</option>
                                            ))}
                                    </select>
                                </td> */}
                                <td className="Weight">
                                    <NumberInput
                                        // list={`weight-options-${product._id}`}
                                        value={weight[product._id] || ''}
                                        onChange={(e) => handleWeightChange(product._id, e.target.value)}
                                        onFocus={(e) => {
                                            e.target.setAttribute('list', `weight-options-${product._id}`);
                                        }}
                                        onBlur={(e) => {
                                            setTimeout(() => e.target.removeAttribute('list'), 100);
                                        }}
                                        className="form-select no-arrow-input form-control custom-placeholder"
                                        placeholder={product && product.category === 'Keerai'?"Select/type Piece":"Select/type weight in Kg"}
                                        // step="0.01"
                                        // min="0.25"
                                        type="number"
                                    />
                                    <datalist id={`weight-options-${product._id}`}>
                                        {product.category === 'Keerai'
                                            ? [...Array(10).keys()].map(i => (
                                                <option key={i} value={i + 1}>{i + 1}</option>
                                            ))
                                            : [...Array(20).keys()].map(i => (
                                                <option key={i} value={(i + 1) * 0.5}></option>
                                            ))}
                                    </datalist>
                                </td>
                                
                                <td className="Rate (As Per Weight)">
                                    {weight[product._id] ? `Rs.${calculateRate(product.price, weight[product._id])}` : 'Rs.0.00'}
                                </td>
                                <td className="Stock">{product.stocks}</td>
                                <td className="Add to Cart">
                                    <button
                                        className="btn-add "
                                        onClick={() => handleAddToCart(product)}
                                        style={{
                                            backgroundColor: "#02441E",
                                            color: "white",
                                            borderRadius: "40px",
                                            cursor: product.stocks === 'Available' ? 'pointer' : 'not-allowed'
                                        }}
                                        disabled={product.stocks === 'Not Available'}
                                    >
                                        Add
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Product;
