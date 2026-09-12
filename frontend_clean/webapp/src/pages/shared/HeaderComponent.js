import React, { useState, useRef } from 'react';

const HeaderComponent = ({ userData, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const getUserRoleTamil = () => {
    if (userData?.isSuperUser) return "முதன்மை நிர்வாகி";
    if (userData?.isApprover) return "அங்கீகரிப்பாளர்";
    if (userData?.isCreator) return "உருவாக்குபவர்";
    return "பயனர்"; // Default User
  };
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
            <div style={{
        padding: "0.75rem 1rem",
        borderBottom: "1px solid #eee",
        backgroundColor: "#f9f9f9" // Light background to distinguish the section
    }}>
        {/* Row 1: Greeting */}
        <div style={{ fontSize: "1rem", color: "#333", marginBottom: "4px" }}>
            நல்வரவு, <strong>{userData?.first_name} {userData?.last_name}</strong>
        </div>

        {/* Row 2: User Role / Heading */}
        <div style={{ fontSize: "0.85rem", color: "#666" }}>
            <span style={{ fontWeight: 400 }}>பயனர் நிலை:</span>
            <span style={{
                marginLeft: "8px",
                fontWeight: 700,
                color: "#007bff", // Blue color for the role
                textTransform: "uppercase"
            }}>
                {getUserRoleTamil()}
            </span>
        </div>
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