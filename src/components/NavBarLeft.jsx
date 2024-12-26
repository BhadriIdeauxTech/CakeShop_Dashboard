import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/navLeft.css';
import { FaTachometerAlt, FaBox, FaCartPlus, FaUndoAlt, FaFileAlt, FaRedoAlt, FaSignOutAlt } from 'react-icons/fa';

const NavBarLeft = () => {
    const location = useLocation();
    
    return (
        <div className="navBarLeft">
            <ul className='m-0 p-0'>
                <li>
                    <NavLink
                        to='/'
                        className={({ isActive }) => isActive || location.pathname === '/' ? 'active-link' : ''} 
                    >
                        <FaTachometerAlt className="nav-icon" />
                        <span className="nav-text">Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/sales'
                        className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <FaBox className="nav-icon" />
                        <span className="nav-text">Sales</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/addProduct'
                        className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <FaCartPlus className="nav-icon" />
                        <span className="nav-text">Add Product</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/returnItems'
                        className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <FaUndoAlt className="nav-icon" />
                        <span className="nav-text">Return Items</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/report'
                        className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <FaFileAlt className="nav-icon" />
                        <span className="nav-text">Reports</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/recovery'
                        className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <FaRedoAlt className="nav-icon" />
                        <span className="nav-text">Recovery</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/logout'
                        className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <FaSignOutAlt className="nav-icon" />
                        <span className="nav-text">Logout</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default NavBarLeft;
