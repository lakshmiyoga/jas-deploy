import React, { useEffect, useState, useRef } from 'react'
import { postEnquiryDetails } from '../../actions/enquiryActions'
import MetaData from '../Layouts/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { Slide, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import NumberInput from '../Layouts/NumberInput';
import { clearEnquiryDeleted, clearEnquiry } from '../../slices/enquirySlice';

const Enquiry = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        message: ""
    });
    const [files, setFiles] = useState([]);
    console.log("files", files)
    // console.log("formdata",formData)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const { loading, error, isSubmitted } = useSelector(state => state.enquiryState);

    // const hasShownToast = useRef(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        // await dispatch(postEnquiryDetails(formData));
        const form = new FormData();
        form.append('name', formData.name);
        form.append('email', formData.email);
        form.append('mobile', formData.mobile);
        form.append('message', formData.message);

        // Append all files to the FormData object
        files.forEach(file => form.append('files', file));

        await dispatch(postEnquiryDetails(form));
    };

    const handleChange = (e) => {
        // e.preventDefault();
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Filter files by acceptable formats: images (jpeg, jpg, png) and PDF
        const validFiles = selectedFiles.filter(file =>
            ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type)
        );

        // Calculate the total size of selected files (in bytes)
        const totalSize = validFiles.reduce((acc, file) => acc + file.size, 0);

        // Convert the total size from bytes to MB (1MB = 1,048,576 bytes)
        const totalSizeInMB = totalSize / (1024 * 1024);

        if (totalSizeInMB > 1) {
            toast.error('Total file size exceeds 10MB. Please upload smaller files.', {
                position: 'bottom-center',
            });
            e.target.value = null;
            return
        }
        else {
            if (validFiles.length !== selectedFiles.length) {
                toast.error('Only JPEG, JPG, PNG, or PDF files are allowed.', {
                    position: 'bottom-center',
                })
                e.target.value = null;
                return
            }

            setFiles(validFiles); // Set valid files in state  
        }
    };




    useEffect(() => {
        if (isSubmitted) {
            // toast('Enquiry Submitted successfully',{
            //     type:'success',
            //     position:"bottom-center",
            //     onOpen: () => dispatch(clearEnquiry())
            //   })
            toast.dismiss();
            setTimeout(() => {
                toast.success('Enquiry Submitted successfully', {
                    position: 'bottom-center',
                    type: 'success',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearEnquiry())
                });
            }, 300);


            navigate('/')

        } if (error) {
            // toast(error, {
            //     position: "bottom-center",
            //     type: 'error',
            //     onOpen: () => dispatch(clearEnquiry())
            // })
            toast.dismiss();
            setTimeout(() => {
                toast.error(error, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => dispatch(clearEnquiry())
                });
            }, 300);
            // hasShownToast.current = true;
        }
    }, [isSubmitted, error])


    return (
        <div>
            {/* <MetaData title={`Enquiry`} /> */}
            <MetaData
                title="Enquiry"
                description="Have any questions or need assistance? Submit your enquiry here, and our customer service team will get back to you promptly."
            />

            <div className="products_heading">Enquiry</div>

            <div className="row wrapper mt-0">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="border" style={{ marginTop: "0px" }}>
                        <div className="form-group">
                            <label htmlFor="name_field">Name <span style={{ color: 'red' }}>*</span></label>
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
                            <label htmlFor="email_field">Email <span style={{ color: 'red' }}>*</span></label>
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
                            <label htmlFor="phone_field">Phone No (+91) </label>
                            <NumberInput
                                id="mobile_field"
                                name="mobile"
                                className="no-arrow-input form-control"
                                value={formData.mobile}
                                onChange={handleChange}
                            />
                        </div>

                        {/* <div className="form-group">
                            <label htmlFor="message_field">Message <span style={{ color: 'red' }}>*</span></label>
                            <textarea
                                id="message_field"
                                name="message"
                                className="form-control"
                                style={{ height: "20vh" }}
                                value={formData.message}
                                onChange={handleChange}
                            />
                        </div> */}

                        <div className="form-group">
                            <label htmlFor="message_field">
                                Message <span style={{ color: 'red' }}>*</span>
                            </label>
                            <textarea
                                id="message_field"
                                name="message"
                                className="form-control"
                                style={{ height: "20vh" }}
                                maxLength="1000"
                                value={formData.message}
                                onChange={(e) => {
                                    if (e.target.value.length <= 300) {
                                        handleChange(e); // Update form data
                                    }
                                }}
                            />
                            <small className="text-muted">
                                {300 - formData.message.length} characters remaining
                            </small>
                        </div>

                        {/* <div className="form-group">
                            <label htmlFor="files_field">Upload Files (JPEG, JPG, PNG, PDF) - Max total size: 10MB</label>
                            <input
                                type="file"
                                id="files_field"
                                name="files"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="form-control"
                                onChange={handleFileChange}
                                multiple // Allow multiple files
                            />
                        </div> */}

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
