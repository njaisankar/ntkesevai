import React from 'react';


const ModelComponent = ({ showModal, onClose, title, children }) => {
    // If showModal is false, don't render anything
    if (!showModal) return null;

    return (
        <div className="modal-backdrop" style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050 // Higher z-index than other page content, common for modals
        }}>
            <div className="modal-content" style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "8px",
                minWidth: "300px",
                maxWidth: "90vw", // Use responsive max-width
                maxHeight: "90vh", // Use responsive max-height
                overflowY: "auto", // Enable vertical scrolling if content overflows
                position: "relative",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
            }}>
                <button
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "none",
                        border: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        color: "#333"
                    }}
                    onClick={onClose} // This is the crucial part: it calls the onClose prop
                    aria-label="Close modal"
                >
                    &times;
                </button>
                {title && <h3 style={{ marginBottom: "15px" }}>{title}</h3>}
                {children}
            </div>
        </div>
    );
};

export default ModelComponent;