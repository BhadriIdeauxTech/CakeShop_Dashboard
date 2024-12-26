import React from 'react';
import { useAuth } from './Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { IoMdLogOut } from "react-icons/io";

const LogoutBtn = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        sessionStorage.removeItem('sessionExpiration');
        notification.success({
            message: 'Logout Successful',
            description: 'You have been logged out.',
            placement: 'top',
            duration: 0.5,
            onClose: () => navigate('/login'),
        });
    };

    return (
        <button onClick={handleLogout} className="btn btn-">
            <IoMdLogOut /> Logout
        </button>
    );
};

export default LogoutBtn;
