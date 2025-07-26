import React from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeComponent from './pages/home/HomeComponent.js';
import LoginComponent from './pages/login/LoginComponent.js'; 
import DashboardComponent from './pages/dashboard/DashboardComponent.js'; 
import ForgotPasswordComponent from './pages/forgotpassword/ForgotPasswordComponent.js';
import ResetPasswordComponent from './pages/forgotpassword/ResetPasswordComponent.js';
import RegisterComponent from './pages/register/RegisterComponent.js';
import ServiceRequestListComponent from './pages/services/ServiceRequestListComponent.js';

function App() {
  return (
    <div class='app'>
    <Router>
    <Routes>
      <Route path='/' element = {<HomeComponent />} />
      <Route path='/login' element = {<LoginComponent/>} />
      <Route path='/forgotpassword' element = {<ForgotPasswordComponent/>} />
      <Route path='/ResetPassword/:token' element = {<ResetPasswordComponent/>} />
      <Route path='/register' element = {<RegisterComponent/>} />
      <Route path='/dashboard' element = {<DashboardComponent/>} />
      <Route path='/servicerequest' element = {<ServiceRequestListComponent/>} />      
    </Routes>
    </Router>
    </div>
  );
}

export default App;
