import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Slide, toast } from 'react-toastify';
import { addCartItem } from '../../actions/cartActions';
import NumberInput from '../Layouts/NumberInput';
import { useLocation } from 'react-router-dom';

const Product = ({ products, category }) => {
    const [weight, setWeight] = useState({});
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const location = useLocation();
    const [weightvalue, setweightvalue] = useState(false);
    const [weighttoast, setWeightToast] = useState(false);
    const [correctWeight, setcorrectWeight] = useState(false)
    // sessionStorage.setItem('redirectPath', location.pathname);

    console.log("products", products)
    useEffect(() => {
        const initialWeights = products && products.reduce((acc, product) => {
            acc[product._id] = ''; // Set each product's weight as an empty string
            return acc;
        }, {});
        setWeight(initialWeights);
    }, [products]);

    // const handleWeightChange = (productId, value, productCategory, productMeasurement,maximumQuantity) => {
    //     // const weightValue = parseFloat(value);
    //     let validValue;
    //     if (productCategory === 'Keerai' || productMeasurement === 'Box' || productMeasurement === 'Grams' ) {
    //         validValue = value.match(/^\d*$/) ? value : weight[productId]; // Only whole numbers allowed
    //     } else {
    //         // For non-"Keerai", allow up to two decimal places
    //         validValue = value.match(/^\d*\.?\d{0,2}$/) ? value : weight[productId];
    //     }

    //     // Allow empty value for resetting
    //     if (value === '') {
    //         setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //         return;
    //     }

    //     const weightValue = parseFloat(validValue);

    //     if (weightValue < 0) {
    //         return;
    //     }

    //     // if (isNaN(weightValue) || value === '') {
    //     //     setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //     //     return;
    //     // }

    //     // Handling Keerai (bundle) weight
    //     if (!weightvalue) {
    //         if (productCategory === 'Keerai'|| productMeasurement === 'Grams') {
    //             if (weightValue > maximumQuantity) {
    //                 setweightvalue(true);
    //                 if (!weightvalue) {
    //                     toast.dismiss();
    //                     setTimeout(() => {
    //                         toast.error('Piece count cannot exceed 5', {
    //                             position: 'bottom-center',
    //                             type: 'error',
    //                             autoClose: 700,
    //                             transition: Slide,
    //                             hideProgressBar: true,
    //                             className: 'small-toast',
    //                         });
    //                         setweightvalue(false);
    //                     }, 300);
    //                     setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //                     return;
    //                 }
    //             }
    //         }
    //         else if (productMeasurement === 'Box') {
    //             if (weightValue > maximumQuantity) {
    //                 setweightvalue(true);
    //                 if (!weightvalue) {
    //                     toast.dismiss();
    //                     setTimeout(() => {
    //                         toast.error('Box count cannot exceed 5', {
    //                             position: 'bottom-center',
    //                             type: 'error',
    //                             autoClose: 700,
    //                             transition: Slide,
    //                             hideProgressBar: true,
    //                             className: 'small-toast',
    //                         });
    //                         setweightvalue(false);
    //                     }, 300);
    //                     setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //                     return;
    //                 }
    //             }
    //         }
    //         else if (weightValue > maximumQuantity) {
    //             // Handling non-Keerai weight limit (Kg)
    //             setweightvalue(true);
    //             if (!weightvalue) {
    //                 toast.dismiss();
    //                 setTimeout(() => {
    //                     toast.error('Weight cannot exceed 5Kg', {
    //                         position: 'bottom-center',
    //                         type: 'error',
    //                         autoClose: 700,
    //                         transition: Slide,
    //                         hideProgressBar: true,
    //                         className: 'small-toast',
    //                     });
    //                     setweightvalue(false);
    //                 }, 300);
    //                 setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //                 return;
    //             }
    //         }
    //         setWeight(prevWeights => ({ ...prevWeights, [productId]: weightValue }));
    //     }

    // };


    const handleWeightChange = (productId, value, productCategory, productMeasurement, maximumQuantity) => {
        // const weightValue = parseFloat(value);
        let validValue;
        if (productMeasurement === 'Kg') {
            // For non-"Keerai", allow up to two decimal places
            validValue = value.match(/^\d*\.?\d{0,2}$/) ? value : weight[productId];
        } else {
            validValue = value.match(/^\d*$/) ? value : weight[productId]; // Only whole numbers allowed
        }

        // Allow empty value for resetting
        if (value === '') {
            setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
            return;
        }

        const weightValue = parseFloat(validValue);

        if (weightValue < 0) {
            return;
        }
        if (!weightvalue) {
            if (productMeasurement) {
                if (weightValue > maximumQuantity) {
                    setweightvalue(true);
                    if (!weightvalue) {
                        toast.dismiss();
                        setTimeout(() => {
                            toast.error(`Cannot exceed ${maximumQuantity} ${productMeasurement}`, {
                                position: 'bottom-center',
                                type: 'error',
                                autoClose: 700,
                                transition: Slide,
                                hideProgressBar: true,
                                className: 'small-toast',
                            });
                            setweightvalue(false);
                        }, 300);
                        setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
                        return;
                    }
                }
            }
            setWeight(prevWeights => ({ ...prevWeights, [productId]: weightValue }));
        }

    };
    const calculateRate = (price, weight) => {
        return (price * weight).toFixed(2);
    };

    // const handleAddToCart = (product, productId) => {
    //     const productWeight = weight[product._id];

    //     if (product && (product.measurement === 'Piece' || product.measurement === 'Box' || product.measurement === 'Grams')) {
    //         // For Keerai, bundle validation
    //         if (!isNaN(productWeight) && productWeight <= 0) {
    //             setWeightToast(true);
    //             setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //             if (!weighttoast) {
    //                 toast.dismiss();
    //                 setTimeout(() => {
    //                     if (product.measurement === 'Piece' || product.measurement === 'Grams') {
    //                         toast.error('Please select atleast 1 Piece', {
    //                             position: 'bottom-center',
    //                             type: 'error',
    //                             autoClose: 700,
    //                             transition: Slide,
    //                             hideProgressBar: true,
    //                             className: 'small-toast',
    //                         });
    //                     } else if (product.measurement === 'Box') {
    //                         toast.error('Please select atleast 1 box', {
    //                             position: 'bottom-center',
    //                             type: 'error',
    //                             autoClose: 700,
    //                             transition: Slide,
    //                             hideProgressBar: true,
    //                             className: 'small-toast',
    //                         });
    //                     }
    //                     setWeightToast(false);
    //                 }, 300);
    //             }
    //             return;
    //         }

    //         // Adding Keerai to cart
    //         if (productWeight >= 1 && productWeight <= 10) {
    //             dispatch(addCartItem({ productId: product._id, quantity, productWeight }));
    //             toast.dismiss();
    //             setTimeout(() => {
    //                 toast.success('Item added to cart successfully!', {
    //                     position: 'bottom-center',
    //                     type: 'success',
    //                     autoClose: 700,
    //                     transition: Slide,
    //                     hideProgressBar: true,
    //                     className: 'small-toast',
    //                 });
    //             }, 300);
    //             setQuantity(1);
    //             setWeight(prevWeights => ({ ...prevWeights, [product._id]: '' }));
    //             return;
    //         } else {
    //             toast.dismiss();
    //             setTimeout(() => {
    //                 toast.error('Item should be between 1 and 10', {
    //                     position: 'bottom-center',
    //                     type: 'error',
    //                     autoClose: 700,
    //                     transition: Slide,
    //                     hideProgressBar: true,
    //                     className: 'small-toast',
    //                 });
    //             }, 300);
    //             return;
    //         }
    //     }

    //     // For non-Keerai products
    //     if (!isNaN(productWeight) && productWeight < 0.25) {
    //         setWeightToast(true);
    //         setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
    //         if (!weighttoast) {
    //             toast.dismiss();
    //             setTimeout(() => {
    //                 toast.error('The value should not be less than 0.25kg', {
    //                     position: 'bottom-center',
    //                     type: 'error',
    //                     autoClose: 700,
    //                     transition: Slide,
    //                     hideProgressBar: true,
    //                     className: 'small-toast',

    //                 });
    //                 setWeightToast(false);
    //             }, 300);
    //         }
    //         return;
    //     }

    //     if (productWeight >= 0.25) {
    //         dispatch(addCartItem({ productId: product._id, quantity, productWeight }));
    //         toast.dismiss();
    //         setTimeout(() => {
    //             toast.success('Item added to cart successfully!', {
    //                 position: 'bottom-center',
    //                 type: 'success',
    //                 autoClose: 700,
    //                 transition: Slide,
    //                 hideProgressBar: true,
    //                 className: 'small-toast',
    //             });
    //         }, 300);
    //         setQuantity(1);
    //         setWeight(prevWeights => ({ ...prevWeights, [product._id]: '' }));
    //         return;
    //     } else {
    //         setcorrectWeight(true);
    //         if (!correctWeight) {
    //             toast.dismiss();
    //             setTimeout(() => {
    //                 toast.error('Please select weight for the correct item', {
    //                     position: 'bottom-center',
    //                     type: 'error',
    //                     autoClose: 700,
    //                     transition: Slide,
    //                     hideProgressBar: true,
    //                     className: 'small-toast',
    //                 });
    //                 setcorrectWeight(false);
    //             }, 300);
    //         }
    //         return;
    //     }
    // };

    const handleAddToCart = (product, productId) => {
        const productWeight = weight[product._id];

        if (product && product.measurement) {
            // For Keerai, bundle validation
            if (!isNaN(productWeight) && productWeight <= 0) {
                setWeightToast(true);
                setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
                if (!weighttoast) {
                    toast.dismiss();
                    setTimeout(() => {
                        if (product.measurement) {
                            toast.error(product.measurement === 'Kg' ? `Please select atleast 0.25 ${product.measurement}` : `Please select atleast 1 ${product.measurement}`, {
                                position: 'bottom-center',
                                type: 'error',
                                autoClose: 700,
                                transition: Slide,
                                hideProgressBar: true,
                                className: 'small-toast',
                            });
                        }
                        setWeightToast(false);
                    }, 300);
                }
                return;
            }

            // Adding items to cart except kg
            if (product.measurement !== 'kg' && productWeight >= 1 && productWeight <= product.maximumQuantity) {
                dispatch(addCartItem({ productId: product._id, quantity, productWeight }));
                toast.dismiss();
                setTimeout(() => {
                    toast.success('Item added to cart successfully!', {
                        position: 'bottom-center',
                        type: 'success',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
                setQuantity(1);
                setWeight(prevWeights => ({ ...prevWeights, [product._id]: '' }));
                return;
            }
            //  else {
            //     toast.dismiss();
            //     setTimeout(() => {
            //         toast.error(`Item should be between 1 and ${product.maximumQuantity}`, {
            //             position: 'bottom-center',
            //             type: 'error',
            //             autoClose: 700,
            //             transition: Slide,
            //             hideProgressBar: true,
            //             className: 'small-toast',
            //         });
            //     }, 300);
            //     return;
            // }
        }

        // For non-Keerai products
        // if (!isNaN(productWeight) && productWeight < 0.25) {
        //     setWeightToast(true);
        //     setWeight(prevWeights => ({ ...prevWeights, [productId]: '' }));
        //     if (!weighttoast) {
        //         toast.dismiss();
        //         setTimeout(() => {
        //             toast.error('The value should not be less than 0.25kg', {
        //                 position: 'bottom-center',
        //                 type: 'error',
        //                 autoClose: 700,
        //                 transition: Slide,
        //                 hideProgressBar: true,
        //                 className: 'small-toast',

        //             });
        //             setWeightToast(false);
        //         }, 300);
        //     }
        //     return;
        // }

        if (product.measurement === 'Kg' && productWeight >= 0.25) {
            dispatch(addCartItem({ productId: product._id, quantity, productWeight }));
            toast.dismiss();
            setTimeout(() => {
                toast.success('Item added to cart successfully!', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
            setQuantity(1);
            setWeight(prevWeights => ({ ...prevWeights, [product._id]: '' }));
            return;
        } else {
            setcorrectWeight(true);
            if (!correctWeight) {
                toast.dismiss();
                setTimeout(() => {
                    toast.error('Please select weight for the correct item', {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                    setcorrectWeight(false);
                }, 300);
            }
            return;
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
                            {/* {category === 'Keerai' ? <th>Weight(Piece)</th>:<th>Weight(KG)</th>}    */}
                            <th>Quantity</th>
                            <th>Rate (As Per Weight)</th>
                            <th>Stock</th>
                            <th>Add to Cart</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.map((product, index) => (
                            <tr key={product._id}>
                                <td className="serial-number">{index + 1}</td>
                                <td className="products-image" >
                                    {product.images[0] && product.images[0].image && (
                                        <img
                                            className="img-size"
                                            src={product.images[0].image}
                                            alt={capitalizeFirstLetter(product.englishName)}
                                        />
                                    )}
                                </td>
                                {/* <td className="Products Name" style={{fontSize:'17px'}}>
                                    {capitalizeFirstLetter(product.englishName)}/{capitalizeFirstLetter(product.tamilName)}
                                </td> */}
                                <td className="Products Name" style={{ fontSize: '17px' }}>
                                    {product && product.range
                                        ? `${capitalizeFirstLetter(product.englishName)}/${capitalizeFirstLetter(product.tamilName)} (${product.range})`
                                        // : `${capitalizeFirstLetter(product.englishName)}/${capitalizeFirstLetter(product.tamilName)}`
                                        : `${capitalizeFirstLetter(product.englishName)}/${capitalizeFirstLetter(product.tamilName)}`
                                    }
                                </td>
                                {/* <td className="Price" style={{whiteSpace:'nowrap'}}>
                                    Rs.{product.price}(per {product.measurement})
                                    </td> */}
                                <td className="Price" style={{ whiteSpace: 'nowrap' }}>
                                    Rs.{product.price}(per{" "} {product && product.measurement}
                                    {/* {product
                                        ? product.measurement === 'Kg'
                                            ? "Kg"
                                            : product.measurement === 'Box'
                                                ? "Box"
                                                : (product.measurement === 'Grams' || product.measurement === 'Piece')
                                                    ? "Piece"
                                                    : "measurement"
                                        : "measurement"} */}
                                    )
                                </td>
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
                                {/* <td className="Weight">
                                    <NumberInput
                                        // list={`weight-options-${product._id}`}
                                        value={weight[product._id] }
                                        onChange={(e) => handleWeightChange(product && product._id, e.target.value,product && product.category)}
                                        onFocus={(e) => {
                                            e.target.setAttribute('list', `weight-options-${product._id}`);
                                        }}
                                        onBlur={(e) => {
                                            setTimeout(() => e.target.removeAttribute('list'), 100);
                                        }}
                                        className="form-select no-arrow-input form-control custom-placeholder"
                                        placeholder={product && product.category === 'Keerai'?"Select/type Piece":"Select/type weight in Kg"}
                                        // step="0.01"
                                        min="0.25"
                                        type="number"
                                        // min="0"
                                    />
                                    <datalist id={`weight-options-${product._id}`}>
                                        {product && product.category === 'Keerai'
                                            ? [...Array(10).keys()].map(i => (
                                                <option key={i} value={i + 1}>{i + 1}</option>
                                            ))
                                            : [...Array(10).keys()].map(i => (
                                                <option key={i} value={(i + 1) * 0.5}></option>
                                            ))}
                                    </datalist>
                                </td> */}
                                <td className="Weight">
                                    <NumberInput
                                        // list={weight-options-${product._id}}
                                        // list={`weight-options-${product._id}`} // Keep this static
                                        value={weight[product._id]}
                                        onChange={(e) => handleWeightChange(product && product._id, e.target.value, product && product.category, product && product.measurement, product && product.maximumQuantity)}
                                        onFocus={(e) => {
                                            e.target.setAttribute('list', `weight-options-${product._id}`);
                                        }}
                                        onBlur={(e) => {
                                            setTimeout(() => e.target.removeAttribute('list'), 100);
                                        }}
                                        className="form-select no-arrow-input form-control custom-placeholder"
                                        // placeholder={product && product.category === 'Keerai'?"Select/type Piece":"Select/type weight in Kg"}
                                        // placeholder={
                                        //     product
                                        //         ? product.measurement === 'Piece'
                                        //             ? "Select/type Piece"
                                        //             : product.measurement === 'Box'
                                        //                 ? "Select/type Box"
                                        //                 : "Select/type weight in Kg"
                                        //         : "Select/type weight in Kg"
                                        // }
                                        placeholder={`Select/type weight in ${product && product.measurement}`}
                                        // step="0.01"
                                        min="0.25"
                                        type="number"
                                    // min="0"
                                    />
                                                                        
                                    <datalist id={`weight-options-${product._id}`}>
                                        {product && product.measurement === 'Kg'
                                            ? [...Array(6).keys()].map(i => (
                                                <option key={i} value={(i + 1) * 0.5}></option>
                                            ))
                                                : [...Array(3).keys()].map(i => (
                                                    <option key={i} value={i + 1}>{i + 1}</option>
                                                ))}
                                    </datalist>
                                    {/* <select
                                        value={weight[product._id]}
                                        onChange={(e) =>
                                            handleWeightChange(
                                                product && product._id,
                                                e.target.value,
                                                product && product.category,
                                                product && product.measurement,
                                                product && product.maximumQuantity
                                            )
                                        }
                                        className="form-select no-arrow-input form-control custom-placeholder"
                                    >
                                        {product && product.measurement === 'Kg'
                                            ? [...Array(6).keys()].map((i) => (
                                                <option key={i} value={(i + 1) * 0.5}>
                                                    {(i + 1) * 0.5}
                                                </option>
                                            ))
                                            : [...Array(3).keys()].map((i) => (
                                                <option key={i} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                    </select> */}
                                  
                                </td>
                                <td className="Rate (As Per Weight)">
                                    {weight[product._id] ? `Rs.${calculateRate(product.price, weight[product._id])}` : 'Rs.0.00'}
                                </td>
                                <td className="Stock">{product.stocks}</td>
                                <td className="Add to Cart">
                                    {/* <button
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
                                    </button> */}
                                    <button
                                        className={product.stocks === 'Stock' ? "btn-add" : "btn-add-no"}
                                        onClick={() => handleAddToCart(product)}
                                        style={{
                                            backgroundColor: product.stocks === 'Stock' ? "#02441E" : "",
                                            color: "white",
                                            borderRadius: "40px",
                                            cursor: product.stocks === 'Stock' ? 'pointer' : 'not-allowed'
                                        }}
                                        disabled={product.stocks === 'No Stock'}
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
