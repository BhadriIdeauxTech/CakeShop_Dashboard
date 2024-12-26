import React from 'react';
import '../styles/header.css';
import { IoSearchOutline } from "react-icons/io5";
import { MdNotificationsActive } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
import { Link } from 'react-router-dom'
const Header = () => {

  const location = useLocation();

  const pathToTitle = {
    '/': 'Dashboard',
    '/sales': 'Sales',
    '/add-category': 'Add Category',
    '/add-type': 'Add Type',
    '/add-subtype': 'Add Sub Type',
    '/add-product': 'Add Products',
    '/report': 'Report',
    '/remove-items': 'Remove Items',
    '/return-items': 'Return Items',
    '/logout': 'Log Out',
  };

  const currentTitle = pathToTitle[location.pathname] || 'Dashboard'; 
  const user = JSON.parse(sessionStorage.getItem('authUser')) || {};

  return (
    <div className='headerTopSec'>
      <h3 className='me-4 text-'>{currentTitle}</h3>
      <div className="searchBardCont d-flex">
        <div className="input-group input-group-sm ">
          <span className="input-group-text" id="inputGroup-sizing-sm">
            <IoSearchOutline />
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
          />
        </div>

        <div className="notificationIconCont">
          <MdNotificationsActive style={{ fontSize: '20px' }} />
        </div>
      </div>

      <div className="userContentTop">
        <div>
          <img
            src={'/assets/images/users/GiftLee.jpg'}
            alt="Profile"
            style={{ width: '50px', borderRadius: '10px', marginRight: '10px' }}
          />
        </div>
        <div className="userdet">
          <h6 className='mb-0'>{user.name || 'Guest'}</h6>
          <p className='mb-0'>{user.role || 'User'}</p>
        </div>
      </div>
      <div className='logOutBtnCont'>
        <Link to="/logout" className={({ isActive }) => (isActive ? 'active-link' : '')} >
          <button className="logOut">
            <span className='ms-1'>
              <FiLogOut />
            </span>
          </button>
          <br />
          Log Out
        </Link>
      </div>
    </div>
  );
}

export default Header;
