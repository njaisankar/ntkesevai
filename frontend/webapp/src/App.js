import React from 'react';
//import $ from 'jquery'
//import 'bootstrap/dist/js/bootstrap.min.js'; // Correct import path

// import 'vegas'
// import 'wow.js'
// import './js/smoothscroll.js'
//import './js/custom.js'

import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeComponent from './pages/home/HomeComponent.js';
import LoginComponent from './pages/login/LoginComponent.js'; 
import DashboardComponent from './pages/dashboard/DashboardComponent.js'; 
import ForgotPasswordComponent from './pages/forgotpassword/ForgotPasswordComponent.js';
import RegisterComponent from './pages/register/RegisterComponent.js';
function App() {
  return (
    <Router>
    <Routes>
      <Route path='/' element = {<HomeComponent />} />
      <Route path='/login' element = {<LoginComponent/>} />
      <Route path='/forgotpassword' element = {<ForgotPasswordComponent/>} />
      <Route path='/register' element = {<RegisterComponent/>} />
      <Route path='/dashboard' element = {<DashboardComponent/>} />
    </Routes>
    </Router>
  );
}

export default App;
