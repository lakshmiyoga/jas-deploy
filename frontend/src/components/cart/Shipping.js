
import React, { useEffect, useState, Fragment, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../../slices/cartSlice";
import StepsCheckOut from './StepsCheckOut';
import { Slide, toast } from 'react-toastify';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NumberInput from '../Layouts/NumberInput';
import MetaData from '../Layouts/MetaData';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import 'leaflet/dist/leaflet.css';
import { debounce } from 'lodash';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { getUserAddresses, postAddress } from '../../actions/addressAction';
import LoaderButton from '../Layouts/LoaderButton';
import { loadUser } from '../../actions/userActions';
import store from '../../store';
import { clearPostAddress } from '../../slices/AddressSlice';


// export const validateShipping = (shippingInfo, navigate) => {
//     if (
//         !shippingInfo.address ||
//         !shippingInfo.area ||
//         !shippingInfo.city ||
//         !shippingInfo.state ||
//         !shippingInfo.country ||
//         !shippingInfo.phoneNo ||
//         !shippingInfo.postalCode
//     ) {
//         toast.dismiss();
//         setTimeout(() => {
//             toast.error('Please fill the shipping Information', {
//                 position: 'bottom-center',
//                 type: 'error',
//                 autoClose: 700,
//                 transition: Slide,
//                 hideProgressBar: true,
//                 className: 'small-toast',
//             });
//         }, 300);
//         navigate('/shipping');
//     }
// }

const libraries = ["places"];

const Shipping = () => {
    // const { shippingInfo = {} } = useSelector(state => state.cartState);
    // const shippingInfo = localStorage.getItem('shippingInfo')
    //     ? JSON.parse(localStorage.getItem('shippingInfo'))
    //     : {};
    const { isAuthenticated, user } = useSelector(state => state.authState);
    const { postdata, posterror, postloading } = useSelector(state => state.addressState);
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    // const { loactionResponse } = useSelector(state => state.orderState);
    const [address, setAddress] = useState('');
    const [area, setArea] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    // const [city, setCity] = useState("Chennai");
    const [phoneNo, setPhoneNo] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [hasExceeded, setHasExceeded] = useState(false);
    // const [country, setCountry] = useState("India")
    const [name, setName] = useState('');
    const [state, setState] = useState('');
    const [mapSearched, setMapsearched] = useState(false);
    const [allowed, setAllowed] = useState(true);
    const [defaultAddress, setDefaultAddress] = useState(false);
    // const [latitude, setLatitude] = useState('12.947146336879577');
    // const [longitude, setLongitude] = useState('77.62102993895199');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [dummyLat, setDummyLat] = useState(null);
    const [dummyLng, setDummyLng] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [hasExceededPostalCode, setHasExceededPostalCode] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [cancelbutton, setCancelbutton] = useState(false);
    // const [position, setPosition] = useState({ lat: 12.984820441742858, lng: 80.23556581985943 });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isChanged, setIsChanged] = useState(false);
    const [isMap, setIsMap] = useState(false);
    const mapRef = useRef(null);
    const apiKey = process.env.REACT_APP_GOOGLEMAP_API_KEY;
    const { items: cartItems } = useSelector(state => state.cartState);

    console.log("latitude longitude", latitude, longitude);

    const handleDefaultCheckboxChange = () => {
        setDefaultAddress(!defaultAddress);
    };

    // console.log("shippingInfo", shippingInfo);
    // useEffect(() => {
    //     if (!cartItems.length) {
    //         toast.dismiss();
    //         setTimeout(() => {
    //             toast.error('Cart is empty. Please add at least one item to proceed! ', {
    //                 position: 'bottom-center',
    //                 type: 'error',
    //                 autoClose: 700,
    //                 transition: Slide,
    //                 hideProgressBar: true,
    //                 className: 'small-toast',
    //             });
    //         }, 300);
    //         navigate('/cart');
    //     }
    // }, [cartItems, navigate]);

    useEffect(() => {
        if (postdata) {
            toast.dismiss();
            setTimeout(() => {
                toast.success(postdata.message, {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 400,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    // onOpen: () => {},
                    onOpen: () => {
                        dispatch(clearPostAddress()); dispatch(getUserAddresses({ userId: user && user._id }));
                        setAddress('');
                        setArea('');
                        setLandmark('');
                        setMapsearched(false);
                        setDummyLat(null);
                        setDummyLng(null);
                        setIsMap(false);
                        setShowModal(false);
                        setShowMapModal(false);
                        setArea('');
                        setLandmark('');
                        setCity('');
                        setState('');
                        setPostalCode('');
                        setCountry('');
                        setMapsearched(false);
                        setLatitude(null);
                        setLongitude(null);
                        // navigate('/cart');
                        navigate(-1);
                    }
                });
            }, 10);

        }
        if (posterror) {
            toast.dismiss();
            setTimeout(() => {
                toast.error(posterror, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearPostAddress()); },
                });
            }, 10);

        }
    }, [postdata, posterror])

    const fetchAddress = async (latitude, longitude) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    latlng: `${latitude},${longitude}`,
                    key: apiKey
                }
            });
            const { data } = response;
            console.log("address", data)
            if (data && data.results[0]) {
                const addressComponents = data && data.results[0].address_components;

                let streetNumber = '';
                let premise = '';
                let route = '';
                let area = '';
                let locality = '';
                let area1 = '';
                let landmark = '';
                let city = '';
                let state = '';
                let country = '';
                let postalCode = '';

                addressComponents && addressComponents.forEach(component => {
                    if (component.types.includes('street_number')) {
                        streetNumber = component.long_name; // Street number
                    }
                    // else if (component.types.includes('sublocality_level_3')){
                    //     locality =  component.long_name;
                    // }
                    // else if (component.types.includes('premise')) {
                    //     premise = component.long_name; // Notable place or building
                    // }
                    else if (component.types.includes('route')) {
                        route = component.long_name !== 'Unnamed Road' ? component.long_name : ''; // Street name
                    } else if (component.types.includes('sublocality_level_1') || component.types.includes('neighborhood')) {
                        area = component.long_name; // Neighborhood or locality
                    } else if (component.types.includes('sublocality_level_2')) {
                        area1 = component.long_name; // Neighborhood or locality
                    }
                    else if (component.types.includes('landmark')) {
                        landmark = component.long_name; // Area-specific notable location
                    } else if (component.types.includes('administrative_area_level_3') || component.types.includes('locality')) {
                        city = component.long_name;
                    } else if (component.types.includes('administrative_area_level_1')) {
                        state = component.long_name;
                    } else if (component.types.includes('country')) {
                        country = component.long_name;
                    } else if (component.types.includes('postal_code')) {
                        postalCode = component.long_name;
                    }
                });

                // Combine relevant components for full address
                const fullAddress = [route, area].filter(Boolean).join(', ').trim();
                setAddress('');
                setArea(fullAddress);
                setLandmark(landmark);
                setCity(city);
                setState(state);
                setPostalCode(postalCode);
                setCountry(country);
                setMapsearched(false);
                setDummyLat(null);
                setDummyLng(null);
                setIsChanged(false);
            }
        } catch (error) {
            toast.dismiss();
            setTimeout(() => {
                toast.error('Error fetching address', {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
        }
    };

    useEffect(() => {
        if (latitude && longitude && !mapSearched && isChanged) {
            fetchAddress(latitude, longitude);
        }
    }, [latitude, longitude, mapSearched]);


    const handleCurrentLocation = async () => {
        setMapsearched(false);
        // setAddress('');
        // setLatitude('');
        // setLongitude('');
        // setArea('');
        // setLandmark('');
        setIsButtonDisabled(true);
        const fetchGeolocation = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async position => {
                        const { latitude, longitude, accuracy } = position.coords;

                        if (accuracy <= 50) {
                            setLatitude(parseFloat(latitude.toFixed(6)));
                            setLongitude(parseFloat(longitude.toFixed(6)));
                            setAllowed(true);
                            setIsChanged(true);
                            setShowModal(false);
                            setIsButtonDisabled(false);
                            toast.dismiss();
                            setTimeout(() => {
                                toast.success(`Location accuracy is ${Math.round(accuracy)} meters.`, {
                                    position: 'bottom-center',
                                    type: 'success',
                                    autoClose: 700,
                                    transition: Slide,
                                    hideProgressBar: true,
                                    className: 'small-toast',
                                });
                            }, 300);
                        }
                        else {
                            toast.dismiss();
                            setTimeout(() => {
                                toast.error('Could not get your precious location.', {
                                    position: 'bottom-center',
                                    type: 'error',
                                    autoClose: 700,
                                    transition: Slide,
                                    hideProgressBar: true,
                                    className: 'small-toast',
                                });
                                setIsButtonDisabled(false);
                            }, 300);

                        }

                    },
                    error => {

                        toast.dismiss();
                        setTimeout(() => {
                            toast.error('Location access denied or not available.', {
                                position: 'bottom-center',
                                type: 'error',
                                autoClose: 700,
                                transition: Slide,
                                hideProgressBar: true,
                                className: 'small-toast',
                            });
                        }, 300);
                        setIsButtonDisabled(false);
                        setCancelbutton(true);
                    },
                    { enableHighAccuracy: true }
                );
            }
        };

        fetchGeolocation();
    };

    const handlegeoLocation = async () => {
        // setAddress('');
        // setArea('');
        // setLandmark('');
        // setLatitude('');
        // setLongitude('');
        // setMapsearched(false);
        setIsButtonDisabled(true);
        const fetchGeolocation = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async position => {
                        const { latitude, longitude, accuracy } = position.coords;

                        setIsChanged(true);
                        setDummyLat(parseFloat(latitude.toFixed(6)));
                        setDummyLng(parseFloat(longitude.toFixed(6)));
                        setAllowed(true);
                        setShowModal(false);
                        setIsButtonDisabled(false);

                        toast.dismiss();
                        setTimeout(() => {
                            toast.success(`Location accuracy is ${Math.round(accuracy)} meters.`, {
                                position: 'bottom-center',
                                type: 'success',
                                autoClose: 700,
                                transition: Slide,
                                hideProgressBar: true,
                                className: 'small-toast',
                            });
                        }, 300);

                    },
                    error => {

                        toast.dismiss();
                        setTimeout(() => {
                            toast.error('Location access denied or not available.', {
                                position: 'bottom-center',
                                type: 'error',
                                autoClose: 700,
                                transition: Slide,
                                hideProgressBar: true,
                                className: 'small-toast',
                            });
                        }, 300);
                        setIsButtonDisabled(false);
                        setCancelbutton(true);
                    },
                    { enableHighAccuracy: true }
                );
            }
        };

        fetchGeolocation();
    };

    useEffect(() => {
        // Check the location permission status on component mount
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
                if (permissionStatus.state === 'granted') {
                    // if (shippingInfo.latitude && shippingInfo.longitude) {
                    //     return
                    // }
                    // else {
                    setShowModal(true);
                    setCancelbutton(true);
                    setAddress('');
                    setArea('');
                    setLandmark('');
                    setMapsearched(false);
                    setDummyLat(null);
                    setDummyLng(null);
                    setIsMap(false);
                    // setShowModal(false);
                    setIsChanged(false);
                    setShowMapModal(false);
                    setArea('');
                    setLandmark('');
                    setCity('');
                    setState('');
                    setPostalCode('');
                    setCountry('');
                    setMapsearched(false);
                    setLatitude(null);
                    setLongitude(null);
                    // }


                } else if (permissionStatus.state === 'prompt') {
                    setAddress('');
                    setArea('');
                    setLandmark('');
                    setMapsearched(false);
                    setDummyLat(null);
                    setDummyLng(null);
                    setIsMap(false);
                    setIsChanged(false);
                    // setShowModal(false);
                    setShowMapModal(false);
                    setArea('');
                    setLandmark('');
                    setCity('');
                    setState('');
                    setPostalCode('');
                    setCountry('');
                    setMapsearched(false);
                    setLatitude(null);
                    setLongitude(null);
                    setShowModal(true);
                    setCancelbutton(true);
                } else if (permissionStatus.state === 'denied') {
                    setAddress('');
                    setArea('');
                    setLandmark('');
                    setMapsearched(false);
                    setDummyLat(null);
                    setDummyLng(null);
                    setIsChanged(false);
                    setIsMap(false);
                    // setShowModal(false);
                    setShowMapModal(false);
                    setArea('');
                    setLandmark('');
                    setCity('');
                    setState('');
                    setPostalCode('');
                    setCountry('');
                    setMapsearched(false);
                    setLatitude(null);
                    setLongitude(null);
                    setShowModal(true);
                    setCancelbutton(true);
                }
            });
        } else {
            setAddress('');
            setArea('');
            setLandmark('');
            setMapsearched(false);
            setDummyLat(null);
            setDummyLng(null);
            setIsChanged(false);
            setIsMap(false);
            // setShowModal(false);
            setShowMapModal(false);
            setArea('');
            setLandmark('');
            setCity('');
            setState('');
            setPostalCode('');
            setCountry('');
            setMapsearched(false);
            setLatitude(null);
            setLongitude(null);

            setShowModal(true);
        }
    }, []);

    const handelChangeLocation = (e) => {

        setIsButtonDisabled(false);
        setCancelbutton(false)
        setIsChanged(false);
        setShowModal(true);
    }

    const handleMap = (e) => {

        // setAddress('');
        // setArea('');
        // setLandmark('');
        setMapsearched(false);
        setDummyLat(null);
        setDummyLng(null);
        handlegeoLocation();
        setIsMap(true);
        setIsChanged(false);
    };

    const [searchValue, setSearchValue] = useState('');  // For search input
    const [autocomplete, setAutocomplete] = useState(null); // To handle autocomplete
    console.log("autocomplete", autocomplete)

    // Load autocomplete and set to the state
    const onLoad = (autoC) => {
        // e.preventDefault();
        console.log("autoc", autoC)
        setAutocomplete(autoC);
    };

    const onPlaceChanged = () => {
        // e.preventDefault();
        // setMapsearched(true);
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            console.log("place", place)

            if (place && place.address_components) {
                setMapsearched(true);
                const addressComponents = place && place.address_components;

                let streetNumber = '';
                let premise = '';
                let name = place.name ? place.name : '';
                let route = '';
                let area = '';
                let area1 = '';
                let landmark = '';
                let city = '';
                let state = '';
                let country = '';
                let postalCode = '';

                addressComponents && addressComponents.forEach(component => {
                    if (component.types.includes('street_number')) {
                        streetNumber = component.long_name; // Street number
                    }
                    // else if (component.types.includes('sublocality_level_3')){
                    //     locality =  component.long_name;
                    // }
                    // else if (component.types.includes('premise')) {
                    //     premise = component.long_name; // Notable place or building
                    // }
                    else if (component.types.includes('route')) {
                        route = component.long_name !== 'Unnamed Road' ? component.long_name : ''; // Street name
                    } else if (component.types.includes('sublocality_level_1') || component.types.includes('neighborhood')) {
                        area = component.long_name; // Neighborhood or locality
                    } else if (component.types.includes('sublocality_level_2')) {
                        area1 = component.long_name; // Neighborhood or locality
                    }
                    else if (component.types.includes('landmark')) {
                        landmark = component.long_name; // Area-specific notable location
                    } else if (component.types.includes('administrative_area_level_3') || component.types.includes('locality')) {
                        city = component.long_name;
                    } else if (component.types.includes('administrative_area_level_1')) {
                        state = component.long_name;
                    } else if (component.types.includes('country')) {
                        country = component.long_name;
                    } else if (component.types.includes('postal_code')) {
                        postalCode = component.long_name;
                    }
                });
                // console.log(landmark,premise)
                // Combine relevant components for full address
                const fullAddress = [route, area].filter(Boolean).join(', ').trim();
                const fullarea = [streetNumber, name].filter(Boolean).join(', ').trim();

                // Set the states

                setAddress(fullarea)
                setArea(fullAddress);
                setLandmark(landmark);
                setCity(city);
                setState(state);
                setPostalCode(postalCode);
                setCountry(country);
                // setMapsearched(false);
                setDummyLat(null);
                setDummyLng(null);
                setIsChanged(false);
            }


            // Check if the place has geometry (i.e., if it has location data)
            if (place.geometry && place.geometry.location) {
                const location = place.geometry.location;
                setDummyLat(location.lat());
                setDummyLng(location.lng());
                // setAddress(place.formatted_address);  
            } else {
                // console.log("Selected place does not have a geometry or location");
                toast.dismiss();
                setTimeout(() => {
                    toast.error('Selected place does not have a geometry or location', {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
            }
        } else {
            // console.log("Autocomplete is not loaded yet!");
            toast.dismiss();
            setTimeout(() => {
                toast.error('Autocomplete is not loaded yet!', {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                });
            }, 300);
        }
    };

    useEffect(() => {
        if (dummyLat && dummyLng && isMap) {
            setShowMapModal(true);
        }
    }, [dummyLat, dummyLng]);

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;

        if (value.length > 10) {
            if (!hasExceeded) {

                toast.dismiss();
                setTimeout(() => {
                    toast.error('Phone number cannot exceed 10 digits', {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
                setHasExceeded(true);
            }
        } else {
            setHasExceeded(false);
            setPhoneNo(value);
        }
    };


    const handlePostalCodeChange = (e) => {
        const value = e.target.value;

        if (value.length > 6) {
            if (!hasExceededPostalCode) {

                toast.dismiss();
                setTimeout(() => {
                    toast.error('Postal code cannot exceed 6 digits', {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
                setHasExceededPostalCode(true);
            }
        } else {
            setHasExceededPostalCode(false);
            setPostalCode(value);
        }
    };


    const handleCancelDelete = () => {
        setShowModal(false);
        setMapsearched(false);
        // navigate('/cart');
    };


    // const submitHandler = (e) => {
    //     e.preventDefault();

    //     dispatch(saveShippingInfo({ address, area, landmark, city, phoneNo, postalCode, country, state, latitude, longitude }));
    //     if (isAuthenticated && latitude && longitude) {
    //         navigate('/order/confirm');
    //         setMapsearched(false);
    //     } else {

    //         toast.dismiss();
    //         setTimeout(() => {
    //             toast.error('Please allow the location to proceed.', {
    //                 position: 'bottom-center',
    //                 type: 'error',
    //                 autoClose: 700,
    //                 transition: Slide,
    //                 hideProgressBar: true,
    //                 className: 'small-toast',
    //             });
    //             setMapsearched(false);
    //         }, 300);
    //     }
    // };

    const submitHandler = (e) => {
        e.preventDefault();
        const formattedAddress = `${address}, ${area}, ${landmark ? landmark + ',' : ''} ${city}, ${state}, ${postalCode}, ${country}`;

        const addressData = {
            name,
            address,
            area,
            landmark,
            country,
            city,
            state,
            phoneNo,
            postalCode,
            latitude,
            longitude,
            formattedAddress,
            defaultAddress,
        };

        // Save this addressData in the user's address array (use appropriate API call)
        dispatch(postAddress({ userId: user && user._id, addressData }));

    }

    const updatePosition = (lat, lng) => {
        setMapsearched(false);
        setDummyLat(lat);
        setDummyLng(lng);
    };



    useEffect(() => {
        if (dummyLat && dummyLng && mapRef.current) {
            mapRef.current.panTo({ lat: dummyLat, lng: dummyLng });
        }
    }, [dummyLat, dummyLng]);

    const handleContinue = (e) => {
        e.preventDefault();
        setIsButtonDisabled(false)
        setLatitude(dummyLat);
        setLongitude(dummyLng);
        setShowModal(false);
        setShowMapModal(false);
        setDummyLat(null);
        setDummyLng(null);
    };

    const handleBack = (e) => {
        e.preventDefault();
        setDummyLat(null);
        setDummyLng(null);
        setIsButtonDisabled(false);
        setShowMapModal(false);
        setShowModal(true);
        setMapsearched(false);

    };


    return (
        <Fragment >

            <MetaData
                title="Shipping Information"
                description="Provide or confirm your shipping details to ensure timely and accurate delivery of your order. Choose your preferred shipping method before proceeding."
            />
            <div className="back-button" onClick={() => navigate('/address')}>
                <ArrowBackIcon fontSize="small" />
                <span>Back</span>
            </div>
            {!showMapModal && (
                <>
                    <div className="products_heading">Shipping</div>
                    <StepsCheckOut shipping />
                    <div className="row wrapper">
                        <div className="col-10 col-lg-6">
                            <form onSubmit={submitHandler} className="shadow-lg mt-0">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="mb-4">
                                    <div className="shipping-head">Shipping Info</div>

                                    {/* <button type="button" style={{height:'30px',fontSize:'12px'}} onClick={handelChangeLocation} >Change Location</button> */}
                                    <div
                                        className="location-text"
                                        onClick={handelChangeLocation}
                                    >
                                        Change Location
                                    </div>

                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Reciver Name <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type='text'
                                        id="name"
                                        className="no-arrow-input form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone_field">Phone No (+91) <span style={{ color: 'red' }}>*</span></label>
                                    <NumberInput

                                        id="phone_field"
                                        className="no-arrow-input form-control"
                                        value={phoneNo}
                                        onChange={handlePhoneNumberChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address_field">Flat, House no, Building, company, Apartment <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        id="address_field"
                                        className="form-control"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="area_field">Area, street, Village <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        id="area_field"
                                        className="form-control"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="landmark_field">Landmark</label>
                                    <input
                                        type="text"
                                        id="landmark_field"
                                        className="form-control"
                                        // placeholder='eg: near Apollo Hospital'
                                        value={landmark}
                                        onChange={(e) => setLandmark(e.target.value)}

                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="postal_code_field">Postal Code <span style={{ color: 'red' }}>*</span></label>
                                    <NumberInput
                                        id="postal_code_field"
                                        className="no-arrow-input form-control"
                                        value={postalCode}
                                        onChange={(e) => handlePostalCodeChange(e)}
                                        required
                                        readOnly
                                    // style={{width:'100%'}}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="state_field">State</label>
                                    <input
                                        type="text"
                                        id="state_field"
                                        className="form-control"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        required
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="city_field">City</label>
                                    <input
                                        type="text"
                                        id="city_field"
                                        className="form-control"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="country_field">Country</label>
                                    <input
                                        type="text"
                                        id="country_field"
                                        className="form-control"
                                        value={country}
                                        required
                                        readOnly
                                    />
                                </div>
                                {!allowed && !latitude && !longitude && (
                                    <div className="alert alert-danger" role="alert">
                                        Location access is required to proceed. Please Allow Location for this Site and Refresh the Page to Continue {' '}

                                    </div>
                                )}

                                <div className="form-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={defaultAddress}
                                            onChange={handleDefaultCheckboxChange}
                                        />
                                        Set as default address
                                    </label>
                                </div>

                                <button
                                    id="shipping_btn"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={postloading}
                                >
                                    {postloading ? <LoaderButton fullPage={false} size={20} /> : (
                                        <span>ADD ADDRESS</span>
                                    )

                                    }

                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}

            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Location Access
                                </h5>
                                {
                                    isButtonDisabled || cancelbutton ? <button type="button" className="close" onClick={() => navigate(-1)} >
                                        <span aria-hidden="true">&times;</span>
                                    </button> : (
                                        <button type="button" className="close" onClick={handleCancelDelete} disabled={isButtonDisabled || cancelbutton}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    )

                                }

                            </div>
                            {isButtonDisabled ? (
                                <div style={{ margin: '20px' }}>
                                    <LoaderButton fullPage={false} size={20} />
                                </div>) : (
                                <><div className="modal-body d-flex justify-content-center">
                                    <button type="button" className="btn btn-info" onClick={handleCurrentLocation} disabled={isButtonDisabled}><i className="fa fa-map-marker" style={{ marginRight: '30px' }}></i>Use Current Location</button>
                                </div>
                                    <div className="modal-body d-flex justify-content-center">
                                        <button type="button" className="btn btn-success" onClick={handleMap} disabled={isButtonDisabled}><i className="fa fa-map-marker" style={{ marginRight: '30px' }}></i>Locate on the Map</button>
                                    </div>
                                </>
                            )
                            }


                        </div>
                    </div>
                </div>
            )}

            {showMapModal && dummyLat && dummyLng && (
                <div style={mapFullScreenStyle}>
                    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
                        <div style={{ height: '100vh', width: '100%' }}>

                            <GoogleMap
                                mapContainerStyle={{ height: "100vh", width: "100%" }}
                                center={{ lat: dummyLat, lng: dummyLng }}
                                zoom={13}
                                onLoad={(map) => (mapRef.current = map)}
                                onClick={(e) => updatePosition(e.latLng.lat(), e.latLng.lng())}
                            >
                                {/* <div style={{ position: 'relative', width: '100%', height: 'auto', display: 'flex', justifyContent: 'center' }}> */}
                                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} style={{ position: 'relative', zIndex: 9999999 }}>
                                    <input
                                        type="text"
                                        placeholder="Search for a location"
                                        className='map-search-bar'
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}

                                    />
                                </Autocomplete>
                                {/* </div> */}

                                <Marker
                                    position={{ lat: dummyLat, lng: dummyLng }}
                                    draggable={true}
                                    onDragEnd={(e) => updatePosition(e.latLng.lat(), e.latLng.lng())}
                                />
                                <button
                                    onClick={handlegeoLocation}
                                    className='current-location-icon'
                                >
                                    <MyLocationIcon style={{ color: '#4285F4', fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                                </button>
                            </GoogleMap>
                            <div style={{ position: 'absolute', zIndex: '9999', bottom: '20px', left: '50%', transform: 'translateX(-50%)', }}>
                                <button type="button" className="btn btn-secondary" style={{ margin: '5px' }} onClick={handleBack}>Back</button>
                                <button type="button" className="btn btn-primary" style={{ margin: '5px' }} onClick={handleContinue}>Continue</button>
                            </div>
                        </div>
                    </LoadScript>
                </div>

            )}
        </Fragment>
    );
}

const modalStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)'
};

const mapFullScreenStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dimmed background
    zIndex: 999, // Ensure it's on top of everything
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const searchBarStyle = {
    width: '300px',
    height: '40px',
    padding: '10px',
    position: 'absolute',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    borderRadius: '5px',
};


export default Shipping;

