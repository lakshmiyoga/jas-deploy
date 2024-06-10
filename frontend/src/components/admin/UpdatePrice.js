import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../Layouts/Loader';
import Sidebar from '../admin/Sidebar'; // Assuming Sidebar component is in this path

const UpdatePrice = () => {
    const [items, setItems] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setloading] = useState(false);
 
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
            <div className="row">
                <div className="col-12 col-md-2 p-0">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <h1 className="my-4">Product Price Upload</h1>
                    <Fragment>
                        {
                            loading ? <Loader /> : (
                                <div style={{ width: '100%', height: '100%' }}>
                                    {/* <div className="card"> */}
                                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', top: '20%', margin: '0 auto', width: 'fit-content' }}>
                                        <div style={{ border: 'solid 0.5px gray', padding: '50px' }}>
                                            <h5 className="card-title">Import Product Details Info</h5>
                                            <div className="mb-10" style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <input type="file" onChange={handleFileChange} className="form-control" />
                                                <button className="btn btn-success mb-3" style={{ maxWidth: '50%', marginTop: '5%' }} onClick={handleUpload}>Upload Price</button>
                                            </div>
                                        </div>
                                        <div style={{ border: 'solid 0.5px gray',borderLeft:'0PX', padding: '50px',position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                            <h5 className="card-title">Export Product Details</h5>
                                            <button className="btn btn-primary" onClick={downloadCSV}>Download Price</button>
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