import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import {Slide, toast } from 'react-toastify';
import Loader from '../Layouts/Loader';
import Sidebar from '../admin/Sidebar'; // Assuming Sidebar component is in this path
import { useLocation } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import { getAdminProducts } from '../../actions/productsActions';
import { useDispatch } from 'react-redux';
import LoaderButton from '../Layouts/LoaderButton';

const UpdatePrice = ({ isActive, setIsActive }) => {
    const [items, setItems] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setloading] = useState(false);
    const [downloadloading, setdownloadloading] = useState(false);
    const [warning, setWarning] = useState(false)
    const location = useLocation();
    const dispatch = useDispatch();
    // sessionStorage.setItem('redirectPath', location.pathname);

    // const handleFileChange = (e) => {
    //     setFile(e.target.files[0]);
    // };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const maxSize = 10 * 1024 * 1024; // 10 MB in bytes

        if (selectedFile && selectedFile.size && selectedFile.size > maxSize) {
            toast.error('The file size exceeds the 10MB limit.');
            setFile(null); // Reset the file state
            return
        } else {
            setFile(selectedFile);
        }
    };

    // const handleUpload = async () => {
    //     try {
    //         setloading(true);
    //         const formData = new FormData();
    //         if (!file) {
    //             // toast.error('Please Select the File.');
    //             toast.dismiss();
    //             setTimeout(() => {
    //             toast.error('Please Select the File.', {
    //               position: 'bottom-center',
    //               type: 'error',
    //               autoClose: 700,
    //               transition: Slide,
    //               hideProgressBar: true,
    //               className: 'small-toast',
    //             });
    //           }, 300);
    //             setloading(false);
    //             return;
    //         }
    //         formData.append('Prices', file);
    //         const data = await axios.post('/api/v1/upload/price', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
    //         console.log("Prices updated", data)


    //         if (data && data.status === 200) {
    //             setloading(false); 
    //             setItems([]);                 // Clear items
    //             setFile(null);                // Clear file
    //             // toast.success('Prices updated successfully', {
    //             //     onClose: () => {
    //             //         dispatch(getAdminProducts()); // Dispatch after toast is closed
    //             //     },
    //             //     autoClose: 3000, // Optional: Define how long the toast will stay open
    //             // });
    //             toast.dismiss();
    //             setTimeout(() => {
    //             toast.success('Prices updated successfully', {
    //               position: 'bottom-center',
    //               type: 'success',
    //               autoClose: 700,
    //               transition: Slide,
    //               hideProgressBar: true,
    //               className: 'small-toast',
    //               onClose: () => {
    //                         dispatch(getAdminProducts()); // Dispatch after toast is closed
    //                     },
    //             });
    //           }, 300);
    //         }
    //         else {
    //             // toast.error('Error uploading file. Please try again.');
    //             toast.dismiss();
    //             setTimeout(() => {
    //             toast.error('Error uploading file. Please try again.', {
    //               position: 'bottom-center',
    //               type: 'error',
    //               autoClose: 700,
    //               transition: Slide,
    //               hideProgressBar: true,
    //               className: 'small-toast',
    //             });
    //           }, 300);
    //         }


    //     } catch (error) {
    //         setloading(false);
    //         // toast.error('Error uploading file. Please try again.');
    //         toast.dismiss();
    //             setTimeout(() => {
    //             toast.error(error.response.data.message, {
    //               position: 'bottom-center',
    //               type: 'error',
    //               autoClose: 700,
    //               transition: Slide,
    //               hideProgressBar: true,
    //               className: 'small-toast',
    //             });
    //           }, 300);
    //         //   console.log("catch error",error)
    //     }
    // };

    // const handleUpload = async () => {
    //     try {
    //         setloading(true);
    //         const formData = new FormData();
    
    //         if (!file) {
    //             toast.dismiss();
    //             setTimeout(() => {
    //                 toast.error('Please Select the File.', {
    //                     position: 'bottom-center',
    //                     type: 'error',
    //                     autoClose: 700,
    //                     transition: Slide,
    //                     hideProgressBar: true,
    //                     className: 'small-toast',
    //                 });
    //             }, 300);
    //             setloading(false);
    //             return;
    //         }
    
    //         formData.append('Prices', file);
    //         const response = await axios.post('/api/v1/upload/price', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });

    //         console.log("response", response)

    //         if(response && response.status === 200){

    //             if (response && response.data && response.data.warnings && response.data.warnings.length > 0) {
    //                 response.warnings.forEach((warning) => {
    //                     toast.dismiss();
    //                     setTimeout(()=>{
    //                         toast.warn(warning, {
    //                             position: 'bottom-center',
    //                             type: 'warning',
    //                             autoClose: 400,
    //                             transition: Slide,
    //                             hideProgressBar: true,
    //                             className: 'small-toast',
    //                         });
    //                     },200)  
    //                 });
    //                 setWarning(true);
    //             }
                
                
    //             if (response && response.data && !response.data.warnings || !response.data.warnings.length > 0 ) {
    //                 setWarning(true);
    //             }
                
                
                
    //             if (response && response.status === 200 && warning) {
    //                 const data = response.data;
    //                 setloading(false);
    //                 setItems([]); // Clear items
    //                 setFile(null); // Clear file
                
    //                 // Display success message
    //                 toast.dismiss();
    //                 setTimeout(() => {
    //                     toast.success('Prices updated successfully', {
    //                         position: 'bottom-center',
    //                         type: 'success',
    //                         autoClose: 700,
    //                         transition: Slide,
    //                         hideProgressBar: true,
    //                         className: 'small-toast',
    //                         onClose: () => {
    //                             dispatch(getAdminProducts());
    //                         },
    //                     });
    //                     setWarning(true);
    //                 }, 300);
                
                   
    //             }
    //         }else {
    //             toast.dismiss();
    //             setTimeout(() => {
    //                 toast.error('Error uploading file. Please try again.', {
    //                     position: 'bottom-center',
    //                     type: 'error',
    //                     autoClose: 700,
    //                     transition: Slide,
    //                     hideProgressBar: true,
    //                     className: 'small-toast',
    //                 });
    //             }, 300);
    //         }
    //     } catch (error) {
    //         setloading(false);
    //         toast.dismiss();
    //         setTimeout(() => {
    //             toast.error(error.response?.data?.message || 'Error uploading file. Please try again.', {
    //                 position: 'bottom-center',
    //                 type: 'error',
    //                 autoClose: 700,
    //                 transition: Slide,
    //                 hideProgressBar: true,
    //                 className: 'small-toast',
    //             });
    //         }, 300);
    //     }
    // };
    
    const handleUpload = async () => {
        try {
            setloading(true);
            const formData = new FormData();
    
            if (!file) {
                toast.dismiss();
                setTimeout(() => {
                    toast.error('Please Select the File.', {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
                setloading(false);
                return;
            }
    
            formData.append('Prices', file);
            const response = await axios.post('/api/v1/upload/price', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response && response.status === 200) {
                const data = response.data;
                setloading(false);
                setItems([]); // Clear items
                setFile(null); // Clear file
    
                // Display success message
                toast.dismiss();
                setTimeout(() => {
                    toast.success('Prices updated successfully', {
                        position: 'bottom-center',
                        type: 'success',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                        onClose: () => {
                            dispatch(getAdminProducts());
                        },
                    });
                }, 300);
    
                // Display warnings if any
                if (data.warnings && data.warnings.length > 0) {
                    data.warnings.forEach((warning) => {
                        toast.warn(warning, {
                            position: 'bottom-center',
                            type: 'warning',
                            autoClose: 700,
                            transition: Slide,
                            hideProgressBar: true,
                            className: 'small-toast',
                        });
                    });
                }
            } else {
                toast.dismiss();
                setTimeout(() => {
                    toast.error('Error uploading file. Please try again.', {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
            }
        } catch (error) {
            setloading(false);
            toast.dismiss();
            setTimeout(() => {
                toast.error(error.response?.data?.message || 'Error uploading file. Please try again.', {
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
        fetch('/api/v1/getproducts')
            .then(response => response.json())
            .then(data => {
                setItems(data.getitems);
            })
            // .catch(error => console.error('Error fetching data:', error));
            .catch(error => {
                toast.dismiss();
                setTimeout(() => {
                    toast.error('Error fetching data in get Products.', {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
            });
            
    }, []);

    const downloadCSV = () => {
        setdownloadloading(true);
        const currentDate = new Date().toISOString().split('T')[0];
        fetch('/api/v1/download/price?format=xlsx')
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `items-${currentDate}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                setdownloadloading(false);
            })
            // .catch(error => toast.error('Error downloading file:', error));
            .catch(error => {
                toast.dismiss();
                setTimeout(() => {
                    toast.error('Error downloading file:', {
                        position: 'bottom-center',
                        type: 'error',
                        autoClose: 700,
                        transition: Slide,
                        hideProgressBar: true,
                        className: 'small-toast',
                    });
                }, 300);
            });
            
        setdownloadloading(false);
    };

    return (
        <div>
            <MetaData 
  title="Update Price" 
  description="Update product pricing across your catalog. Adjust prices based on sales, market trends, or product performance." 
/>

     
        <div className="container-fluid" style={{ height: 'auto' }}>
            {/* <MetaData title={`Update Price`} /> */}
            <div className="row">
                <div className="col-12 col-md-2 p-0">
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>
                <div className="col-12 col-md-10 smalldevice-space">
                    <h3 className="mb-4 admin-dashboard-x">Product Price Upload</h3>
                    <Fragment>
                        <div className="row" style={{ marginTop: '5%' }}>
                            <div className="col-12 col-md-6 mb-4 ">
                                <div className="card update_price h-100" >
                                    <div className="card-body">
                                        <h5 className="card-title ml-3">Import Product Details Info (*File size should be within 10mb)</h5>
                                        <div className="mb-3 d-flex flex-column align-items-center ml-3">
                                            <input type="file" onChange={handleFileChange} accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="form-control mb-2" />
                                            <button className="btn btn-success" onClick={handleUpload} disabled={loading}>
                                                {loading ? <LoaderButton fullPage={false} size={20} /> : (
                                                    <span>  Upload Price</span>
                                                )

                                                }

                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 mb-4">
                                <div className="card update_price h-100">
                                    <div className="card-body">
                                        <h5 className="card-title ml-3">Export Product Details</h5>
                                        <button className="btn btn-primary ml-3" onClick={downloadCSV} disabled={downloadloading || loading }>
                                            {downloadloading ? <LoaderButton fullPage={false} size={20} /> : (
                                                <span>   Download Price</span>
                                            )

                                            }


                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                </div>
            </div>
        </div>
        </div>
    );
};

export default UpdatePrice;
