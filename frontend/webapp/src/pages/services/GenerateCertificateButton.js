// GenerateCertificateButton.js
import React, { useState } from 'react';
import { GenerateCertificate } from '../../services/servicelogic.js';

// This is a valid React Component now.
const GenerateCertificateButton = ({ recordId, documentAttachment, recordStatus, token }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerateCertificate = async (event) => {
        event.preventDefault();

        setIsLoading(true);
        setError(null);

        try {
            const response = await GenerateCertificate(recordId, token);

            if (response.ok) {
            // Read the response as a binary blob, not JSON
            const blob = await response.blob();

            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);
            //
            // // Open the image in a new tab
            // const newWindow = window.open(url, '_blank');
            // if (newWindow) {
            //     newWindow.focus();
            // } else {
            //     // Fallback for browsers that block pop-ups
            //     console.error("Popup blocked. Please allow pop-ups for this site.");
            // }

            // Or, if you want to force a download:
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'certificate.jpg');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the object URL after a short delay
            setTimeout(() => window.URL.revokeObjectURL(url), 100);

        } else {
            const errorText = await response.text();
            setError(`Error: ${response.status} - ${errorText}`);
        }
    } catch (err) {
        setError("Network error. Could not generate certificate.");
        console.error(err);
    } finally {
        setIsLoading(false);
    }
    };

    const isApproved = true;//recordStatus === "Approved"; // Your status check here

    if (isApproved) {
        return (
            <div>
                <button
                    onClick={handleGenerateCertificate}
                    disabled={isLoading}
                    className="btn btn-sm btn-primary"
                >
                    {isLoading ? 'உருவாக்குகிறது...' : 'பதிவிறக்கு'}
                </button>
                {error && <small className="text-danger d-block mt-1">{error}</small>}
            </div>
        );
    } else {
        return (
            <span className="text-muted">கோப்பு இல்லை</span>
        );
    }
}

export default GenerateCertificateButton;