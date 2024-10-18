import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you're looking for doesn't exist or you don't have permission to access it.</p>
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                Return to Home
            </Link>
        </div>
    );
};

export default PageNotFound;
