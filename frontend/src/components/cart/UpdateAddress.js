
import React, { useEffect, useState, Fragment, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { saveShippingInfo } from "../../slices/cartSlice";
import StepsCheckOut from './StepsCheckOut';
import { Slide, toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import NumberInput from '../Layouts/NumberInput';
import MetaData from '../Layouts/MetaData';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import 'leaflet/dist/leaflet.css';
import { debounce } from 'lodash';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { getUserAddresses, postAddress, updateAddress } from '../../actions/addressAction';
import LoaderButton from '../Layouts/LoaderButton';
import { loadUser } from '../../actions/userActions';
import store from '../../store';
import { clearPostAddress, clearupdateAddress } from '../../slices/AddressSlice';


const libraries = ["places"];

const UpdateAddress = () => {

    const { id: addressId } = useParams();
    const { isAuthenticated, user } = useSelector(state => state.authState);
    const { updatedata,updateerror,updateloading } = useSelector(state => state.addressState);
    const location = useLocation();
    const shippingdata = location.state?.shippingdata || null;
    const [address, setAddress] = useState(shippingdata && shippingdata.address);
    const [area, setArea] = useState(shippingdata && shippingdata.area);
    const [landmark, setLandmark] = useState(shippingdata && shippingdata.landmark);
    const [city, setCity] = useState(shippingdata && shippingdata.city);
    // const [city, setCity] = useState("Chennai");
    const [phoneNo, setPhoneNo] = useState(shippingdata && shippingdata.phoneNo);
    const [postalCode, setPostalCode] = useState(shippingdata && shippingdata.postalCode);
    const [country, setCountry] = useState(shippingdata && shippingdata.country);
    const [hasExceeded, setHasExceeded] = useState(false);
    // const [country, setCountry] = useState("India")
    const [name, setName] = useState(shippingdata && shippingdata.name);
    const [state, setState] = useState(shippingdata && shippingdata.state);
    const [mapSearched, setMapsearched] = useState(false);
    const [allowed, setAllowed] = useState(true);
    const [defaultAddress, setDefaultAddress] = useState(shippingdata && shippingdata.defaultAddress);
    const [latitude, setLatitude] = useState(shippingdata && shippingdata.latitude);
    const [longitude, setLongitude] = useState(shippingdata && shippingdata.longitude);
    const [dummyLat, setDummyLat] = useState(null);
    const [dummyLng, setDummyLng] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [hasExceededPostalCode, setHasExceededPostalCode] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [cancelbutton, setCancelbutton] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMap, setIsMap] = useState(false);
    const mapRef = useRef(null);
    const [isChanged,setIsChanged]=useState(false);
    const apiKey = process.env.REACT_APP_GOOGLEMAP_API_KEY;

    console.log("lat and lon", latitude, longitude);
    console.log("shipping data",shippingdata );
    const handleDefaultCheckboxChange = () => {
        setDefaultAddress(!defaultAddress);
    };


    useEffect(()=>{
           if(!shippingdata){
            navigate('/address') 
           }
    },[])

    useEffect(() => {
        if (updatedata) {
            toast.dismiss();
            setTimeout(() => {
                toast.success(updatedata.message, {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 400,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    // onOpen: () => { },
                    onOpen: () => { dispatch(clearupdateAddress()); navigate('/address'); dispatch(getUserAddresses({userId:user && user._id}));  
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
                    }
                });
            }, 10);
        }
        if(updateerror){
            toast.dismiss();
            setTimeout(() => {
                toast.error(updateerror, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearupdateAddress()); },
                });
            }, 10);

        }
    }, [updatedata,updateerror])

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
        if (latitude && longitude && !mapSearched && isChanged && !dummyLat && !dummyLng) {
            fetchAddress(latitude, longitude);
        }
    }, [latitude, longitude, mapSearched,isChanged]);


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
                        setShowModal(false);
                        setIsButtonDisabled(false);
                        setIsChanged(true);
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
                        setCancelbutton(false);
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
                        setDummyLat(parseFloat(latitude.toFixed(6)));
                        setDummyLng(parseFloat(longitude.toFixed(6)));
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
                        setCancelbutton(false);
                    },
                    { enableHighAccuracy: true }
                );
            }
        };

        fetchGeolocation();
    };

    useEffect(() => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
                if (permissionStatus.state === 'granted') {
                     if (shippingdata && shippingdata.latitude && shippingdata && shippingdata.longitude) {
                        // return
                        setShowModal(false);
                        setCancelbutton(false);
                    }
                    else{
                        setShowModal(false);
                        setCancelbutton(false);
                        // setAddress('');
                        // setArea('');
                        // setLandmark('');
                    }
                    
                } else if (permissionStatus.state === 'prompt') {
                    // setAddress('');
                    // setArea('');
                    // setLandmark('');

                    setShowModal(false);
                    setCancelbutton(false);
                } else if (permissionStatus.state === 'denied') {
                    // setAddress('');
                    // setArea('');
                    // setLandmark('');

                    setShowModal(false);
                    setCancelbutton(false);
                }
            });
        } else {
            // setAddress('');
            // setArea('');
            // setLandmark('');

            setShowModal(true);
        }
    }, []);

    const handelChangeLocation = (e) => {

        setIsButtonDisabled(false);
        setCancelbutton(false);
        setIsChanged(false);

        setShowModal(true);
    }

    const handleMap = (e) => {

        // setAddress('');
        // setArea('');
        // setLandmark('');
        setIsChanged(false);
        setMapsearched(false);
        setDummyLat(null);
        setDummyLng(null);
        handlegeoLocation();
        setIsMap(true);
    };

    const [searchValue, setSearchValue] = useState('');  // For search input
    const [autocomplete, setAutocomplete] = useState(null); // To handle autocomplete
    console.log("autocomplete", autocomplete)

   
    const onLoad = (autoC) => {
        // e.preventDefault();
        console.log("autoc", autoC)
        setAutocomplete(autoC);
    };

    const onPlaceChanged = () => {
        // e.preventDefault();
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            console.log("place", place)

            if (place && place.address_components) {
                setMapsearched(true);
                const addressComponents = place && place.address_components;

                let streetNumber = '';
                let name =place.name?place.name:'';
                let premise = '';
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
              
                const fullAddress = [route, area].filter(Boolean).join(', ').trim();
                const fullarea =[streetNumber, name].filter(Boolean).join(', ').trim();


                // Set the states
                setAddress(fullarea);
                setArea(fullAddress);
                setLandmark(landmark);
                setCity(city);
                setState(state);
                setPostalCode(postalCode);
                setCountry(country);
                // setMapsearched(false);
                setDummyLat(null);
                setDummyLng(null);
            }
            if (place.geometry && place.geometry.location) {
                const location = place.geometry.location;
                setDummyLat(location.lat());
                setDummyLng(location.lng());
            } else {
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
    };


    

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
        dispatch(updateAddress({ userId: user && user._id, addressId: addressId && addressId, addressData }));
       
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
                title="Update Address"
                description="Provide or confirm your shipping details to ensure timely and accurate delivery of your order. Choose your preferred shipping method before proceeding."
            />
            <div className="back-button" onClick={() => navigate('/address')}>
                <ArrowBackIcon fontSize="small" />
                <span>Back</span>
            </div>

            {!showMapModal && (
                <>
                    <div className="products_heading">Update Address</div>
                    <StepsCheckOut shipping />
                    <div className="row wrapper">
                        <div className="col-10 col-lg-6">
                            <form onSubmit={submitHandler} className="shadow-lg mt-0">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="mb-4">
                                    <div className="shipping-head">Shipping Info</div>
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
                                    disabled={updateloading}
                                >
                                    {updateloading ? <LoaderButton fullPage={false} size={20} /> : (
                                        <span>UPDATE ADDRESS</span>
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
                                <h5 className="modal-title">Location Access</h5>
                                {
                                    isButtonDisabled || cancelbutton ? <></> : (
                                        <button type="button" className="close" onClick={handleCancelDelete} disabled={isButtonDisabled || cancelbutton}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    )

                                }

                            </div>
                            {/* <div className="modal-body d-flex justify-content-center">

                                <button type="button" className="btn btn-info" onClick={handleCurrentLocation} disabled={isButtonDisabled}><i className="fa fa-map-marker" style={{ marginRight: '30px' }}></i>Use Current Location</button>

                            </div>
                            <div className="modal-body d-flex justify-content-center">

                                <button type="button" className="btn btn-success" onClick={handleMap} disabled={isButtonDisabled}><i className="fa fa-map-marker" style={{ marginRight: '30px' }}></i>Locate on the Map</button>

                            </div> */}
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
                               
                                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} style={{ position: 'relative', zIndex: 9999999 }}>
                                    <input
                                        type="text"
                                        placeholder="Search for a location"
                                        className='map-search-bar'
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}

                                    />
                                </Autocomplete>
                              
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


export default UpdateAddress;

