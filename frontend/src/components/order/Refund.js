import React,{useState} from 'react'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Refund = () => {
    const [orderId, setOrderId] = useState('');
    const [status, setStatus] = useState('');
    const [amount, setAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    sessionStorage.setItem('redirectPath', location.pathname);

    const handleRefund = async () => {
        try {
            const response = await axios.post('api/v1/refund', {orderId, amount });
            const data = response.data;
            console.log(response);
            if (data.error) {
                setErrorMessage(data.message || 'An error occurred during the refund process.');
            } else {
                setStatus('Refund processed successfully');
            }
        } catch (error) {
            // console.error('Error handling Juspay refund:', error);
            setErrorMessage('Error handling Juspay refund: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Process Refund</h1>
            <label>Order ID: </label>
            <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
            <br />
            <label>Amount: </label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <br />
            <button onClick={handleRefund}>Process Refund</button>
            {status && <p>Status: {status}</p>}
            {errorMessage && <p>Error: {errorMessage}</p>}
        </div>
    );
}


export default Refund
