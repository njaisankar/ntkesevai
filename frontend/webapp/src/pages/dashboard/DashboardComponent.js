import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderComponent from '../shared/HeaderComponent';
import MenuComponent from '../shared/MenuComponent';
import BeneficiaryLinksBar from '../shared/BeneficiaryLinksBar';
import FooterComponent from '../shared/FooterComponent';
import ServiceRequestListComponent from '../services/ServiceRequestListComponent';
import HomeComponent from '../services/HomeComponent';
import './DashboardComponent.css';

const DashboardComponent = () => {
  const [selectedServiceId, setSelectedServiceId] = useState("0: முகப்பு"); // Default to Home
  const location = useLocation();
  const userData = location.state?.userData;
  return (
    <div className="fdashboard-container">
      <HeaderComponent userData={userData} />
      <MenuComponent serviceId={selectedServiceId} onSelect={setSelectedServiceId} userData={userData} />
      <BeneficiaryLinksBar serviceId={selectedServiceId} />
      <main className="main-content">
        {/* Conditional Rendering Logic */}
        {selectedServiceId == "0: முகப்பு"? (
          <HomeComponent />
        ) : (
          <ServiceRequestListComponent serviceId={selectedServiceId} userData={userData} />
        )}
      </main>
      <FooterComponent />
    </div>
  );
};

export default DashboardComponent;