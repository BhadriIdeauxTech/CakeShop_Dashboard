import React, { useState } from 'react';
import {  Layout, Menu, theme } from 'antd';
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import Dashboard from './components/dashboard/Dashboard.jsx';
import AddProduct from './components/addItems/AddProduct';
import Report from './components/Reports';
import ReturnItems from './components/ReturnItems';
import RemoveItemTable from './components/RemoveItems.jsx';
import AddCategory from './components/addItems/AddCategory.jsx';
import AddSubCategory from './components/addItems/AddSubCategory.jsx';

import Sales from './components/Sales';
import Login from './components/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import './styles/navLeft.css';
import { BsGraphUp } from "react-icons/bs";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import { GiReturnArrow } from "react-icons/gi";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { BiUndo } from "react-icons/bi";
import logo from '../src/assets/logo.png'
import logo2 from '../src/assets/logo-sm.png'
import { FaTrashAlt } from "react-icons/fa";
import {TbReportAnalytics } from "react-icons/tb";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiAddBoxFill } from "react-icons/ri";
import Billing from './components/Billing.jsx'
const { Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon: React.cloneElement(icon, { size: 18 }),
    children,
    label,
  };
}

const items = [
  getItem(
    <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>
      Dashboard
    </NavLink>,
    '1',
    <RiDashboardHorizontalFill />
  ),
  getItem(
    <NavLink to="/sales" className={({ isActive }) => (isActive ? 'active-link' : '')}>
      Sales
    </NavLink>,
    '2',
    <BsGraphUp />
  ),
  getItem('Add Items', 'sub1', <RiAddBoxFill />, [
    getItem(
      <NavLink to="/add-category" className={({ isActive }) => (isActive ? 'active-link' : '')}>
        Add Category
      </NavLink>,
      '3',
      <IoMdAddCircleOutline />
    ),

    getItem(
      <NavLink to="/add-subtype" className={({ isActive }) => (isActive ? 'active-link' : '')}>
        Add Sub Type
      </NavLink>,
      '4',
      <IoMdAddCircleOutline />
    ),
    getItem(
      <NavLink to="/add-product" className={({ isActive }) => (isActive ? 'active-link' : '')}>
        Add Products
      </NavLink>,
      '5',
      <IoMdAddCircleOutline />
    ),
  ]),
  getItem('Return Items', 'sub2', <GiReturnArrow />, [
    getItem(
      <NavLink to="/return-items" className={({ isActive }) => (isActive ? 'active-link' : '')}>
        Return Item
      </NavLink>,
      '6',
      <BiUndo />
    ),
    getItem(
      <NavLink to="/remove-items" className={({ isActive }) => (isActive ? 'active-link' : '')}>
        Remove Items
      </NavLink>,
      '7',
      <FaTrashAlt />
    ),
  ]),
  getItem(
    <NavLink to="/report" className={({ isActive }) => (isActive ? 'active-link' : '')}>
      Report
    </NavLink>,
    '8',
    <TbReportAnalytics />
  ),
  getItem(
    <NavLink to="/billing" className={({ isActive }) => (isActive ? 'active-link' : '')}>
      Billing
    </NavLink>,
    '9',
    <Billing />
  )
];
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  return (
    <AuthProvider>
      <Layout style={{ minHeight: '100vh' }}>
        {!isLoginPage && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={{ height: '100vh' }} 
          >
            <div className="demo-logo-vertical" />
            <div className="logoCont px-4 pt-2 pb-0 d-flex justify-content-center">
              <img
                src={collapsed ? logo2 : logo}
                className="img-fluid"
                alt="Logo"
                style={{ width: collapsed ? '100%' : '75%' }}
              />
            </div>
            <Menu
  defaultSelectedKeys={['1']}
  mode="inline"
  items={items}
  className="mt-3 scrollable-menu"  // Add the custom class here
  style={{
    height: 'calc(100vh - 80px)',  // Adjust height
    overflowY: 'auto',  // Enable vertical scroll
  }}
/>

          </Sider>
        )}

        <Layout>
          {!isLoginPage && <Header />}
          <Content
            style={{
              margin: '20px',
            }}
          >
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
                <Route path="/add-category" element={<ProtectedRoute><AddCategory /></ProtectedRoute>} />
                {/* <Route path="/add-type" element={<ProtectedRoute><AddType /></ProtectedRoute>} /> */}
                <Route path="/add-subtype" element={<ProtectedRoute><AddSubCategory /></ProtectedRoute>} />
                <Route path="/return-items" element={<ProtectedRoute><ReturnItems /></ProtectedRoute>} />
                <Route path="/remove-items" element={<ProtectedRoute><RemoveItemTable /></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
                <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </div>
          </Content>
          {!isLoginPage && (
            <Footer style={{ textAlign: 'center' }}>
              Billing  © {new Date().getFullYear()} Ideaux Tech
            </Footer>
          )}
        </Layout>
      </Layout>
    </AuthProvider>
  );
};
export default App