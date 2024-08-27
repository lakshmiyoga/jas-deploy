import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../Layouts/Loader';
import Sidebar from '../admin/Sidebar'; // Assuming Sidebar component is in this path
import { useLocation } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';

const UpdatePrice = () => {
    const [items, setItems] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setloading] = useState(false);
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            setloading(true);
            const formData = new FormData();
            if (!file) {
                toast.error('Please Select the File.');
                setloading(false);
                return;
            }
            formData.append('csvFile', file);
            await axios.post('/api/v1/upload/price', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Prices updated successfully');
            setloading(false);
            setItems([]);
            setFile(null);
        } catch (error) {
            setloading(false);
            toast.error('Error uploading file. Please try again.');
        }
    };

    useEffect(() => {
        fetch('/api/v1/getproducts')
            .then(response => response.json())
            .then(data => {
                setItems(data.getitems);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const downloadCSV = () => {
        setloading(true);
        fetch('/api/v1/download/price?format=csv')
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'items.csv');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                setloading(false);
            })
            .catch(error => console.error('Error downloading CSV:', error));
        setloading(false);
    };

    return (
        <div className="container-fluid" style={{ height: 'auto' }}>
            <MetaData title={`Update Price`} />
            <div className="row">
                <div className="col-12 col-md-2 p-0">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10 smalldevice-space">
                    <h3 className="my-4 admin-dashboard-x">Product Price Upload</h3>
                    <Fragment>
                        {
                            loading ? <Loader /> : (
                                <div className="row" style={{marginTop:'10%'}}>
                                    <div className="col-12 col-md-6 mb-4 ">
                                        <div className="card update_price h-100" >
                                            <div className="card-body">
                                                <h5 className="card-title ml-3">Import Product Details Info</h5>
                                                <div className="mb-3 d-flex flex-column align-items-center ml-3">
                                                    <input type="file" onChange={handleFileChange} className="form-control mb-2" />
                                                    <button className="btn btn-success" onClick={handleUpload}>Upload Price</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 mb-4">
                                        <div className="card update_price h-100">
                                            <div className="card-body">
                                                <h5 className="card-title ml-3">Export Product Details</h5>
                                                <button className="btn btn-primary ml-3" onClick={downloadCSV}>Download Price</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </Fragment>
                </div>
            </div>
        </div>
    );
};

export default UpdatePrice;
