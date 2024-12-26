import React, { useState } from 'react';
import { FaLock } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { useAuth } from './Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

import '../styles/login.css';
import logo from '../../src/assets/logo.png'
// import logo2 from '../../src/assets/logo-sm.png'
const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [formErrors, setFormErrors] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const credentials = [
        { email: 'admin@gmail.com', password: 'Admin@123', name: 'Admin', role: 'Administrator', profileImage: '/assets/images/users/Admin.jpg' },
        { email: 'gopal@gmail.com', password: 'Gopal@123', name: 'Gopal', role: 'User', profileImage: '/assets/images/users/Gopal.jpg' },
        { email: 'giftlee@gmail.com', password: 'Giftlee@123', name: 'GiftLee', role: 'Manager', profileImage: '/assets/images/users/GiftLee.jpg' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!formData.email) {
            setFormErrors((prevErrors) => ({ ...prevErrors, email: 'Please enter email' }));
        }
        if (!formData.password) {
            setFormErrors((prevErrors) => ({ ...prevErrors, password: 'Please enter password' }));
        }
        if (!formData.email || !formData.password) {
            setIsLoading(false);
            return;
        }

        const user = credentials.find(
            (cred) => cred.email === formData.email && cred.password === formData.password
        );

        if (user) {
            login();
            sessionStorage.setItem('authUser', JSON.stringify(user));
            sessionStorage.setItem('sessionExpiration', new Date().getTime() + 60 * 60 * 1000);

            notification.success({
                message: 'Login Successful!',
                description: `Welcome back, ${user.name}.`,
                placement: 'top',
                duration: 0.3,
            });

            setTimeout(() => navigate('/'), 300);
        } else {
            if (!credentials.some(cred => cred.email === formData.email)) {
                setFormErrors(prevErrors => ({ ...prevErrors, email: 'Wrong username' }));
            }
            if (!credentials.some(cred => cred.password === formData.password)) {
                setFormErrors(prevErrors => ({ ...prevErrors, password: 'Wrong password' }));
            }
        }
        setIsLoading(false);
    };

    return (
        <section>
            <div className="d-flex justify-content-center align-items-center">
                <div className="loginSection">
                    <div className="formContainer">
                        <div className="row mb-4">
                            <div className="col-12 d-flex justify-content-center">
                                <img src={logo} alt="" style={{ width: '100px' }} className='img-fluid' />
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text" id="basic-addon1">
                                        <MdAlternateEmail />
                                    </span>
                                    <input
                                        type="text"
                                        name="email"
                                        className="form-control"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        autoComplete='off'
                                    />
                                </div>
                                {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
                            </div>
                            <div className="mb-2">
                                <div className="input-group">
                                    <span className="input-group-text" id="basic-addon1">
                                        <FaLock />
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        autoComplete='off'
                                    />
                                </div>
                                {formErrors.password && <small className="text-danger">{formErrors.password}</small>}
                            </div>

                            <div className="mb-2 row d-flex align-items-center justify-content-end text-end py-0 my-0" style={{ fontSize: '10px' }}>
                                <div className="d-flex align-items-center justify-content-end">
                                    <input
                                        type="checkbox"
                                        className="me-1"
                                        checked={showPassword}
                                        onChange={() => setShowPassword(prevState => !prevState)}
                                    />
                                    <label className="me-1">
                                        Show Password
                                    </label>
                                </div>
                            </div>


                            <button type="submit" className="loginBtn" disabled={isLoading}>
                                {isLoading ? "Loading..." : "LOGIN"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
