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

import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../../slices/cartSlice";
import StepsCheckOut from './StepsCheckOut';
import { toast } from 'react-toastify';
import axios from 'axios';

export const validateShipping = (shippingInfo, navigate) => {
    if (
        !shippingInfo.address ||
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
    const { isAuthenticated ,user} = useSelector(state => state.authState);
    const [address, setAddress] = useState(shippingInfo.address);
    const [city, setCity] = useState(shippingInfo.city);
    // const [city, setCity] = useState("Chennai");
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
    const [country, setCountry] = useState(shippingInfo.country);
    // const [country, setCountry] = useState("India")
    const [state, setState] = useState(shippingInfo.state);
    // const [state, setState] = useState("TamilNadu");
    const [allowed,setAllowed] = useState(true);
    const [latitude, setLatitude] = useState('12.947146336879577');
    const [longitude, setLongitude] = useState('77.62102993895199');
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    useEffect(() => {
        const fetchLocationDetails = async () => {
            if (postalCode && postalCode.length === 6) { // Adjust the length check as per your postal code format
                try {
                    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${postalCode}&key=b10cf7f18b9d4785a1a5f486c87195d0`);
                    const location = response.data.results[0];
                    const components = location.components;

                    const city = components.county || "";
                    const state = components.state || "";
                    const country = components.country || "";
                    // const latitude = location.geometry.lat;
                    // const longitude = location.geometry.lng;
                    
                    setCity(city);
                    setState(state);
                    setCountry(country);
                    // setLatitude(latitude);
                    // setLongitude(longitude);
                } catch (error) {
                    toast.error("Error fetching location details. Please Provide Correct Postalcode");
                    setCity("");
                    setState("");
                    setCountry("");
                }
            }
        };

        fetchLocationDetails();
    }, [postalCode]);

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
    //                         toast.error("Location access is required to proceed.");
    //                        setAllowed(false);
    //                     }
    //                 }
    //             );
    //         } else  {
    //             toast.error('Geolocation is not supported by this browser.');
    //             setAllowed(false);
    //         }
    //     };

    //     fetchGeolocation();
    // }, [navigate]);


    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country, state, latitude, longitude }));
        if (isAuthenticated && latitude && longitude && allowed) {
            navigate('/order/confirm');
        }
        else if(!latitude || !longitude || !allowed){
              toast.error("Please allow the Location for Next Step")
        }
        else{
            toast.error("Please allow the Location for Next Step")
        }


    }

    return (
        <Fragment>
            <div className="products_heading">Shipping</div>
            <StepsCheckOut shipping />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg mt-0">
                        <h1 className="mb-4">Shipping Info</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
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
                            <label htmlFor="phone_field">Phone No</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code_field">Postal Code</label>
                            <input
                                type="number"
                                id="postal_code_field"
                                className="form-control"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
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
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country_field">Country</label>
                            <input
                                type="text"
                                id="country_field"
                                className="form-control"
                                value={country}
                                readOnly
                            />
                        </div>
                        {!allowed && !latitude && !longitude && (
                            <div className="alert alert-danger" role="alert">
                                Location access is required to proceed. Please Allow Location for this Site to Continue {' '}
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
        </Fragment>
    );
}

export default Shipping;
