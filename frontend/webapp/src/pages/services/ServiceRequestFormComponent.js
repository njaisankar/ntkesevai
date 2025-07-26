import React, { useState, useEffect } from 'react';
import { getMasterService, getBlockDetails, getTownPanchayatDetails, getRevenueVillages, getTownPanchayatVillageStreetDetails, getServiceDetails, getPanchayatDetails } from '../../services/servicelogic';
import { CreateServiceRequestDetails, getServiceRequestDetailsById, UpdateServiceRequestDetails } from '../../services/servicelogic'; 

// Make sure parseServiceIdString is defined or imported if needed here, 
// but it's more likely used in ServiceRequestList.
// If your serviceId prop is already just the ID, no parsing needed here.

const ServiceRequestForm = ({ onClose, onSaved, isEditMode, recordId, serviceId, userData }) => {
    // Initial state for form data
    const [formData, setFormData] = useState({
        service_detail_id: serviceId || '', // Use prop serviceId for new records
        district_id: '1', // Default as '1'
        block_id: '',
        town_panchayat_id: '1',
        panchayat_id: '',
        ward_number: '1',
        village_name: 'vnamedetails', // Default village name
        address_line1: '',
        street_name: 'stttreet', // Default street name
        job_num: '',
        shop_num: '',
        ref_number: '',
        document_attachment: null, // File inputs are special
        first_name: '',
        last_name: '',
        registered_mobile: '',
        contact_mobile: '',
        email_id: '',
        amount: '0.00', // Initialize as string '0.00'
    });

    // States for dropdown options and selections
    const [serviceDetails, setServiceDetails] = useState([]);   
    const [blocks, setBlocks] = useState([]);
    const [townPanchayats, setTownPanchayats] = useState([]);
    const [panchayats, setPanchayats] = useState([]);
    const [townPanchayatVillages, setTownPanchayatVillages] = useState([]); // Assuming this holds street names or similar

    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [selectedBlockTownId, setSelectedBlockTownId] = useState('none'); // '1' for Town, '2' for Panchayat, '3' for Other
    const [selectedDistrictId, setSelectedDistrictId] = useState('1'); // Matches formData.district_id
    const [selectedBlockId, setSelectedBlockId] = useState('');
    const [selectedTownPanchayatId, setSelectedTownPanchayatId] = useState('');
    const [selectedPanchayatId, setSelectedPanchayatId] = useState('');
    const [selectedTownPanchayatVillageId, setSelectedTownPanchayatVillageId] = useState(''); // For the nested dropdown

      // States for *filtered* options (what actually renders in the dropdowns)
    const [filteredBlocks, setFilteredBlocks] = useState([]);
    const [filteredPanchayats, setFilteredPanchayats] = useState([]);
    const [filteredTownPanchayats, setFilteredTownPanchayats] = useState([]);
    const [filteredTownPanchayatVillages, setFilteredTownPanchayatVillages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [filePreview, setFilePreview] = useState(null); // To display current document attachment URL

    const token = userData?.token; // Get token from props or context

    // --- Effects for fetching dropdown data ---
    // Fetch Master Services (used for service details)
    useEffect(() => {
        const fetchServiceDetailsData = async () => {
            if (!token) return;
            try {
                const selectedServiceDetails = await getServiceDetails(token, serviceId);
                setServiceDetails(selectedServiceDetails)
                // If in edit mode, and serviceId is pre-set, you might need to find the correct master service.
            } catch (error) {
                console.error('Error fetching master services:', error);
            }
        };
        fetchServiceDetailsData();
    }, [token]);

    // // Fetch Service Details based on selectedMasterService (if you have one) or overall
    // useEffect(() => {
    //     const fetchServiceDetailsData = async () => {
    //         if (!token) return;
    //         try {
    //             // Assuming getServiceDetails fetches all details for dropdown, not by ID
    //             const data = await getServiceDetails(token, serviceId);
    //             setServiceDetails(data);
    //         } catch (error) {
    //             console.error('Error fetching service details:', error);
    //         }
    //     };
    //     fetchServiceDetailsData();
    // }, [token]);

    // Fetch Blocks based on selectedDistrictId
    useEffect(() => {
        const fetchBlocksData = async () => {
            if (!token || !selectedDistrictId || selectedDistrictId === 'none') {
                setBlocks([]);
                return;
            }
            try {
                const data = await getBlockDetails(token, selectedDistrictId);
                setBlocks(data);
            } catch (error) {
                console.error('Error fetching blocks:', error);
                setBlocks([]);
            }
        };
        fetchBlocksData();
    }, [token, selectedDistrictId]);

    // Fetch Town Panchayats (based on district or block, adjust API call as needed)
    useEffect(() => {
        const fetchTownPanchayatsData = async () => {
            if (!token || !selectedDistrictId || selectedDistrictId === 'none') { // Adjust dependency if town panchayats depend on block
                setTownPanchayats([]);
                return;
            }
            try {
                // Assuming getMasterService also has town panchayats, or a dedicated API call
                // For example: await getTownPanchayats(token, selectedDistrictId);
                const data = await getTownPanchayatDetails(token); // Placeholder, adjust as per your actual API
                setTownPanchayats(data.filter(item => item.category === 'town_panchayat_type')); // Filter if getMasterService returns mixed data
            } catch (error) {
                console.error('Error fetching town panchayats:', error);
                setTownPanchayats([]);
            }
        };
        fetchTownPanchayatsData();
    }, [token, selectedDistrictId]); // Adjust dependency as per your API structure

    // Fetch Panchayats (based on district or block)
    useEffect(() => {
        const fetchPanchayatsData = async () => {
            if (!token || !selectedDistrictId || selectedDistrictId === 'none') {
                setPanchayats([]);
                return;
            }
            try {
                // Assuming getMasterService also has panchayats, or a dedicated API call
                const data = await getPanchayatDetails(token); // Placeholder
                //setPanchayats(data.filter(item => item.blockDetails === 8)); // Filter if needed
                setPanchayats(data); 
            } catch (error) {
                console.error('Error fetching panchayats:', error);
                setPanchayats([]);
            }
        };
        fetchPanchayatsData();
    }, [token, selectedDistrictId]);

    // Fetch Town Panchayat Villages (likely streets/areas under a town panchayat)
    useEffect(() => {
        const fetchTownPanchayatVillagesData = async () => { 
            if (!token)  
              //|| !selectedPanchayatId || selectedPanchayatId === 'none' && !selectedTownPanchayatId || selectedTownPanchayatId === 'none') 
              {
                setTownPanchayatVillages([]);
                return;
            }
            try { 
                // Assuming getTownPanchayatVillages fetches these based on town_panchayat_id
                const data = await getTownPanchayatVillageStreetDetails(token);
                setTownPanchayatVillages(data);
            } catch (error) {
                console.error('Error fetching town panchayat villages:', error);
                setTownPanchayatVillages([]);
            }
        };
        fetchTownPanchayatVillagesData();
    }, [token, selectedTownPanchayatId]);


    // --- Effect for pre-filling form data in EDIT MODE ---
    useEffect(() => {
        const fetchRecordForEdit = async () => {
          console.log(isEditMode + 'record id ' + recordId  + ' token ' + token)
            if (isEditMode && recordId && token) {
                setLoading(true);
                try {
                    var data = await getServiceRequestDetailsById(recordId, token);
                    const record = data[0];
                    console.log("Fetched record for edit:", record); // Debugging
                    record.town_panchayat_id = '';//temp
                    // Set formData with fetched record values, providing fallbacks
                    setFormData({
                        id:recordId,
                        service_detail_id: record.service_id || '',
                        //district_id: record.district_id ? String(record.district_id) : '1', // Ensure string
                        block_id: record.block_id ? String(record.block_id) : '',
                        town_panchayat_id: record.town_panchayat_id ? String(record.town_panchayat_id) : '',
                        panchayat_id: record.panchayat_id ? String(record.panchayat_id) : '',
                        village_street_id: record.village_street_id ? String(record.village_street_id) : '',
                        village_name: record.village_name || '',
                        ward_number: record.ward_number || '',
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
                    setSelectedServiceId(record.service_id ? String(record.service_id) : '1');
                    //setSelectedDistrictId(record.district_id ? String(record.district_id) : '1');
                    setSelectedBlockId(record.block_id ? String(record.block_id) : '2');

                    // Determine selectedBlockTownId and nested dropdowns
                    console.log('record.town_panchayat_id', record.town_panchayat_id)
                    console.log('record.panchayat_id', record.panchayat_id)
                    
                    if (record.town_panchayat_id) {
                        setSelectedBlockTownId('2'); // Corresponds to "பேரூராட்சி"
                        
                        // After townPanchayatVillages are loaded by its useEffect, find matching village
                        // This might require a small delay or a separate effect if townPanchayatVillages isn't immediately available
                        if (record.village_street_id) {
                            // This might need to run after townPanchayatVillages are fetched and available
                            // For simplicity, directly try to find it. In a complex form, you might use a ref or an additional useEffect.
                             setTimeout(() => { // Small delay to allow townPanchayatVillages to populate
                                const matchingVillage = filteredTownPanchayatVillages.find(v => v.id === record.village_street_id);
                                if (matchingVillage) {
                                    setSelectedTownPanchayatVillageId(String(matchingVillage.id));
                                }
                            }, 100); // Adjust delay if needed
                        }
                        setSelectedTownPanchayatId(String(record.town_panchayat_id));

                        setFilteredTownPanchayatVillages(townPanchayatVillages.filter(p => String(p.town_panchayat_id) === String(selectedTownPanchayatId)));
                        if (record.village_street_id) {
                            setTimeout(() => { // Small delay
                                const matchingVillage = filteredTownPanchayatVillages.find(v => v.id === record.village_street_id);
                                if (matchingVillage) {
                                    setSelectedTownPanchayatVillageId(String(matchingVillage.id));
                                }
                            }, 100);
                        }
                    } else if (record.panchayat_id) { 
                        setSelectedBlockTownId('1'); // Corresponds to "ஊராட்சி"
                        
                        setFilteredPanchayats(panchayats.filter(p => String(p.blockDetails) === String(selectedBlockId)));
                        if (record.village_street_id) {
                            setTimeout(() => { // Small delay
                                const matchingVillage = filteredPanchayats.find(v => v.id === record.panchayat_id);
                                if (matchingVillage) {
                                    setSelectedTownPanchayatVillageId(String(matchingVillage.id));
                                }
                            }, 100);
                        }

                        setFilteredTownPanchayatVillages(townPanchayatVillages.filter(p => String(p.village_panchayat_id) === String(selectedPanchayatId)));
                        if (record.village_street_id) {
                            setTimeout(() => { // Small delay
                                const matchingVillage = filteredTownPanchayatVillages.find(v => v.id === record.village_street_id);
                                if (matchingVillage) {
                                    setSelectedTownPanchayatVillageId(String(matchingVillage.id));
                                }
                            }, 100);
                        }
                        setSelectedPanchayatId(record.panchayat_id ? String(record.panchayat_id) : '');
                        setSelectedTownPanchayatVillageId(record.village_street_id ? String(record.village_street_id) : '')

                    } else if (!record.town_panchayat_id && !record.panchayat_id && !record.revenue_village_id) {
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
            } else if (!isEditMode) {
                // Reset form when not in edit mode (for new entries)
                setFormData({
                    service_detail_id: serviceId || '',
                    district_id: '1',
                    block_id: '',
                    town_panchayat_id: '',
                    panchayat_id: '',
                    ward_number: '',
                    village_name: '',
                    address_line1: '',
                    street_name: '',
                    job_num: '',
                    shop_num: '',
                    ref_number: '',
                    document_attachment: null,
                    first_name: '',
                    last_name: '',
                    registered_mobile: '',
                    contact_mobile: '',
                    email_id: '',
                    amount: '0.00',
                    status: 'pending',
                    created_by: userData?.email,
                    created_date: new Date().toDateString(),
                    updated_by: userData?.email,
                    updated_date: new Date().toDateString()
                });
                setSelectedServiceId(serviceId || '');
                setSelectedDistrictId('1');
                setSelectedBlockTownId('none');
                setSelectedBlockId('');
                setSelectedTownPanchayatId('');
                setSelectedPanchayatId('');
                setSelectedTownPanchayatVillageId('');
                setFilePreview(null);
            }
        };

        fetchRecordForEdit();
    }, [isEditMode, recordId, token, serviceId, townPanchayatVillages]); // Added townPanchayatVillages as dependency for street_name prefill

    // --- General Change Handler for all text/select inputs ---
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            setFilePreview(file ? URL.createObjectURL(file) : null); // Create URL for preview
        } else {
            // Also update specific dropdown states if they are tied to form data fields
            if (name === 'service_detail_id') setSelectedServiceId(value);
            if (name === 'district_id') setSelectedDistrictId(value);
            if (name === 'block_id')
            {
               setSelectedBlockId(value);
               // Filter panchayats and revenue villages based on the selected block
                if (value) {
                    setFilteredPanchayats(panchayats.filter(p => String(p.blockDetails) === String(value)));
                } else {
                    setFilteredPanchayats([]);
                }
                // Reset dependent dropdowns
                setFilteredTownPanchayatVillages([]);  

                // setFormData(prev => ({
                //     ...prev,
                //     panchayat_id: '',
                //     revenue_village_id: '',
                //     street_name: '',
                //     village_name: ''
                // }));
            }  
            else if (name === 'town_panchayat_id') 
            {
              setSelectedTownPanchayatId(value);
            
               setSelectedPanchayatId(value);
               if (value) {
                    setFilteredTownPanchayatVillages(townPanchayatVillages.filter(rv => String(rv.town_panchayat_id) === String(value)));
                } else {
                    setFilteredTownPanchayatVillages([]);
                }
            }
            else if (name === 'panchayat_id') 
            {
              setSelectedPanchayatId(value);
               if (value) {
                    setFilteredTownPanchayatVillages(townPanchayatVillages.filter(rv => String(rv.village_panchayat_id) === String(value)));
                } else {
                    setFilteredTownPanchayatVillages([]);
                }
            }
            else if (name === 'village_street_id') 
            {
              
              setSelectedTownPanchayatVillageId(value); // Assuming this is also a form field
            }
            
              setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // --- Specific Dropdown Change Handlers (if needed for cascading logic) ---
    const handleBlockTownChange = (e) => {
        const value = e.target.value;
        setSelectedBlockTownId(value);
        // Reset related dropdowns when this changes
        setSelectedBlockId('');
        setSelectedTownPanchayatId('');
        setSelectedPanchayatId('');
        setSelectedTownPanchayatVillageId(''); // Reset this too
        setFormData(prev => ({
            ...prev,
            block_id: '',
            town_panchayat_id: '1',
            panchayat_id: '',
            revenue_village_id: '1',
            village_name: 'vname', // Reset village_name as it might depend on these
            street_name: 'ssstr', // Reset street_name
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);

        try {
            const submitData = new FormData();
            // --- IMPORTANT: APPEND ALL YOUR DATA TO submitData HERE ---
        // This is where you actually add key-value pairs to your FormData object

        // Example: Iterate over your formData state and append
        for (const key in formData) {
            // Ensure you only append relevant fields and handle files specifically
            if (key !== 'document_attachment' && formData[key] !== null && formData[key] !== undefined) {
                submitData.append(key, formData[key]);
            }
        }
        submitData.append('street_name', 'Hardcoded Street Name');
        // Handle the file attachment specifically
        if (formData.document_attachment instanceof File) {
            submitData.append('document_attachment', formData.document_attachment, formData.document_attachment.name);
        } else if (isEditMode && filePreview === null && recordId) {
            // Optional: Logic to tell backend to clear an existing file if it was removed
            // This depends on your backend's API design (e.g., submitData.append('document_attachment', ''))
        }

        // For new records, ensure service_id is explicitly set if needed by API
        // if (!isEditMode && serviceId) {
        //     submitData.append('service_id', serviceId);
        // }
        // If service_detail_id is already in formData and being appended above, this might not be necessary.
        // Check your API's requirement for 'service_id' vs 'service_detail_id'


        // --- NOW, ADD THE DEBUGGING LOG AFTER POPULATING FormData ---
        console.log("FormData contents before sending:");
        for (const pair of submitData.entries()) {
          console.log('test data pair ', pair);
            console.log('test data ', pair[0]+ ': ' + pair[1]);
        }
        /// --- END DEBUGGING LOG ---

            // For new records, ensure service_id is explicitly set
            if (!isEditMode && serviceId) {
                submitData.append('service_id', serviceId);
            }

            if (isEditMode && recordId) {
              console.log('token ', token)
                await UpdateServiceRequestDetails(recordId, submitData, token);
                alert("Record updated successfully!");
            } else {
                await CreateServiceRequestDetails(submitData, token);
                alert("Record created successfully!");
            }
            onSaved(); // Notify parent to close modal and refresh list
        } catch (error) {
            console.error('Error saving request:', error);
            const errorMessage = error.message || 'Unknown error occurred. Please check console for details.';
            setFormError(`Failed to save record: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            {loading && <div className="text-center py-2">Loading form data...</div>}
            {formError && <div className="alert alert-danger">{formError}</div>}

            <div className="row g-3">
                {/* Service Detail ID */}
                <div className="col-12 col-md-4">
                    <label htmlFor="service_detail_id" className="form-label">சேவை வகை</label>
                    <select
                        id="service_detail_id"
                        name="service_detail_id"
                        className="form-select"
                        value={selectedServiceId} // HIGHLIGHT: Bind value to state
                        onChange={handleChange} // HIGHLIGHT: Bind onChange to handler
                        required
                    >
                        <option value="">சேவையைத் தேர்ந்தெடுக்கவும்</option>
                        {serviceDetails.map(service => (
                            <option key={service.service_details_id} value={service.service_details_id}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-md-4">
                    <label htmlFor="job_num" className="form-label">வேலைகள்</label>
                    <input
                        type="text"
                        id="job_num"
                        name="job_num"
                        className="form-control"
                        value={formData.job_num} // HIGHLIGHT: Bind value
                        onChange={handleChange} // HIGHLIGHT: Bind onChange
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="shop_num" className="form-label">கடை எண்</label>
                    <input
                        type="text"
                        id="shop_num"
                        name="shop_num"
                        className="form-control"
                        value={formData.shop_num} // HIGHLIGHT: Bind value
                        onChange={handleChange} // HIGHLIGHT: Bind onChange
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="ref_number" className="form-label">குறிப்பு எண்</label>
                    <input
                        type="text"
                        id="ref_number"
                        name="ref_number"
                        className="form-control"
                        value={formData.ref_number} // HIGHLIGHT: Bind value
                        onChange={handleChange} // HIGHLIGHT: Bind onChange
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="amount" className="form-label">தொகை</label>
                    <input
                        type="number" // Use type="number" for amount, but ensure value is string
                        id="amount"
                        name="amount"
                        className="form-control"
                        value={formData.amount} // HIGHLIGHT: Bind value (it's already a string from setFormData)
                        onChange={handleChange} // HIGHLIGHT: Bind onChange
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="first_name" className="form-label">பயனாளி பெயர்</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        className="form-control"
                        value={formData.first_name} // HIGHLIGHT: Bind value
                        onChange={handleChange} // HIGHLIGHT: Bind onChange
                        required
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="last_name" className="form-label">கடைசிப் பெயர்</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        className="form-control"
                        value={formData.last_name} // HIGHLIGHT: Bind value
                        onChange={handleChange} // HIGHLIGHT: Bind onChange
                    />
                </div>

                {/* District Selection */}
                {/* Block/Town/Other Selection */}
                <div className="col-12 col-md-4">
                    <label htmlFor="block_town_type" className="form-label">அரசுப் பிரிவு</label>
                    <select
                        id="block_town_type"
                        className="form-select"
                        value={selectedBlockTownId} // HIGHLIGHT: Bind value
                        onChange={handleBlockTownChange} // HIGHLIGHT: Use specific handler
                    >
                        <option value="none">பிரிவைத் தேர்ந்தெடுக்கவும்</option>
                        <option value="1">ஒன்றியம்</option> {/* Town Panchayat */}
                        <option value="2">பேரூராட்சி</option>    {/* Panchayat */}
                        <option value="3">இதர</option>      {/* Other (Direct Street Name) */}
                    </select>
                </div>

                {/* Conditional Rendering for Block/Town/Panchayat/Revenue Village */}
                {selectedBlockTownId === '1' && ( // "ஒன்றியம்"
                    <>
                        <div className="col-12 col-md-4">
                            <label htmlFor="block_id" className="form-label">ஒன்றியம்</label>
                            <select
                                id="block_id"
                                name="block_id"
                                className="form-select"
                                value={selectedBlockId} // HIGHLIGHT: Bind value
                                onChange={handleChange} // HIGHLIGHT: Bind onChange
                                required
                            >
                                <option value="">ஒன்றியத்தைத் தேர்ந்தெடுக்கவும்</option>
                                {blocks.map(block => (
                                    <option key={block.id} value={block.block_id}>{block.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 col-md-4">
                            <label htmlFor="panchayat_id" className="form-label">ஊராட்சி</label>
                            <select
                                id="panchayat_id"
                                name="panchayat_id"
                                className="form-select"
                                value={selectedPanchayatId} // HIGHLIGHT: Bind value
                                onChange={handleChange} // HIGHLIGHT: Bind onChange
                                required
                            >
                                <option value="">ஊராட்சியைக் தேர்ந்தெடுக்கவும்</option>
                                {filteredPanchayats.map(panchayat => (
                                    <option key={panchayat.id} value={panchayat.id}>{panchayat.name}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {selectedBlockTownId === '2' && ( // "பேரூராட்சி"
                    <div className="col-12 col-md-4">
                        <label htmlFor="town_panchayat_id" className="form-label">பேரூராட்சி</label>
                        <select
                            id="town_panchayat_id"
                            name="town_panchayat_id"
                            className="form-select"
                            value={selectedTownPanchayatId} // HIGHLIGHT: Bind value
                            onChange={handleChange} // HIGHLIGHT: Bind onChange
                            required
                        >
                            <option value="">பேரூராட்சியைக் தேர்ந்தெடுக்கவும்</option>
                            {townPanchayats.map(tp => (
                                <option key={tp.id} value={tp.id}>{tp.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                {/* village_steet_id / street_name */}
                {(selectedBlockTownId === '1' || selectedBlockTownId === '2') && (
                    <div className="col-12 col-md-4">
                        <label htmlFor="village_street_id" className="form-label">தெரு பெயர் / கிராமம்</label>
                        <select
                            id="village_street_id"
                            name="village_street_id" // Use this name for your formData
                            className="form-select"
                            value={selectedTownPanchayatVillageId} // HIGHLIGHT: Bind value
                            onChange={handleChange} // HIGHLIGHT: Bind onChange
                        >
                            <option value="">தெரு/கிராமத்தைத் தேர்ந்தெடுக்கவும்</option>
                            {filteredTownPanchayatVillages.map(tpv => (
                                <option key={tpv.id} value={tpv.id}>{tpv.village_street_name}</option>
                            ))}
                        </select>
                    </div>
                )}
                {/* Common fields for all types */}
                <div className="col-12 col-md-4">
                    <label htmlFor="ward_number" className="form-label">வார்டு எண்</label>
                    <input
                        type="text"
                        id="ward_number"
                        name="ward_number"
                        className="form-control"
                        value={formData.ward_number} // HIGHLIGHT: Bind value
                        onChange={handleChange} // HIGHLIGHT: Bind onChange
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="address_line1" className="form-label">முகவரி வரி 1</label>
                    <input
                        type="text"
                        id="address_line1"
                        name="address_line1"
                        className="form-control"
                        value={formData.address_line1} // HIGHLIGHT: Bind value
                        onChange={handleChange} // HIGHLIGHT: Bind onChange
                        required
                    />
                </div>
                
                {selectedBlockTownId === '3' && ( // "இதர" (direct street name input)
                    <div className="col-12 col-md-4">
                        <label htmlFor="street_name" className="form-label">தெரு பெயர் (இதர)</label>
                        <input
                            type="text"
                            id="street_name"
                            name="street_name"
                            className="form-control"
                            value={formData.street_name} // HIGHLIGHT: Bind value
                            onChange={handleChange} // HIGHLIGHT: Bind onChange
                        />
                    </div>
                )}


                <div className="col-12 col-md-4">
                    <label htmlFor="registered_mobile" className="form-label">பதிவு செய்யப்பட்ட கைபேசி</label>
                    <input
                        type="text" // Use text for phone numbers
                        id="registered_mobile"
                        name="registered_mobile"
                        className="form-control"
                        value={formData.registered_mobile} // HIGHLIGHT: Bind value
                        onChange={handleChange} // HIGHLIGHT: Bind onChange
                        required
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="contact_mobile" className="form-label">தொடர்பு எண்</label>
                    <input
                        type="text"
                        id="contact_mobile"
                        name="contact_mobile"
                        className="form-control"
                        value={formData.contact_mobile} // HIGHLIGHT: Bind value
                        onChange={handleChange} // HIGHLIGHT: Bind onChange
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="email_id" className="form-label">பயனாளியின் மின்னஞ்சல்</label>
                    <input
                        type="email"
                        id="email_id"
                        name="email_id"
                        className="form-control"
                        value={formData.email_id} // HIGHLIGHT: Bind value
                        onChange={handleChange} // HIGHLIGHT: Bind onChange
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="document_attachment" className="form-label">சான்றிதழை பதிவேற்று</label>
                    <input
                        type="file"
                        id="document_attachment"
                        name="document_attachment"
                        className="form-control"
                        onChange={handleChange} // HIGHLIGHT: Bind onChange
                        // Value prop for file inputs should generally not be set
                    />
                    {filePreview && (
                        <div className="mt-2">
                            <p>Current Document:</p>
                            {/* Check if it's a URL or an object URL for preview */}
                            {typeof filePreview === 'string' && (
                                <a href={filePreview} target="_blank" rel="noopener noreferrer">
                                    View Current Document
                                </a>
                            )}
                             {/* Optionally add a button to clear the file input */}
                             {isEditMode && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger ms-2"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, document_attachment: null }));
                                        setFilePreview(null);
                                        // Clear the file input element itself
                                        const fileInput = document.getElementById('document_attachment');
                                        if (fileInput) fileInput.value = '';
                                    }}
                                >
                                    Clear File
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (isEditMode ? 'Update Record' : 'Create Record')}
                </button>
            </div>
        </form>
    );
};

export default ServiceRequestForm;