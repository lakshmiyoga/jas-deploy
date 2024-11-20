// import React, { useEffect, Fragment, useState } from 'react';
// import { Button } from "react-bootstrap";
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useLocation } from "react-router-dom";
// import { adminOrders as adminOrdersAction } from "../../actions/orderActions";
// import Loader from '../Layouts/Loader';
// import { MDBDataTable } from 'mdbreact';
// import { toast } from 'react-toastify';
// import Sidebar from "../admin/Sidebar";
// import { clearError } from '../../slices/productsSlice';
// import { clearOrderDeleted, orderDetailClear } from "../../slices/orderSlice";
// import MetaData from '../Layouts/MetaData';
// import { porterClearData, porterClearResponse } from '../../slices/porterSlice';
// import { analysisOrders } from '../../actions/analysisActions';

// const Analysis = ({ isActive, setIsActive }) => {
//     const location = useLocation();
//     sessionStorage.setItem('redirectPath', location.pathname);
//     const { loading = true, error ,  refundedAmount ,dispatchedAmount ,usersCount,totalEnquiries,totalOrders,totalAmount} = useSelector(state => state.analysisState);
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');

//     console.log("all analysis datas ",refundedAmount,dispatchedAmount,usersCount,totalEnquiries,totalOrders)
//     const dispatch = useDispatch();

//     useEffect(() => {
//         dispatch(orderDetailClear());
//         dispatch(porterClearData());
//         dispatch(porterClearResponse());
//     }, [dispatch]);


//     useEffect(() => {
//         if (error) {
//             toast.error(error, {
//                 position: "bottom-center",
//                 onOpen: () => { dispatch(clearError()) }
//             });
//         }
//         dispatch(analysisOrders({ startDate, endDate }));
//     }, [dispatch, error, startDate, endDate]);

//     return (
//         <div>
//             <MetaData title={`Order list`} />
//             <div className="row">
//                 <div className="col-12 col-md-2">
//                     <div style={{ display: 'flex', flexDirection: 'row', position: 'fixed', top: '0px', zIndex: 99999, backgroundColor: '#fff', minWidth: '100%' }}>
//                         <Sidebar isActive={isActive} setIsActive={setIsActive} />
//                     </div>
//                 </div>
//                 <div className="col-12 col-md-10 smalldevice-space">
//                     <h1 className="my-4 admin-dashboard-x">Analysis</h1>
//                     <div style={{display:'flex',flexDirection:'row',maxWidth:'100%',flexWrap:'wrap'}}>
//                     <input
//                         type="date"
//                         value={startDate}
//                         onChange={(e) => setStartDate(e.target.value)}
//                         className="form-control mb-3 date-input"
//                         style={{maxWidth:'200px',marginRight:'20px'}}
//                         placeholder="Start Date"
//                     />
//                     <input
//                         type="date"
//                         value={endDate}
//                         onChange={(e) => setEndDate(e.target.value)}
//                         className="form-control mb-3 date-input"
//                         style={{maxWidth:'200px',marginRight:'20px'}}
//                         placeholder="End Date"
//                     />
//                     </div>

//                       {loading ? (
//                     <Loader />
//                 )  : (
//                     <>

//                     </>
//                 )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Analysis;

import React, { useEffect, Fragment, useState } from 'react';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { adminOrders as adminOrdersAction } from "../../actions/orderActions";
import Loader from '../Layouts/Loader';
import { Slide, toast } from 'react-toastify';
import Sidebar from "../admin/Sidebar";
import { clearError } from '../../slices/productsSlice';
import { clearOrderDeleted, orderDetailClear } from "../../slices/orderSlice";
import MetaData from '../Layouts/MetaData';
import { porterClearData, porterClearResponse } from '../../slices/porterSlice';
import { analysisOrders } from '../../actions/analysisActions';


const Analysis = ({ isActive, setIsActive }) => {
    const location = useLocation();
    // sessionStorage.setItem('redirectPath', location.pathname);
    const { loading = true, error, refundedAmount, dispatchedAmount, usersCount, totalEnquiries, totalOrders, totalAmount } = useSelector(state => state.analysisState);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(orderDetailClear());
        dispatch(porterClearData());
        dispatch(porterClearResponse());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            // toast.error(error, {
            //     position: "bottom-center",
            //     onOpen: () => { dispatch(clearError()) }
            // });
            toast.dismiss();
            setTimeout(() => {
                toast.error(error, {
                    position: 'bottom-center',
                    type: 'error',
                    autoClose: 700,
                    transition: Slide,
                    hideProgressBar: true,
                    className: 'small-toast',
                    onOpen: () => { dispatch(clearError()) }
                });
            }, 300);
        }
        dispatch(analysisOrders({ startDate, endDate }));
    }, [dispatch, error, startDate, endDate]);

    return (
        <div>
            {/* <MetaData title={`Analysis Dashboard`} /> */}
            <MetaData
                title="Analysis"
                description="Gain insights into sales trends, customer behavior, and product performance through detailed analytics and reports."
            />

            <div className="row loader-parent" style={{ margin: '5px' }}>
                <div className="col-12 col-md-2">
                    <div className="sidebar-fixed">
                        <Sidebar isActive={isActive} setIsActive={setIsActive} />
                    </div>
                </div>
                <div className="col-12 col-md-10 smalldevice-space loader-parent">
                    <h1 className="admin-dashboard-x mb-4">Analysis</h1>
                    <div className="filter-row">
                        <div style={{ display: 'flex', flexDirection: 'row', marginRight: '20px' }}>
                            <label>StartDate : </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="form-control mb-3 date-input"
                                placeholder="Start Date"
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', marginRight: '20px' }}>
                            <label>EndDate : </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="form-control mb-3 date-input"
                                placeholder="End Date"
                            />
                        </div>

                    </div>

                    {loading ? (
                        <div className="container loader-loading-center">
                            <Loader />
                        </div>
                    ) : (

                        <div className="row " style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div className="col-lg-3 col-md-3 col-6 mb-3">
                                <div className="card text-white o-hidden " style={{ backgroundColor: '#FED235', minHeight: '150px' }}>
                                    <div className="card-body">
                                        <div className="text-center card-font-size">
                                            Total Orders<br />
                                            <b>{totalOrders && totalOrders}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-3 col-6 mb-3">
                                <div className="card text-white o-hidden " style={{ backgroundColor: '#02441E', minHeight: '150px' }}>
                                    <div className="card-body">
                                        <div className="text-center card-font-size">
                                            Total Amount<br />
                                            <b>{totalAmount?.toFixed(2)}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="col-lg-3 col-md-3 col-6 mb-3">
                                <div className="card text-white o-hidden " style={{ backgroundColor: '#FED235', minHeight: '150px' }}>
                                    <div className="card-body">
                                        <div className="text-center card-font-size">
                                            Dispatched Amount<br />
                                            <b>{dispatchedAmount?.toFixed(2)}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-3 col-6 mb-3">
                                <div className="card text-white o-hidden " style={{ backgroundColor: '#02441E', minHeight: '150px' }}>
                                    <div className="card-body">
                                        <div className="text-center card-font-size">
                                            Refunded Amount<br />
                                            <b>{refundedAmount?.toFixed(2)}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-3 col-6 mb-3">
                                <div className="card text-white o-hidden " style={{ backgroundColor: '#FED235', minHeight: '150px' }}>
                                    <div className="card-body">
                                        <div className="text-center card-font-size">
                                            Users Count<br />
                                            <b>{usersCount}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-6 mb-3">
                                <div className="card text-white o-hidden " style={{ backgroundColor: '#02441E', minHeight: '150px' }}>
                                    <div className="card-body">
                                        <div className="text-center card-font-size">
                                            Total Enquiries<br />
                                            <b>{totalEnquiries}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analysis;
