// GenerateCertificateButton.js
import React, { useState } from 'react';
import { GenerateCertificate, fetchBlobData } from '../../services/servicelogic.js';

// This is a valid React Component now.
const GenerateCertificateButton = ({ recordId, documentAttachment, recordStatus, token }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerateCertificate = async (event) => {
        event.preventDefault();

        setIsLoading(true);
        setError(null);


        try {
            const ENDPOINT_BASE_URL = 'http://127.0.0.1:8000'
            const endpoint = `api/service/servicerequestdetails/${recordId}/generate_certificate`;
            const CONTENT_TYPE_JSON = 'application/jpeg';
            const API_URL = `${ENDPOINT_BASE_URL}/${endpoint}`;
            console.log('API URL =>',API_URL)
            const options = {
                method: 'GET',
                headers: {
                    'authorization': `Token ${token}`
                    }
            };

//            const headers = {
//                'Content-Type': CONTENT_TYPE_JSON,
//                ...options.headers, // Allow custom headers to override or extend
//            };
//
//            // Stringify the body if it's an object
//            const body = options.body ? JSON.stringify(options.body) : undefined;
            //const response = await GenerateCertificate(recordId, token);
            //const response = await fetch(`${ENDPOINT_BASE_URL}/${endpoint}`, options);
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'authorization': `Token ${token}`,
                    'Accept': 'image/jpeg'
                }
            });
            console.log('image certificate ', response)
            if (response.ok) {
                // Read the response as a binary blob, not JSON
                const blob =  await response.blob();
                console.log("Blob Size:", blob.size);
                // Create a temporary URL for the blob
                const imageUrl = URL.createObjectURL(blob);

               //Open the image in a new tab
             const newWindow = window.open(imageUrl, '_blank');
             if (newWindow) {
                 newWindow.focus();
             } else {
                 // Fallback for browsers that block pop-ups
                 console.error("Popup blocked. Please allow pop-ups for this site.");
             }

            // Or, if you want to force a download:
            const link = document.createElement('a');
            link.href = imageUrl;
            link.setAttribute('download', 'certif.jpg');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the object URL after a short delay
            setTimeout(() => {
                URL.revokeObjectURL(imageUrl);
                console.log("Memory cleared for certificate URL");
            }, 1000);
        } else {
            setError("Error while reading the image:", response.status);
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