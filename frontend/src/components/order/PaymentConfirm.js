import React, { useEffect, useState } from 'react';
import store from '../../store';
import { Link, useLocation, useParams } from 'react-router-dom';
import { loadUser } from '../../actions/userActions';
import { getProducts } from '../../actions/productsActions';
import { orderCompleted } from "../../slices/cartSlice";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import MetaData from '../Layouts/MetaData';


const PaymentConfirm = () => {

  const { id } = useParams();
  const location = useLocation();
  sessionStorage.setItem('redirectPath', location.pathname);
  const [paymentStatus, setPaymentStatus] = useState('LOADING');
  const [paymentDetails, setPaymentDetails] = useState({});
  const dispatch = useDispatch();


  useEffect(() => {
    async function fetchData() {
      try {
        const url = `/api/v1/handleJuspayResponse/${encodeURIComponent(id)}`;
        const { data } = await axios.get(url, { withCredentials: true });
        if (data && data.sessionResponse) {
          setPaymentStatus(data.sessionResponse.status);
          setPaymentDetails(data.sessionResponse);
        } else {
          setPaymentStatus('UNKNOWN');
        }
      } catch (error) {
        console.error('Error fetching payment status:', error);
        setPaymentStatus('ERROR');
      }
    }
    fetchData();
    dispatch(orderCompleted())
  }, [id]);

  const renderPaymentDetails = () => {
    const { amount, payment_method, order_id, txn_id, date_created } = paymentDetails;
    return (
      <div>
        <MetaData
          title="Payment Confirmation"
          description="Your payment has been successfully processed. Review your payment confirmation details and proceed with your order tracking."
        />

        <div className="payment-details">
          <h1>{getTitle(paymentStatus)}</h1>
          <img src={getIcon(paymentStatus)} alt={paymentStatus} />
          <table>
            <tbody>
              <tr>
                <td>Amount</td>
                <td>{amount}</td>
              </tr>
              <tr>
                <td>Payment method</td>
                <td>{(payment_method ? payment_method : 'N/A')}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{getStatusText(paymentStatus)}</td>
              </tr>
              <tr>
                <td>order_id</td>
                <td>{order_id}</td>
              </tr>
              <tr>
                <td>Transaction_id</td>
                <td>{(txn_id ? txn_id : 'N/A')}</td>
              </tr>
              <tr>
                <td>Date</td>
                <td>{new Date(date_created).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div className="link-container">
            <Link to="/orders" className="orders-link">Go to Orders</Link>
          </div>
        </div>
      </div>
    );
  };

  const getTitle = (status) => {
    switch (status) {
      case 'CHARGED':
        return 'Transaction Successful!';
      case 'PENDING':
        return 'Transaction Pending';
      case 'PENDING_VBV':
        return 'Transaction Pending';
      case 'AUTHORIZATION_FAILED':
        return 'Transaction Failed';
      case 'AUTHENTICATION_FAILED':
        return 'Transaction Failed';
      case 'NEW':
        return 'Transaction Cancelled';
      case 'AUTHORIZING':
        return 'Transaction Pending';
      default:
        return 'Transaction Status';
    }
  };

  const getIcon = (status) => {
    switch (status) {
      case 'CHARGED':
        return 'https://img.icons8.com/color/48/000000/checkmark.png';
      case 'PENDING':
        return 'https://img.icons8.com/color/48/000000/hourglass-sand-bottom.png';
      case 'PENDING_VBV':
        return 'https://img.icons8.com/color/48/000000/hourglass-sand-bottom.png';
      case 'AUTHORIZATION_FAILED':
        return 'https://img.icons8.com/color/48/000000/cancel.png';
      case 'AUTHENTICATION_FAILED':
        return 'https://img.icons8.com/color/48/000000/cancel.png';
      case 'NEW':
        return 'https://img.icons8.com/color/48/000000/cancel.png';
      case 'AUTHORIZING':
        return 'https://img.icons8.com/color/48/000000/hourglass-sand-bottom.png';
      default:
        return '❌';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CHARGED':
        return '✔️ Successful';
      case 'PENDING':
        return '⌛ Pending';
      case 'PENDING_VBV':
        return '⌛ Pending';
      case 'AUTHORIZATION_FAILED':
        return '❌ Failed';
      case 'AUTHENTICATION_FAILED':
        return '❌ Failed';
      case 'NEW':
        return '❌ Cancelled';
      case 'AUTHORIZING':
        return '⌛ AUTHORIZING';
      default:
        return '❓ Unknown';
    }
  };

  return (
    <div className="payment-confirm">

      {paymentStatus === 'LOADING' && <p>Loading...</p>}
      {paymentStatus !== 'LOADING' && renderPaymentDetails()}



    </div>
  );
};

export default PaymentConfirm;

