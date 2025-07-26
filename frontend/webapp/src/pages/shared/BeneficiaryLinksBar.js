import React, { useEffect, useState } from 'react';
import './BeneficiaryLinksBar.css'; // Import the CSS file for this component

// --- Mock Database (Simulating data fetched from a backend) ---
const mockBeneficiaryLinksData = {
    1: [ // Corresponds to MenuComponent's link.id 1: 'குடும்ப அட்டை' (Ration Card)
        { name: "TN Ration Website", url: "https://www.tnpds.gov.in/pages/login/login.xhtml" },
        { name: "Apply for New Ration Card", url: "https://www.tnpds.gov.in/pages/public/register-new.xhtml" },
        { name: "Ration Card Status Check", url: "https://www.tnpds.gov.in/pages/public/status.xhtml" },
        { name: "F.A.Q on Ration Card", url: "https://www.tnpds.gov.in/pages/public/faq.xhtml" },
    ],
    2: [ // Corresponds to MenuComponent's link.id 2: 'ஆதார்' (Aadhar)
        { name: "Aadhar Official Website", url: "https://uidai.gov.in/" },
        { name: "Download e-Aadhar", url: "https://eaadhaar.uidai.gov.in/" },
        { name: "Check Aadhar Status", url: "https://resident.uidai.gov.in/check-aadhaar-status" },
        { name: "Locate Enrollment Center", url: "https://appointments.uidai.gov.in/easearch.aspx" },
        { name: "Update Aadhar Details", url: "https://ssup.uidai.gov.in/ssup/" },
    ],
    3: [ // Corresponds to MenuComponent's link.id 3: 'பான்' (PAN)
        { name: "Income Tax India Portal", url: "https://www.incometax.gov.in/iec/foportal/" },
        { name: "Apply for New PAN Card", url: "https://tin.tin.nsdl.com/pan/form49Ad.html" },
        { name: "PAN Card Status", url: "https://tin.tin.nsdl.com/pan/StatusTrack.html" },
        { name: "Link Aadhar to PAN", url: "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar" },
    ],
    // You can add a default or empty array for cases where selectedServiceId might be null/undefined,
    // or for a serviceId that doesn't have specific links yet.
    default: [
        { name: "General Government Services Portal", url: "https://www.india.gov.in/" },
        { name: "National Scholarship Portal", url: "https://scholarships.gov.in/" },
    ]
};

const BeneficiaryLinksBar = ({ serviceId }) => {
    const [links, setLinks] = useState([]);

    useEffect(() => {
        // In a real application, you'd make an API call here:
        // fetch(`/api/beneficiary-links?serviceId=${selectedServiceId}`)
        //   .then(response => response.json())
        //   .then(data => setLinks(data))
        //   .catch(error => console.error('Error fetching links:', error));

        // For this example, we use the mock data based on selectedServiceId
        var fetchedLinks = [];
        fetchedLinks = mockBeneficiaryLinksData[serviceId] || mockBeneficiaryLinksData.default;
        setLinks(fetchedLinks);

    }, [serviceId]); // Re-run this effect whenever selectedServiceId changes

    return (
        <div className="beneficiary-links-bar">
            {links.length > 0 ? (
                <>
                    <p>Quick Links for Beneficiaries:</p>
                    <div className="links-container">
                        {links.map((link, index) => (
                            <a
                                key={link.url} // Using URL as key is usually safe for unique links, otherwise use a unique ID from data
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </>
            ) : (
                <p>No specific links available for this selection.</p>
            )}
        </div>
    );
};

export default BeneficiaryLinksBar;