import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>403 - Unauthorized</h1>
            <p>Sorry, you don't have permission to access this page.</p>
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
                Go Back to Home
            </Link>
        </div>
    );
};

export default Unauthorized;
