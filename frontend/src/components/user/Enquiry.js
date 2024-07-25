import React, { useEffect, useState } from 'react'
import { postEnquiryDetails } from '../../actions/enquiryActions'
import MetaData from '../Layouts/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import {  toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NumberInput from '../Layouts/NumberInput';

const Enquiry = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        message: ""
    });
console.log("formdata",formData)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error,isSubmitted } = useSelector(state => state.enquiryState);

    const submitHandler = async(e) => {
        e.preventDefault();
        await dispatch(postEnquiryDetails(formData));
        // setFormData("");
        console.log(formData)
    };

    const handleChange = (e) => {
        // e.preventDefault();
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(()=>{
        if(isSubmitted){
            toast.success('Submitted Successfuly')
            navigate('/')
            
        } if(error){
            toast(error, {
                position: "bottom-center",
                type: 'error',
            })
            return
        }
    },[isSubmitted,error])
   

    return (
        <div>
            <MetaData title={`Enquiry`} />
            <div className="products_heading">Enquiry</div>

            <div className="row wrapper mt-0">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="border" style={{ marginTop: "0px" }}>
                        <div className="form-group">
                            <label htmlFor="name_field">Name</label>
                            <input
                                type="text"
                                id="name_field"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Mobile</label>
                            <NumberInput
                                id="mobile_field"
                                name="mobile"
                                className="no-arrow-input form-control"
                                value={formData.mobile}
                                onChange={handleChange}  
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message_field">Message</label>
                            <textarea
                                id="message_field"
                                name="message"
                                className="form-control"
                                style={{ height: "20vh" }}
                                value={formData.message}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            id="submit_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading}
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Enquiry;
