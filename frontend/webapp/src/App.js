import './App.css';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeComponent from './pages/home/HomeComponent.js';
import LoginComponent from './pages/login/LoginComponent.js'; 
import DashboardComponent from './pages/dashboard/DashboardComponent.js'; 
import ForgotPasswordComponent from './pages/forgotpassword/ForgotPasswordComponent.js';
import ResetPasswordComponent from './pages/forgotpassword/ResetPasswordComponent.js';
import RegisterComponent from './pages/register/RegisterComponent.js';
import ServiceRequestListComponent from './pages/services/ServiceRequestListComponent.js';
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd'; // Make sure this is imported
import { MessagePopupProvider } from './contexts/MessagePopupContext'; // Import the provider

const App = () => {
  return (
    <ConfigProvider>
    <MessagePopupProvider>
      <Router>
        <Routes>
          <Route path='/' element={<HomeComponent />} />
          <Route path='/login' element={<LoginComponent />} />
          <Route path='/forgotpassword' element={<ForgotPasswordComponent />} />
          <Route path='/ResetPassword/:token' element={<ResetPasswordComponent />} />
          <Route path='/register' element={<RegisterComponent />} />
          <Route path='/dashboard' element={<DashboardComponent />} />
          <Route path='/servicerequest' element={<ServiceRequestListComponent />} />
        </Routes>
      </Router>

       <Toaster
        position="top-right" // You can change this (e.g., "top-center")
        reverseOrder={false}
        toastOptions={{
          // Default options for all toasts
          duration: 3000, // 3 seconds
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            fontSize: '1.2rem', // <--- Make font size bigger (adjust as needed)
            padding: '16px 24px', // <--- Increase padding (vertical horizontal)
            minWidth: '250px', // <--- Give it a minimum width
            maxWidth: '400px', // <--- Give it a maximum width
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Add a subtle shadow
          },
          // Specific options for success, error etc.
          success: {
            duration: 3000,
            style: {
              color: 'white',
              fontSize: '1.2rem', // You can override or keep global
              padding: '16px 24px',
            },
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 4000,
          },
        }}
      />
    </MessagePopupProvider>
    </ConfigProvider>
  );
};

export default App;