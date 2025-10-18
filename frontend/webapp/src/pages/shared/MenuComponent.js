import React, { useState, useEffect } from 'react';
import { getMasterService } from '../../services/servicelogic.js'; // Assuming this path is correct

const MenuComponent = ({ selectedServiceId, onSelect, userData }) => {
    const [masterServiceDetails, setMasterServiceDetails] = useState([]);
    const [masterServiceLoading, setMasterServiceLoading] = useState(true);

    const fetchMasterData = async () => {
        try {
            // Only fetch if data hasn't been loaded yet or if you specifically want to re-fetch
            // The 'masterServiceLoading' state controls this.
            if (masterServiceLoading) {
                const token = userData?.token;
                const fetchedDetails = await getMasterService(token);
                console.log('Master service list',await fetchedDetails.data);
                setMasterServiceDetails(await fetchedDetails.data);
                // Consider if you really want to store objects directly in localStorage this way.
                // localStorage.setItem('masterServiceList', JSON.stringify(fetchedDetails)); // Store stringified JSON
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setMasterServiceLoading(false);
        }
    };

    // Use an empty dependency array to run once on mount
    // or include userData.token if you expect token to change and want to re-fetch
    useEffect(() => {
        fetchMasterData();
    }, [userData?.token]); // Re-fetch if token changes, or remove if you want it once on mount

    // Helper to extract the ID part from the selectedServiceId string
    const getActiveId = (serviceIdString) => {
        if (typeof serviceIdString === 'string' && serviceIdString.includes(':')) {
            return serviceIdString.split(':')[0];
        }
        return null; // Or handle other cases as needed
    };

    const activeId = getActiveId(selectedServiceId);

    return (
        <nav className="menu-bar bg-light border-bottom py-1">
            <div className="d-flex flex-wrap gap-1">
                <button
                    key='0:முகப்பு' // Use the full string as key for consistency
                    className={`btn btn-link ${activeId === '0' ? 'active-card' : ''}`}
                    onClick={() => onSelect('0:முகப்பு')}
                >
                    முகப்பு
                </button>
                {masterServiceDetails.map(link => (
                    <button
                        key={`${link.service_id}:${link.service_name}`} // Ensure unique key, use full string
                        className={`btn btn-link ${activeId === String(link.service_id) ? 'active-card' : ''}`}
                        onClick={() => onSelect(`${link.service_id}:${link.service_name}`)}
                    >
                        {link.service_name}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default MenuComponent;