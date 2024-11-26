import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Slide, toast } from 'react-toastify';
import { addCartItem } from '../../actions/cartActions';
import NumberInput from '../Layouts/NumberInput';
import { useLocation } from 'react-router-dom';

const SearchProduct = ({ products, category }) => {
    const [weight, setWeight] = useState({});
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const location = useLocation();
    const [weightvalue, setweightvalue] = useState(false);
    const [weighttoast, setWeightToast] = useState(false);
    const [correctWeight, setcorrectWeight] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';
    console.log("searchResults", searchResults);
    // sessionStorage.setItem('redirectPath', location.pathname);

    console.log("products", products)
    useEffect(() => {
        const initialWeights = products && products.reduce((acc, product) => {
            acc[product._id] = ''; // Set each product's weight as an empty string
            return acc;
        }, {});
        setWeight(initialWeights);
    }, [products]);


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

        }


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

    useEffect(() => {
        if (query) {
            const filteredResults = products.filter((product) =>
                product.englishName.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filteredResults);
        } else {
            setSearchResults([]);
        }
    }, [query, products]);

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
                {searchResults && searchResults.length > 0 ? (
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
                            {searchResults && searchResults.length > 0 ? (searchResults.map((product, index) => (
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

                                        )
                                    </td>


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
                            ))) : (
                                <div>
                                    <div className="product-not-found">
                                        <img src="../images/not-found.jpg" alt="No Products Found" />
                                        <p>Product Not Found</p>
                                    </div>
                                </div>
                            )

                            }
                        </tbody>
                    </table>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
                        {/* <h3>Product Not Found</h3> */}
                        <div className="product-not-found">
                            <img src="../images/not-found.jpg" alt="No Products Found" />
                            <p>Product Not Found</p>
                        </div>
                    </div>

                )}

            </div>
        </div>
    );
}

export default SearchProduct;
