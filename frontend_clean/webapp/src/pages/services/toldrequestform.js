import React, { useEffect, useState } from 'react';
import {
    CreateServiceRequestDetails,
    UpdateServiceRequestDetails, // Import the new update function
    getServiceDetails,
    getBlockDetails,
    getTownPanchayatDetails,
    getPanchayatDetails,
    getRevenueVillageDetails,
    getTownPanchayatVillageDetails,
    getServiceRequestDetailsById // Import the new fetch by ID function
} from '../../services/servicelogic.js';

// Pass props relevant to edit mode: isEditMode, recordId
function ServiceRequestForm({ onClose, onSaved, isEditMode, recordId, serviceId, userData }) {
    // Dropdown data states
    const [services, setServices] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [panchayats, setPanchayats] = useState([]);
    const [townPanchayats, setTownPanchayats] = useState([]);
    const [revenueVillages, setRevenueVillages] = useState([]);
    const [townPanchayatVillages, setTownPanchayatVillages] = useState([]);

    // Selected values for dropdowns (controlled components)
    const [selectedServiceId, setSelectedServiceId] = useState('');
       const [selectedDistrictId, setSelectedDistrictId] = useState('1'); // Matches formData.district_id
    const [selectedBlockTownId, setSelectedBlockTownId] = useState('none'); // '1' for Town Panchayat, '2' for Panchayat, '3' for Other
    const [selectedTownPanchayatId, setSelectedTownPanchayatId] = useState('none');
    const [selectedPanchayatId, setSelectedPanchayatId] = useState('none');
    const [selectedRevenueVillageId, setSelectedRevenueVillageId] = useState('none');
    const [selectedTownPanchayatVillageId, setSelectedTownPanchayatVillageId] = useState('none');
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [filePreview, setFilePreview] = useState(null); // To display current document attachment URL

    // Form data state
    const [formData, setFormData] = useState({
        service_detail_id: '', // Initialize as empty, will be set from props or selection
        district_id: '1', // Assuming a fixed district for now
        block_id: '', // Will be set based on selection
        town_panchayat_id: '',
        panchayat_id: '', // Added this as it's used in your logic for panchayat selection
        revenue_village_id: '',
        village_name: '',
        address_line1: '',
        street_name: '',
        job_num: '',
        shop_num: '',
        ref_number: '',
        document_attachment: null, // For file uploads
        first_name: '',
        last_name: '',
        registered_mobile: '',
        contact_mobile: '',
        email_id: '',
        amount: '0.00'
    });

    const token = userData?.token; // Get token from props or context

    // --- EFFECT FOR FETCHING DROPDOWN DATA (runs once on mount) ---
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [
                    servicesData,
                    blocksData,
                    panchayatsData,
                    townPanchayatsData,
                    revenueVillagesData,
                    townPanchayatVillagesData
                ] = await Promise.all([
                    getServiceDetails(token),
                    getBlockDetails(token),
                    getPanchayatDetails(token),
                    getTownPanchayatDetails(token),
                    getRevenueVillageDetails(token),
                    getTownPanchayatVillageDetails(token)
                ]);

                setServices(servicesData);
                // Filter blocks - be cautious with hardcoded filters like block_id === '2'
                setBlocks(blocksData.filter(block => block.district_id === '1')); // Filter by district, not block_id here
                setPanchayats(panchayatsData);
                setTownPanchayats(townPanchayatsData);
                setRevenueVillages(revenueVillagesData);
                setTownPanchayatVillages(townPanchayatVillagesData);

            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };
        fetchDropdownData();
    }, []); // Empty dependency array ensures this runs only once on component mount

    // --- EFFECT FOR FETCHING RECORD DATA IN EDIT MODE ---
    useEffect(() => {
        const fetchRecordForEdit = async () => {
            if (isEditMode && recordId && token) {
                setLoading(true);
                try {
                    const record = await getServiceRequestDetailsById(recordId, token);
                    console.log("Fetched record for edit:", record); // Debugging

                    // Set formData with fetched record values, providing fallbacks
                    setFormData({
                        service_detail_id: record.service_detail_id || '',
                        district_id: record.district_id ? String(record.district_id) : '1', // Ensure string
                        block_id: record.block_id ? String(record.block_id) : '',
                        town_panchayat_id: record.town_panchayat_id ? String(record.town_panchayat_id) : '',
                        panchayat_id: record.panchayat_id ? String(record.panchayat_id) : '',
                        revenue_village_id: record.revenue_village_id ? String(record.revenue_village_id) : '',
                        village_name: record.village_name || '',
                        address_line1: record.address_line1 || '',
                        street_name: record.street_name || '',
                        job_num: record.job_num || '',
                        shop_num: record.shop_num || '',
                        ref_number: record.ref_number || '',
                        document_attachment: null, // File inputs cannot be pre-filled for security
                        first_name: record.first_name || '',
                        last_name: record.last_name || '',
                        registered_mobile: record.registered_mobile || '',
                        contact_mobile: record.contact_mobile || '',
                        email_id: record.email_id || '',
                        amount: record.amount ? String(record.amount) : '0.00', // Ensure amount is string for input
                    });

                    // Set state variables for dropdowns to trigger dependent fetches and selections
                    setSelectedServiceId(record.service_detail_id ? String(record.service_detail_id) : '');
                    setSelectedDistrictId(record.district_id ? String(record.district_id) : '1');

                    // Determine selectedBlockTownId and nested dropdowns
                    if (record.town_panchayat_id) {
                        setSelectedBlockTownId('1'); // Corresponds to "பேரூராட்சி"
                        setSelectedTownPanchayatId(String(record.town_panchayat_id));
                        // After townPanchayatVillages are loaded by its useEffect, find matching village
                        // This might require a small delay or a separate effect if townPanchayatVillages isn't immediately available
                        if (record.street_name) {
                            // This might need to run after townPanchayatVillages are fetched and available
                            // For simplicity, directly try to find it. In a complex form, you might use a ref or an additional useEffect.
                             setTimeout(() => { // Small delay to allow townPanchayatVillages to populate
                                const matchingVillage = townPanchayatVillages.find(v => v.village_street_name === record.street_name);
                                if (matchingVillage) {
                                    setSelectedTownPanchayatVillageId(String(matchingVillage.id));
                                }
                            }, 100); // Adjust delay if needed
                        }
                    } else if (record.panchayat_id || record.revenue_village_id) {
                        setSelectedBlockTownId('2'); // Corresponds to "ஊராட்சி"
                        setSelectedPanchayatId(record.panchayat_id ? String(record.panchayat_id) : '');
                        setSelectedRevenueVillageId(record.revenue_village_id ? String(record.revenue_village_id) : '');
                        if (record.street_name) {
                            setTimeout(() => { // Small delay
                                const matchingVillage = townPanchayatVillages.find(v => v.village_street_name === record.street_name);
                                if (matchingVillage) {
                                    setSelectedTownPanchayatVillageId(String(matchingVillage.id));
                                }
                            }, 100);
                        }
                    } else if (record.street_name && !record.town_panchayat_id && !record.panchayat_id && !record.revenue_village_id) {
                        setSelectedBlockTownId('3'); // Corresponds to "இதர" (direct street name input)
                    } else {
                        setSelectedBlockTownId('none');
                    }

                    // For existing file, display its URL
                    if (record.document_attachment) {
                        setFilePreview(record.document_attachment);
                    } else {
                        setFilePreview(null);
                    }

                } catch (error) {
                    console.error('Error fetching service request for edit:', error);
                    setFormError('Failed to load record for editing. Please try again.');
                } finally {
                    setLoading(false);
                }
            } else {
                // Reset form for a new entry if not in edit mode or no recordId
                setFormData({
                    service_detail_id: '', district_id: '1', block_id: '',
                    town_panchayat_id: '', revenue_village_id: '', panchayat_id: '',
                    village_name: '', address_line1: '', street_name: '', job_num: '', shop_num: '', ref_number: '',
                    document_attachment: null,
                    first_name: '', last_name: '', registered_mobile: '', contact_mobile: '', email_id: '', amount: '0.00'
                });
                setSelectedServiceId('');
                setSelectedBlockTownId('none');
                setSelectedTownPanchayatId('none');
                setSelectedPanchayatId('none');
                setSelectedRevenueVillageId('none');
                setSelectedTownPanchayatVillageId('none');
            }
        };

        // Only try to fetch record if dropdown data is loaded (especially townPanchayatVillages
        // needed for setting selectedTownPanchayatVillageId) or if it's not edit mode (for reset).
        if (services.length > 0 || !isEditMode) { // Use services as a proxy for dropdowns loaded
            fetchRecordForEdit();
        }

    }, [isEditMode, recordId, token, services, townPanchayatVillages]); // Dependencies: reruns when these change

    // --- HANDLERS ---
    const serviceIdHandleChange = (e) => {
        setFormData((prevFormData) => ({ ...prevFormData, service_detail_id: e.target.value }));
        setSelectedServiceId(e.target.value);
    };

    const blockTownIdHandleChange = (e) => {
        const value = e.target.value;
        setSelectedBlockTownId(value);
        // Reset dependent selections and form data when this changes
        setSelectedTownPanchayatId('none');
        setSelectedPanchayatId('none');
        setSelectedRevenueVillageId('none');
        setSelectedTownPanchayatVillageId('none');
        setFormData((prevFormData) => ({
            ...prevFormData,
            // You might need to set block_id here if it corresponds to the general block selection
            // If it's always district_id:1 and block_id:2, keep it fixed or set it conditionally
            town_panchayat_id: '',
            panchayat_id: '',
            revenue_village_id: '',
            village_name: '',
            street_name: '' // Reset street name if it's derived from these
        }));
    };

    const townPanchayatIdHandleChange = (e) => {
        const value = e.target.value;
        setSelectedTownPanchayatId(value);
        setFormData((prevFormData) => ({ ...prevFormData, town_panchayat_id: value }));
        // Reset dependent village selection if any
        setSelectedTownPanchayatVillageId('none');
        setFormData((prevFormData) => ({ ...prevFormData, street_name: '' }));
    };

    const panchayatIdHandleChange = (e) => {
        const value = e.target.value;
        setSelectedPanchayatId(value);
        setFormData((prevFormData) => ({ ...prevFormData, panchayat_id: value }));
        // Reset dependent revenue village/town panchayat village
        setSelectedRevenueVillageId('none');
        setSelectedTownPanchayatVillageId('none');
        setFormData((prevFormData) => ({ ...prevFormData, revenue_village_id: '', village_name: '', street_name: '' }));
    };

    const revenueVillageIdHandleChange = (e) => {
        const value = e.target.value;
        setSelectedRevenueVillageId(value);
        setFormData((prevFormData) => ({ ...prevFormData, revenue_village_id: value }));
        // Also update village_name in formData if it comes from selected revenue village
        const selectedVillage = revenueVillages.find(v => String(v.village_id) === String(value));
        if (selectedVillage) {
            setFormData(prev => ({ ...prev, village_name: selectedVillage.name }));
        } else {
            setFormData(prev => ({ ...prev, village_name: '' }));
        }
    };

    const townPanchayatVillageIdHandleChange = (e) => {
        const selectedId = e.target.value;
        setSelectedTownPanchayatVillageId(selectedId);

        const selectedTownPanchayatVillage = townPanchayatVillages.find(
            (townPanchayatVillage) => String(townPanchayatVillage.id) === String(selectedId)
        );

        if (selectedTownPanchayatVillage) {
            setFormData((prevFormData) => ({ ...prevFormData, street_name: selectedTownPanchayatVillage.village_street_name }));
        } else {
            setFormData((prevFormData) => ({ ...prevFormData, street_name: '' }));
        }
    };

    const handleChange = (event) => {
        const { name, value, type, files } = event.target;

        if (type === 'file') {
            setFormData((prevFormData) => ({ ...prevFormData, [name]: files[0] }));
        } else {
            // Special handling for registered_mobile to also set contact_mobile
            if (name === 'registered_mobile') {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    registered_mobile: value,
                    contact_mobile: value
                }));
            } else {
                setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting data:', formData);
            if (isEditMode && recordId) {
                // Call update function if in edit mode
                await UpdateServiceRequestDetails(recordId, formData, token);
                console.log('Record updated successfully!');
            } else {
                // Call create function if not in edit mode
                await CreateServiceRequestDetails(formData, token);
                console.log('Record created successfully!');
            }
            if (onSaved) onSaved(); // Notify parent to close modal and refresh list
        } catch (error) {
            console.error('Error saving request:', error);
            // Optionally: Display a user-friendly error message here
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div >
                <div className="row g-3" id="put-object-form">
                    {/* Service Type Dropdown */}
                    <div className="col-md-3 col-12">
                        <div className="form-group">
                            <label>வேலைகள்</label>
                            <select className="form-control" value={selectedServiceId} onChange={serviceIdHandleChange}>
                                <option value="">வேலைகள்</option>
                                {services.map(service => (
                                    <option key={service.service_details_id} value={service.service_details_id}>
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Shop Number Input */}
                    <div className="col-md-3 col-12">
                        <div className="form-group">
                            <label>கடை எண்</label>
                            <input name="shop_num" className="form-control" type="text" value={formData.shop_num} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Reference Number Input */}
                    <div className="col-md-3 col-12">
                        <div className="form-group">
                            <label>குறிப்பு எண்</label>
                            <input name="ref_number" className="form-control" type="text" value={formData.ref_number} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Document Attachment Input (File) */}
                    <div className="col-md-3 col-12">
                        <div className="form-group">
                            <label>ஒப்புகை சீட்டு</label>
                            <input name="document_attachment" className="form-control" type="file" onChange={handleChange} />
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="col-md-3 col-12">
                        <div className="form-group">
                            <label>தொகை</label>
                            <input name="amount" className="form-control" type="number" value={formData.amount} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Beneficiary First Name Input */}
                    <div className="col-md-3 col-12">
                        <div className="form-group">
                            <label>பயனாளி முதல் பெயர்</label>
                            <input name="first_name" className="form-control" type="text" value={formData.first_name} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Beneficiary Last Name Input */}
                    <div className="col-md-3 col-12">
                        <div className="form-group">
                            <label>பயனாளி கடைசி பெயர்</label>
                            <input name="last_name" className="form-control" type="text" value={formData.last_name} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Registered Mobile Input */}
                    <div className="col-md-3 col-12">
                        <div className="form-group">
                            <label>பதிவு செய்யப்பட்ட கைபேசி</label>
                            <input name="registered_mobile" className="form-control" type="text" value={formData.registered_mobile} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Contact Mobile Input (auto-filled from registered_mobile) */}
                    <div className="col-md-3 col-12">
                        <div className="form-group">
                            <label>தொடர்பு எண்</label>
                            <input name="contact_mobile" className="form-control" type="text" value={formData.contact_mobile} onChange={handleChange} readOnly />
                        </div>
                    </div>

                    {/* Beneficiary Email Input */}
                    <div className="col-md-3 col-12">
                        <div className="form-group">
                            <label>பயனாளியின் மின்னஞ்சல்</label>
                            <input name="email_id" className="form-control" type="text" value={formData.email_id} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Town Panchayat / Panchayat Selection */}
                    <div className="col-md-3 col-12">
                        <div className="form-group">
                            <label>பேரூராட்சி / ஊராட்சி</label>
                            <select name="block_town_id" className="form-control" value={selectedBlockTownId} onChange={blockTownIdHandleChange}>
                                <option value="none">பேரூராட்சி அ ஊராட்சி</option>
                                <option value="1">பேரூராட்சி</option>
                                <option value="2">ஊராட்சி</option>
                                <option value="3">இதர</option>
                            </select>
                        </div>
                    </div>

                    {/* Conditional: Town Panchayat Dropdown */}
                    {selectedBlockTownId === '1' && (
                        <div className="col-md-3 col-12">
                            <div className="form-group">
                                <label>பேரூராட்சி</label>
                                <select name="town_panchayat_id" className="form-control" value={selectedTownPanchayatId} onChange={townPanchayatIdHandleChange}>
                                    <option value="none">பேரூராட்சி</option>
                                    {townPanchayats.map(townPanchayat => (
                                        <option key={townPanchayat.town_panchayat_id} value={townPanchayat.town_panchayat_id}>
                                            {townPanchayat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Conditional: Panchayat Dropdown */}
                    {selectedBlockTownId === '2' && (
                        <div className="col-md-3 col-12">
                            <div className="form-group ">
                                <label>ஊராட்சி</label>
                                <select name="panchayat_id" className="form-control" value={selectedPanchayatId} onChange={panchayatIdHandleChange}>
                                    <option value="none">ஊராட்சி</option>
                                    {panchayats.map(panchayat => (
                                        <option key={panchayat.id} value={panchayat.id}>
                                            {panchayat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Conditional: Revenue Village Dropdown (shown with Panchayat) */}
                    {selectedBlockTownId === '2' && (
                        <div className="col-md-3 col-12">
                            <div className="form-group">
                                <label>வருவாய் ஊர் பெயர்கள்</label>
                                <select name="revenue_village_id" className="form-control" value={selectedRevenueVillageId} onChange={revenueVillageIdHandleChange}>
                                    <option value="none">வருவாய் ஊர் பெயர்கள்</option>
                                    {revenueVillages.map(revenueVillage => (
                                        <option key={revenueVillage.village_id} value={revenueVillage.village_id}>
                                            {revenueVillage.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Conditional: Town Panchayat Village Dropdown (for 'பேரூராட்சி' or 'ஊராட்சி' depending on your design) */}
                    {(selectedBlockTownId === '1' || selectedBlockTownId === '2') && (
                        <div className="col-md-3 col-12">
                            <div className="form-group">
                                <label>சிற்றூர்/தெரு பெயர்</label>
                                <select name="town_panchayat_village_id" className="form-control" value={selectedTownPanchayatVillageId} onChange={townPanchayatVillageIdHandleChange}>
                                    <option value="none">சிற்றூர்/தெரு பெயர்</option>
                                    {townPanchayatVillages.map(townPanchayatVillage => (
                                        <option key={townPanchayatVillage.id} value={townPanchayatVillage.id}>
                                            {townPanchayatVillage.village_street_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Conditional: Street Name Input (for 'இதர' - direct entry) */}
                    {selectedBlockTownId === '3' && (
                        <div className="col-md-3 col-12">
                            <div className="form-group">
                                <label>தெரு பெயர்கள்</label>
                                <input name="street_name" className="form-control" type="text" value={formData.street_name} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className='row g-2'>
                        <div className="col-12 text-end">
                            <button type='submit' className="btn btn-primary js-tooltip" title="Save the record">
                                {isEditMode ? 'திருத்து' : 'பதிவு செய்க'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default ServiceRequestForm;