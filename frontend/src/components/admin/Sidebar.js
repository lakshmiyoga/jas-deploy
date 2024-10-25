import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';


const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="sidebar-wrapper">
            <nav id="sidebar">
                <ul className="list-unstyled components">
                    <li>
                        <Link to='/admin/dashboard'><i className='fas fa-tachometer-alt'></i> Dashboard</Link>
                    </li>

                    <li>
                        <NavDropdown title={<i className='fa fa-product-hunt'> Product</i>}>
                            <NavDropdown.Item onClick={() => navigate('/admin/products')}> <i className='fa fa-shopping-basket product-dropdown'> All</i></NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/admin/products/create')}> <i className='fa fa-plus product-dropdown'> Create </i></NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/admin/products/updateprice')}> <i className='fa fa-upload product-dropdown'> UpdatePrice </i></NavDropdown.Item>
                        </NavDropdown>
                    </li>

                    <li>
                        <NavDropdown title={<i className='fa fa-shopping-basket'> Orders</i>}>
                            <NavDropdown.Item onClick={() => navigate('/admin/orders')}> <i className='fa fa-list'> Order List</i></NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/admin/order-summary')}> <i className='fa fa-file-text'> Order Summary </i></NavDropdown.Item>     
                        </NavDropdown>
                    </li>

                    {/* <li>
                        <Link to='/admin/orders'><i className='fa fa-shopping-basket'></i> Orders</Link>
                    </li> */}

                    <li>
                        {/* <Link to='/admin/users'><i className='fa fa-users'></i> Users</Link> */}

                        <NavDropdown title={<i className="fa fa-users"> Users</i>}>
                            <NavDropdown.Item onClick={() => navigate('/admin/users')}> <i className='fa fa-list'> User List</i></NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/admin/user-summary')}> <i className='fa fa-file-text'> User Summary </i></NavDropdown.Item>     
                        </NavDropdown>
                    </li>
                    <li>
                        <Link to="/admin/payments"><i className="fa fa-credit-card"></i> Payments</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar;
