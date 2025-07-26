import React, { useState, useRef } from 'react';

const HeaderComponent = ({ userData, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout and redirect to login page
  const handleLogout = () => {
    if (onLogout) onLogout();
    window.location.href = "/login"; // Change to your login route if needed
  };

  return (

    
    <header className="app-header d-flex justify-content-between align-items-center p-3">
      <h2 className="mb-0">ராவணன் மக்கள் சேவை மையம்</h2>
      <div className="profile-area d-flex align-items-center" style={{ position: "relative" }}>
        <img
          src="/assets/media/cover/ntk-symbol.jpg"
          alt="Profile"
          style={{ width: 50, borderRadius: '50%', marginRight: 12, cursor: "pointer" }}
          onClick={() => setShowDropdown(!showDropdown)}
        />
        {showDropdown && (
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: 50,
              right: 0,
              background: "#fff",
              color: "#222",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              minWidth: 380,
              zIndex: 1000,
              padding: "0.5rem 0"
            }}
          >
            <div style={{ padding: "0.5rem 1rem", fontWeight: 600, borderBottom: "1px solid #eee" }}>
             நல்வரவு <strong>{userData?.first_name}, {userData?.last_name}</strong>
            </div>
            <button
              className="btn btn-link w-100"
              style={{ color: "#e53935", fontWeight: 600, textAlign: "center", padding: "0.5rem 1rem" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderComponent;