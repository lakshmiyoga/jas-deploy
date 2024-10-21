import React from 'react';
import { Link } from 'react-router-dom';
import MetaData from './MetaData';

const Unauthorized = () => {
    return (
        <div>
            <MetaData
                title="Unauthorized Access"
                description="You do not have permission to access this page. Please log in with the appropriate credentials or contact support for assistance."
            />
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>403 - Unauthorized</h1>
                <p>Sorry, you don't have permission to access this page.</p>
                <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
                    Go Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
