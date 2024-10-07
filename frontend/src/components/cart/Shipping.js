



// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from "react-redux";
// import { Fragment, useState } from "react";
// import { countries } from 'countries-list'
// import { useNavigate } from "react-router-dom";
// import { saveShippingInfo } from "../../slices/cartSlice";
// import StepsCheckOut from './StepsCheckOut';
// import { toast } from 'react-toastify';

// export const validateShipping = (shippingInfo, navigate) => {
// //    console.log(shippingInfo)
//     if(
//         !shippingInfo.address||
//         !shippingInfo.city||
//         !shippingInfo.state|| 
//         !shippingInfo.country||
//         !shippingInfo.phoneNo||
//         !shippingInfo.postalCode
//         ) {
//             toast.error('Please fill the shipping Information', {
//                 position: 'bottom-center',
//             });
//             navigate('/shipping')
//     }
//     // console.log(shippingInfo)
// } 




// const Shipping = () => {

//     const { shippingInfo = {} } = useSelector(state => state.cartState)
//     const { isAuthenticated, loading, user } = useSelector(state => state.authState)
//     const [address, setAddress] = useState(shippingInfo.address);
//     const [city, setCity] = useState(shippingInfo.city);
//     const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
//     const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
//     const [country, setCountry] = useState(shippingInfo.country);
//     const [state, setState] = useState(shippingInfo.state);
//     // const [address, setAddress] = useState('');
//     // const [city, setCity] = useState('');
//     // const [phoneNo, setPhoneNo] = useState('');
//     // const [postalCode, setPostalCode] = useState('');
//     // const [country, setCountry] = useState('');
//     // const [state, setState] = useState('');
//     const countryList = Object.values(countries);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
// console.log(address,city, phoneNo, postalCode, country, state)
// // useEffect(()=>{

// // },[])

//     const submitHandler = (e) => {
//         e.preventDefault();
//         dispatch(saveShippingInfo({address, city, phoneNo, postalCode, country, state}))
//         if(isAuthenticated){
//             navigate('/order/confirm')
//         }

//     }
// console.log(shippingInfo)
//     return (
//         <Fragment>
//             <div className="products_heading">Shipping</div>
//            <StepsCheckOut shipping/>
//             <div className="row wrapper">
//             <div className="col-10 col-lg-5">
//                 <form onSubmit={submitHandler} className="shadow-lg mt-0">
//                     <h1 className="mb-4">Shipping Info</h1>
//                     <div className="form-group">
//                         <label htmlFor="address_field">Address</label>
//                         <input
//                             type="text"
//                             id="address_field"
//                             className="form-control"
//                             value={address}
//                             onChange={(e) => setAddress(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="city_field">City</label>
//                         <input
//                             type="text"
//                             id="city_field"
//                             className="form-control"
//                             value={city}
//                             onChange={(e) => setCity(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label htmlhtmlFor="phone_field">Phone No</label>
//                         <input
//                             type="phone"
//                             id="phone_field"
//                             className="form-control"
//                             value={phoneNo}
//                             onChange={(e) => setPhoneNo(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="postal_code_field">Postal Code</label>
//                         <input
//                             type="number"
//                             id="postal_code_field"
//                             className="form-control"
//                             value={postalCode}
//                             onChange={(e) => setPostalCode(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="country_field">Country</label>
//                         <select
//                             id="country_field"
//                             className="form-control"
//                             value={country}
//                             onChange={(e) => setCountry(e.target.value)}
//                             required
//                         >
//                             {countryList.map((country, i) => (

//                                 <option key={i} value={country.name}>
//                                     {country.name}
//                                 </option>
//                             ))
//                             }

//                         </select>
//                     </div>

//                     <div className="form-group">
//                         <label htmlhtmlFor="state_field">State</label>
//                         <input
//                             type="text"
//                             id="state_field"
//                             className="form-control"
//                             value={state}
//                             onChange={(e) => setState(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <button
//                         id="shipping_btn"
//                         type="submit"
//                         className="btn btn-block py-3"
//                     >
//                         CONTINUE
//                     </button>
//                 </form>
//             </div>
//         </div>

//         </Fragment>

//     )
// }

// export default Shipping

import React, { useEffect, useState, Fragment, useRef, useMemo, } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../../slices/cartSlice";
import StepsCheckOut from './StepsCheckOut';
import { toast } from 'react-toastify';
import axios from 'axios';
import NumberInput from '../Layouts/NumberInput';
import { GetLocationResponse } from '../../actions/orderActions';
import MetaData from '../Layouts/MetaData';
import MapComponent from '../Layouts/MapComponent';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


export const validateShipping = (shippingInfo, navigate) => {
    if (
        !shippingInfo.address ||
        !shippingInfo.area ||
        !shippingInfo.city ||
        !shippingInfo.state ||
        !shippingInfo.country ||
        !shippingInfo.phoneNo ||
        !shippingInfo.postalCode
    ) {
        toast.error('Please fill the shipping Information', {
            position: 'bottom-center',
        });
        navigate('/shipping');
    }
}

const Shipping = () => {
    const { shippingInfo = {} } = useSelector(state => state.cartState);
    const { isAuthenticated, user } = useSelector(state => state.authState);
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);
    // const { loactionResponse } = useSelector(state => state.orderState);
    console.log("shippingInfo", shippingInfo)
    const [address, setAddress] = useState(shippingInfo.address);
    const [area, setArea] = useState(shippingInfo.area);
    const [landmark, setLandmark] = useState(shippingInfo.landmark);
    const [city, setCity] = useState(shippingInfo.city);
    // const [city, setCity] = useState("Chennai");
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
    const [country, setCountry] = useState(shippingInfo.country);
    const [hasExceeded, setHasExceeded] = useState(false);
    // const [country, setCountry] = useState("India")
    const [state, setState] = useState(shippingInfo.state);
    // const [state, setState] = useState("TamilNadu");
    const [allowed, setAllowed] = useState(true);
    // const [latitude, setLatitude] = useState('12.947146336879577');
    // const [longitude, setLongitude] = useState('77.62102993895199');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [dummyLat, setDummyLat] = useState(null);
    const [dummyLng, setDummyLng] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [hasExceededPostalCode, setHasExceededPostalCode] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [position, setPosition] = useState({ lat: 12.984820441742858, lng: 80.23556581985943 });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMap,setIsMap] = useState(false);

    console.log("dummy data ", dummyLat, dummyLng);
    console.log("state data ", latitude, longitude);
    //     const [pickupDetails, setPickupDetails] = useState({
    //         lat: 12.935025018880504,
    //         lng: 77.6092605236106
    //       });

    //       const [dropDetails, setDropDetails] = useState({
    //         lat: shippingInfo && shippingInfo.latitude && shippingInfo.latitude,
    //         lng: shippingInfo && shippingInfo.longitude && shippingInfo.longitude
    //       });

    //       const [customerDetails, setCustomerDetails] = useState({
    //         name: user && user.name && user.name,
    //         countryCode: '+91',
    //         phoneNumber: phoneNo
    //       });
    // // console.log(latitude,longitude)
    // useEffect(()=>{
    //     setCustomerDetails({
    //         name: user && user.name && user.name,
    //         countryCode: '+91',
    //         phoneNumber: phoneNo
    //       } )
    // },[user])
    //   useEffect(()=>{
    //     const fetchdata = async () => {

    //     const requestData = {
    //         pickup_details: pickupDetails,
    //         drop_details: dropDetails,
    //         customer: {
    //           name: customerDetails.name,
    //           mobile: {
    //             country_code: customerDetails.countryCode,
    //             number: customerDetails.phoneNumber
    //           }
    //         }
    //       };
    //       console.log(requestData)
    //       try {
    //         const response = await axios.post('/api/v1/get-quote', requestData,{ withCredentials: true });
    //         console.log("getQuote Response",response.data)
    //     //    toast.error('Response:', response.data);
    //         // Handle response as needed
    //       } catch (error) {
    //         toast.error('Error sending data:', error);
    //         // Handle error as needed
    //       }
    //     }
    // if(user){
    //     fetchdata()
    // }

    //   },[pickupDetails,dropDetails,customerDetails])


    // const handleCurrentLocation = () => {
    //     const fetchGeolocation = () => {
    //         if (navigator.geolocation) {
    //             navigator.geolocation.getCurrentPosition(
    //                 position => {
    //                     const { latitude, longitude } = position.coords;
    //                     setLatitude(latitude);
    //                     setLongitude(longitude);
    //                     setAllowed(true);
    //                 },
    //                 error => {
    //                     if (error.code === error.PERMISSION_DENIED) {
    //                         // toast.error("Location access is required to proceed.");
    //                         toast.error('Location access is required to proceed.', {
    //                             position: "bottom-center",
    //                             type: 'error',

    //                         });
    //                         // navigate('/cart')
    //                         setAllowed(false);
    //                     }
    //                 }
    //             );
    //         } else {
    //             // toast.error('Geolocation is not supported by this browser.');
    //             toast.error('Geolocation is not supported by this browser.', {
    //                 position: "bottom-center",
    //                 type: 'error',

    //             });
    //             setAllowed(false);
    //         }
    //     };

    //     fetchGeolocation();
    //     setShowModal(false);
    // }
    // useEffect(()=>{
    //     if(latitude && longitude){
    //         dispatch(GetLocationResponse({latitude,longitude}))
    //     }

    // },[latitude,longitude])

    // useEffect(() => {
    //     // Check the location permission status on component mount
    //     if (navigator.permissions) {
    //         navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
    //             if (permissionStatus.state === 'granted') {
    //                 // If permission is already granted, fetch the location without showing the modal
    //                 handleCurrentLocation();
    //             } else if (permissionStatus.state === 'prompt') {
    //                 // If the permission hasn't been granted or denied, show the modal
    //                 setShowModal(true);
    //             } else if (permissionStatus.state === 'denied') {
    //                 // If the permission is denied, show the modal to prompt user action
    //                 setShowModal(true);
    //             }
    //         });
    //     } else {
    //         // If the Permissions API is not supported, default to showing the modal
    //         setShowModal(true);
    //     }
    // }, []);

    const fetchAddress = async (latitude, longitude) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    format: 'json',
                    lat: latitude,
                    lon: longitude,
                    addressdetails: 1
                }
            });
            const { data } = response;
            console.log(data)
            if (data) {
                setPostalCode(data.address.postcode)
                setCity(data.address.city);
                setState(data.address.state);
                setCountry(data.address.country);
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            toast.error(error)
        }
    };


    useEffect(() => {
        if (latitude && longitude) {
            fetchAddress(latitude, longitude);
        }

    }, [latitude, longitude]);


    const handleCurrentLocation = () => {
        setIsButtonDisabled(true);
        const fetchGeolocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        setLatitude(latitude);
                        setLongitude(longitude);
                        setDummyLat(latitude);
                        setDummyLng(longitude);
                        setAllowed(true);
                        setShowModal(false);  // Close modal if location is fetched successfully
                    },
                    error => {
                        if (error.code === error.PERMISSION_DENIED) {
                            toast.error('Location access is required to proceed.', {
                                position: "bottom-center",
                                type: 'error',
                            });
                            setAllowed(false);
                            setShowModal(false);  // Keep modal open if permission is denied
                        }
                    }
                );
            } else {
                toast.error('Geolocation is not supported by this browser.', {
                    position: "bottom-center",
                    type: 'error',
                });
                setAllowed(false);
                setShowModal(true);  // Keep modal open if geolocation is not supported
            }
        };

        fetchGeolocation();
    };


    // useEffect(() => {
    //     const fetchLocationDetails = async () => {
    //         if (postalCode && postalCode.length === 6) { // Adjust the length check as per your postal code format
    //             try {
    //                 const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${postalCode}&key=b10cf7f18b9d4785a1a5f486c87195d0`);
    //                 const location = response.data.results[0];
    //                 const components = location.components;

    //                 const city = components.state_district || "";
    //                 const state = components.state || "";
    //                 const country = components.country || "";
    //                 const latitude = location.geometry.lat;
    //                 const longitude = location.geometry.lng;

    //                 setCity(city);
    //                 setState(state);
    //                 setCountry(country);
    //                 // setLatitude(latitude);
    //                 // setLongitude(longitude);
    //             } catch (error) {
    //                 // toast.error("Error fetching location details. Please Provide Correct Postalcode");
    //                 toast.error('Error fetching location details. Please Provide Correct Postalcode', {
    //                     position: "bottom-center",
    //                     type: 'error',

    //                 });
    //                 setCity("");
    //                 setState("");
    //                 setCountry("");
    //             }
    //         }
    //     };

    //     fetchLocationDetails();
    // }, [postalCode]);

    // useEffect(() => {
    //     const fetchGeolocation = () => {
    //         if (navigator.geolocation) {
    //             navigator.geolocation.getCurrentPosition(
    //                 position => {
    //                     const { latitude, longitude } = position.coords;
    //                     setLatitude(latitude);
    //                     setLongitude(longitude);
    //                     setAllowed(true);
    //                 },
    //                 error => {
    //                     if (error.code === error.PERMISSION_DENIED) {
    //                         // toast.error("Location access is required to proceed.");
    //                         toast.error('Location access is required to proceed.',{
    //                             position:"bottom-center", 
    //                             type: 'error',

    //                         });
    //                        setAllowed(false);
    //                     }
    //                 }
    //             );
    //         } else  {
    //             // toast.error('Geolocation is not supported by this browser.');
    //             toast.error('Geolocation is not supported by this browser.',{
    //                 position:"bottom-center", 
    //                 type: 'error',

    //             });
    //             setAllowed(false);
    //         }
    //     };

    //     fetchGeolocation();
    // }, [navigate]);


    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingInfo({ address, area, landmark, city, phoneNo, postalCode, country, state, latitude, longitude }));
        if (isAuthenticated && latitude && longitude && allowed) {
            navigate('/order/confirm');
        }
        else if (!latitude || !longitude || !allowed) {
            //   toast.error("Please allow the Location for Next Step")
            toast.error('Please allow the Location to Proceed', {
                position: "bottom-center",
                type: 'error',

            });
        }
        else {
            // toast.error("Please allow the Location for Next Step")
            toast.error('Please allow the Location to Proceed', {
                position: "bottom-center",
                type: 'error',

            });
        }


    }

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;

        if (value.length > 10) {
            if (!hasExceeded) {
                toast.error('Phone number cannot exceed 10 digits', {
                    position: "bottom-center",
                    type: 'error',
                });
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
                toast.error('Postal code cannot exceed 6 digits', {
                    position: "bottom-center",
                    type: 'error',
                });
                setHasExceededPostalCode(true);
            }
        } else {
            setHasExceededPostalCode(false);
            setPostalCode(value);
        }
    };


    const handleCancelDelete = () => {
        setShowModal(false);
        navigate('/cart');
    };


    const handleMap = () => {
        handleCurrentLocation();
        setIsMap(true);
    }

    useEffect(() => {
        if (dummyLat && dummyLng && isMap) {
            setShowMapModal(true)
        }
    }, [dummyLat , dummyLng])



    const updatePosition = (lat, lng) => {
        setDummyLat(lat); // Store clicked position in dummy variables
        setDummyLng(lng);
    };

    const handleContinue = () => {
        setLatitude(dummyLat); // Set latitude state
        setLongitude(dummyLng); // Set longitude state
        setShowModal(false);
        setShowMapModal(false); // Close mapModal
    };

    const handleBack = () => {
        setIsButtonDisabled(false);
        setShowMapModal(false); // Close mapPopup without saving
        setShowModal(true);
    };

    return (
        <Fragment>
            <MetaData title={"Shipping"} />


            {!showMapModal && (
                <>
                    <div className="products_heading">Shipping</div>
                    <StepsCheckOut shipping />
                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form onSubmit={submitHandler} className="shadow-lg mt-0">
                                <h1 className="mb-4">Shipping Info </h1>
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
                                        {/* <button
                     className="btn btn-link"
                     onClick={handleRetryLocationAccess}
                 >
                     Retry
                 </button> */}
                                    </div>
                                )}

                                <button
                                    id="shipping_btn"
                                    type="submit"
                                    className="btn btn-block py-3"
                                >
                                    CONTINUE
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
                                <button type="button" className="close" onClick={handleCancelDelete} disabled={isButtonDisabled}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body d-flex justify-content-center">
                                {/* <p>Are you sure you want to delete this item?</p> */}
                                <button type="button" className="btn btn-info" onClick={handleCurrentLocation} disabled={isButtonDisabled}><i className="fa fa-map-marker" style={{ marginRight: '30px' }}></i>Use Current Location</button>

                            </div>
                            <div className="modal-body d-flex justify-content-center">
                                {/* <p>Are you sure you want to delete this item?</p> */}

                                <button type="button" className="btn btn-success" onClick={handleMap} disabled={isButtonDisabled}><i className="fa fa-map-marker" style={{ marginRight: '30px' }}></i>Locate on the Map</button>

                            </div>
                            {/* <div className="modal-footer">
                                        <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>OK</button>
                                        <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                                    </div> */}
                        </div>
                    </div>
                </div>
            )}
            {showMapModal && dummyLat && dummyLng && (
                <div style={mapFullScreenStyle}>
                    <MapContainer center={{ lat: dummyLat, lng: dummyLng }} zoom={13} style={{ height: '100vh', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapComponent setPosition={updatePosition} dummyLat={dummyLat} dummyLng={dummyLng} />
                    </MapContainer>
                    <div style={{ position: 'absolute', zIndex: '9999', bottom: '20px' }}>
                        <button type="button" className="btn btn-secondary" style={{margin:'5px'}} onClick={handleBack}>Back</button>
                        <button type="button" className="btn btn-primary" style={{margin:'5px'}} onClick={handleContinue}>Continue</button>
                    </div>
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
    zIndex: 9999, // Ensure it's on top of everything
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};


export default Shipping;
