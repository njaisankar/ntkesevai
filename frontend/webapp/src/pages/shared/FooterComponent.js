import React from 'react';

const FooterComponent = () => (
  <footer className="app-footer bg-dark text-white text-center py-2 mt-auto">
    <small>
      &copy; {new Date().getFullYear()} NTK E-Sevai. All rights reserved.
    </small>
  </footer>
);

export default FooterComponent;
