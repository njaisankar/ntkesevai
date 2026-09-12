import React, { useState, useEffect, useContext} from 'react';
import { getBlockDetails, getTownPanchayatDetails, getTownPanchayatVillageStreetDetails, getServiceDetails, getPanchayatDetails } from '../../services/servicelogic';
import { CreateServiceRequestDetails, getServiceRequestDetailsById, UpdateServiceRequestDetails } from '../../services/servicelogic'; 
import {  MessagePopupContext } from '../../contexts/MessagePopupContext'; 
// Make sure parseServiceIdString is defined or imported if needed here, 
// but it's more likely used in ServiceRequestList.
// If your serviceId prop is already just the ID, no parsing needed here.

const ServiceRequestForm = ({ onClose, onSaved, isEditMode, recordId, serviceId, userData }) => {
    // Initial state for form data
    const [formData, setFormData] = useState({
        service_id: serviceId || '', // Use prop serviceId for new records
        service_details_id: '',
        district_id: '1', // Default as '1'
        district:'1',
        block_id: '',
        block:'',
        town_panchayat_id: '',
        panchayat_id: '',
        ward_number: '',
        //village_name: '', // Default village name
        address_line1: '',
        street_name: '',
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

    const selectedAssemblyContituencyId = 91;
    // States for dropdown options and selections
    const [serviceDetails, setServiceDetails] = useState([]);   
    const [blocks, setBlocks] = useState([]);
    const [townPanchayats, setTownPanchayats] = useState([]);
    const [panchayats, setPanchayats] = useState([]);
    const [townPanchayatVillages, setTownPanchayatVillages] = useState([]); // Assuming this holds street names or similar
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [selectedServiceDetailsId, setSelectedServiceDetailsId] = useState('');
    const [selectedBlockTownId, setSelectedBlockTownId] = useState('none'); // '1' for Town, '2' for Panchayat, '3' for Other
    const [selectedDistrictId, setSelectedDistrictId] = useState('1'); // Matches formData.district_id
    const [selectedBlockId, setSelectedBlockId] = useState('');
    const [selectedTownPanchayatId, setSelectedTownPanchayatId] = useState('');
    const [selectedPanchayatId, setSelectedPanchayatId] = useState('');
    const [selectedTownPanchayatVillageId, setSelectedTownPanchayatVillageId] = useState(''); // For the nested dropdown

      // States for *filtered* options (what actually renders in the dropdowns)
    const [filteredPanchayats, setFilteredPanchayats] = useState([]);
    const [filteredTownPanchayats, setFilteredTownPanchayats] = useState([]);
    const [filteredTownPanchayatVillages, setFilteredTownPanchayatVillages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [filePreview, setFilePreview] = useState(null); // To display current document attachment URL
    const [canUserApprove, setCanUserApprove] = useState(false);

    const token = userData?.token; // Get token from props or context
    const { showMessage } = useContext(MessagePopupContext);
    // --- Effects for fetching dropdown data ---
    // Fetch Master Services (used for service details)
    useEffect(() => {
        const fetchServiceDetailsData = async () => {
            if (!token || !serviceId) return; // Wait for token
            try {
                const response = await getServiceDetails(token, serviceId);
                console.log('fetchServiceDetailsData method called ==> Service Id ',serviceId)
                console.log('Service details for =>', serviceId, ' =>', response.data)
                setServiceDetails(response.data)
                // If in edit mode, and serviceId is pre-set, you might need to find the correct master service.
            } catch (error) {
                console.error('Error fetching master services:', error);
                setServiceDetails([]);
            }
        };
        fetchServiceDetailsData();
    }, [token, serviceId]);

    // Fetch Blocks based on selectedDistrictId
    useEffect(() => {
        const fetchBlocksData = async () => {
            if (!token || !selectedDistrictId || selectedDistrictId === 'none') {
                setBlocks([]);
                return;
            }
            try {
                const response = await getBlockDetails(token, selectedDistrictId);
                setBlocks(response.data);
                console.log('block details fetch method called...')
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
                const response = await getTownPanchayatDetails(token, selectedDistrictId); // Placeholder, adjust as per your actual API
                //setTownPanchayats(response.data.filter(item => item.category === 'town_panchayat_type')); // Filter if getMasterService returns mixed data
                setTownPanchayats(response.data); // Filter if getMasterService returns mixed data

                console.log('town panchayat details fetch method called...', response.data)
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
                const response = await getPanchayatDetails(token); // Placeholder
                //setPanchayats(data.filter(item => item.blockDetails === 8)); // Filter if needed
                setPanchayats(response.data);
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
                const response = await getTownPanchayatVillageStreetDetails(token);
                setTownPanchayatVillages(response.data);
            } catch (error) {
                console.error('Error fetching town panchayat villages:', error);
                setTownPanchayatVillages([]);
            }
        };
        fetchTownPanchayatVillagesData();
    }, [token]);

    //Filter Town Panchayats based on Block ID
    useEffect(() => {
        // Check for the source data AND the ID needed for filtering
        if (selectedBlockId && townPanchayats.length > 0) {console.log('new filter user effets for town panchayat', selectedBlockId)
            setFilteredTownPanchayats(townPanchayats.filter(p =>
                String(p.blockDetails) === String(selectedBlockId)
            ));
        } else {
            setFilteredTownPanchayats([]);
        }
    }, [selectedBlockId, townPanchayats]); // Only runs when Block ID changes or source data arrives

    //Filter Panchayat based on selected Block
    useEffect(() => {
        if (selectedBlockId && panchayats.length > 0) {
        console.log('Filter Panchayat based on selected Block =>', selectedBlockId)
            setFilteredPanchayats(panchayats.filter(rv =>
                String(rv.blockDetails) === String(selectedBlockId)
            ));
        } else {
            setFilteredPanchayats([]);
        }
    }, [selectedBlockId, panchayats]);

    //Filter Town or Panchayat Villages based on Town Panchayat ID or Panchayat ID
    useEffect(() => {
        if ((selectedTownPanchayatId || selectedPanchayatId) && townPanchayatVillages.length > 0) {
            console.log('Filter Town or Panchayat Villages based on Town Panchayat ID =>', selectedTownPanchayatId, ' Panchayat Id =>', selectedPanchayatId, townPanchayatVillages)
            setFilteredTownPanchayatVillages(townPanchayatVillages.filter(rv =>
                String(rv.town_panchayat_id) === String(selectedTownPanchayatId) || String(rv.village_panchayat_id) === String(selectedPanchayatId)
            ));
        } else {
            setFilteredTownPanchayatVillages([]);
        }
    }, [selectedTownPanchayatId, selectedPanchayatId, townPanchayatVillages]);

    //Effect for pre-filling form data in EDIT MODE
    useEffect(() => {
        const fetchRecordForEdit = async () => {
        if (isEditMode && recordId && token) {
            setLoading(true);
            console.log('Selected service id', selectedServiceId)
            try {
                 let url = `?page=${1}&page_size=${1}`;
                var response = await getServiceRequestDetailsById(recordId, url, token);
                const record = response.data.results[0];
                const isUserAllowedToApprove = userData.isApprover || userData?.isSuperUser;
                console.log('User allowed to approve? ', isUserAllowedToApprove)
                setCanUserApprove(isUserAllowedToApprove);
                // Set formData with fetched record values, providing fallbacks
                console.log('record.district.district_id ? String(record.district_id)', record.district.district_id, String(record.district_id))

                console.log('record.town_panchayat', record.town_panchayat)
                setFormData({
                    id:recordId,
                    service_id: record.service_details.service_id || selectedServiceId,
                    service_details_id: record.service_details.service_details_id || 1,
                    district_id: 1,
                    block_id: record.block.block_id ? String(record.block.block_id) : '',
                    town_panchayat_id: record.town_panchayat?.town_panchayat_id ? String(record.town_panchayat?.town_panchayat_id) : '',
                    panchayat_id: record.panchayat?.panchayat_id ? String(record.panchayat?.panchayat_id) : '',
                    village_street_id: record.village_street?.id ? String(record.village_street?.id) : '',
                    //village_name: record.village_name || '',
                    ward_number: record.ward_number || '',
                    address_line1: record.address_line1 || '',
                    street_name: record.street_name || 'இதர',
                    shop_num: record.shop_num || '',
                    ref_number: record.ref_number || '',
                    document_attachment: null, // File inputs cannot be pre-filled for security
                    first_name: record.first_name || '',
                    last_name: record.last_name || '',
                    registered_mobile: record.registered_mobile || '',
                    contact_mobile: record.contact_mobile || '',
                    email_id: record.email_id || '',
                    amount: record.amount.substring(1), //remove currency symbol
                    status : record.status
                });

                // Set state variables for dropdowns to trigger dependent fetches and selections
                setSelectedServiceId(record.service_id > 0 ? record.service_id : selectedServiceId);
                setSelectedServiceDetailsId(record.service_details.service_details_id > 0 ? record.service_details.service_details_id : selectedServiceDetailsId);
                setSelectedDistrictId(record.district_id ? String(record.district_id) : '1');
                setSelectedBlockId(record.block.block_id);

                if (record.town_panchayat?.town_panchayat_id)
                {
                    setSelectedBlockTownId('2'); // Corresponds to "பேரூராட்சி"
                    setSelectedTownPanchayatId(record.town_panchayat?.town_panchayat_id);
                    setSelectedTownPanchayatVillageId(record.village_street?.id);
                } else if (record.panchayat?.id) {
                    setSelectedBlockTownId('1'); // Corresponds to "ஊராட்சி"
                    setSelectedPanchayatId(record.panchayat?.id);
                    setSelectedTownPanchayatVillageId(record.village_street?.id);
                } else if (!record.town_panchayat?.town_panchayat_id && !record.panchayat?.panchayat_id && !record.revenue_village_id) {
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
                service_id: serviceId || '',
                service_details_id: '',
                district_id: '1',
                block_id: '',
                town_panchayat_id: '',
                panchayat_id: '',
                ward_number: '',
                //village_name: '',
                address_line1: '',
                street_name: '',
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
            setSelectedServiceDetailsId('');
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
    }, [isEditMode, recordId, token, serviceId, userData.isApprover, userData.id]); // Added townPanchayatVillages as dependency for street_name prefill

    // --- General Change Handler for all text/select inputs ---
    const handleChange = (e) => {
    console.log('handleChange method is called ==>',e)
        e.preventDefault();
        const { name, value, type, files, maxLength } = e.target;
        const finalValue = maxLength > 0 ? value.slice(0, maxLength) : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));

        if (type === 'file') {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            setFilePreview(file ? URL.createObjectURL(file) : null); // Create URL for preview
        } else {
            // Also update specific dropdown states if they are tied to form data fields
            //if (name === 'service_id') setSelectedServiceId(value);
            if (name === 'service_details_id')
            {
                setSelectedServiceDetailsId(value);
            }

            if (name === 'block_id')
            {
               setSelectedBlockId(value);
               // Filter panchayats and revenue villages based on the selected block
                if (value) {
                    setFilteredPanchayats(panchayats.filter(p => String(p.blockDetails) === String(value)));
                    setFilteredTownPanchayats(townPanchayats.filter(p => String(p.blockDetails) === String(value)));
                } else {
                    setFilteredPanchayats([]);
                }
                // Reset dependent dropdowns
                setFilteredTownPanchayatVillages([]);
            }

            if (name === 'town_panchayat_id')
            {
              setSelectedTownPanchayatId(value);
              setFilteredTownPanchayatVillages([]);
               if (value) {
                    setFilteredTownPanchayatVillages(townPanchayatVillages.filter(rv => String(rv.town_panchayat_id) === String(value)));
                } else {
                    setFilteredTownPanchayatVillages([]);
                }
               //setFormData(prev => ({...prev,town_panchayat_id: value}));
            }

            if (name === 'panchayat_id')
            {
                setSelectedPanchayatId(value);
                if (value) {
                console.log(name ,    ' ====', value)
                    setFilteredTownPanchayatVillages(townPanchayatVillages.filter(rv => String(rv.village_panchayat_id) === String(value)));
                } else {
                    setFilteredTownPanchayatVillages([]);
                }
                //setFormData(prev => ({...prev,panchayat_id: value}));
            }

            if (name === 'village_street_id')
            {
              setSelectedTownPanchayatVillageId(value); // Assuming this is also a form field
            }

            if(name === 'amount') {
                // Use a regular expression to allow only numbers and a single decimal point
                const validValue = value.replace(/[^0-9.]/g, '');
                const parts = validValue.split('.');

                // Ensure only one decimal point is present
                if (parts.length > 2) {
                    var formatedValue = (`${parts[0]}.${parts.slice(1).join('')}`);
                    setFormData(prev => ({ ...prev, amount: formatedValue }));
                } else {
                    setFormData(prev => ({ ...prev, amount: validValue }));
                }
            }
        }
    };

    // Formats the value when the user tabs out or clicks away
    const handleBlur = (e) => {
        let value = e.target.value;

        // Clean the value and convert to a number
        const numberValue = parseFloat(value);

        // If it's a valid number, format it to two decimal places
        if (!isNaN(numberValue)) {
            // Apply a maximum value to prevent values greater than 9999.99
            const cappedValue = Math.min(numberValue, 9999.99);
            setFormData(prev => ({
            ...prev,amount: cappedValue.toFixed(2)}));
        } else {
            // If the value is invalid (e.g., just '.'), reset to '0.00'
            setFormData(prev => ({
            ...prev,amount: '0.00'}));
        }
    };

   const handleMobileChange = (e) => {
        const { name, value } = e.target;

        // 1. Only allow digits and limit to 10 characters
        const numericValue = value.replace(/\D/g, '').slice(0, 10);

            setFormData(prev => {
                const newState = { ...prev, [name]: numericValue };

                // 2. If user is typing in 'registered_mobile',
                // copy the value to 'contact_mobile' automatically
                if (name === 'registered_mobile') {
                    newState.contact_mobile = numericValue;
                }

                return newState;
            });
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
            town_panchayat_id: '',
            panchayat_id: '',
            revenue_village_id: '',
            //village_name: '', // Reset village_name as it might depend on these
            //street_name: '', // Reset street_name
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);
        let response;
        try {
            const submitData = new FormData();
            // --- IMPORTANT: APPEND ALL YOUR DATA TO submitData HERE ---
            // This is where you actually add key-value pairs to your FormData object
            //submitData.append('district_id', selectedDistrictId);
            submitData.append('district', selectedDistrictId);
            //submitData.append('service_id', serviceId);
            submitData.append('service_details', selectedServiceDetailsId);

            // For new records, ensure service_id is explicitly set
            if (!isEditMode && serviceId) {
                submitData.append('service_details_id', selectedServiceDetailsId);
            }

            // Example: Iterate over your formData state and append
            for (const key in formData) {
                // Ensure you only append relevant fields and handle files specifically
                if (key !== 'document_attachment' && formData[key] !== null && formData[key] !== undefined) {
                    submitData.append(key, formData[key]);
                }

                console.log('test submit key => data ', key, ' --- ', formData[key])
            }

            // Handle the file attachment specifically
            if (formData.document_attachment instanceof File) {
                console.log('FILE EXISTS.....');
                submitData.append('document_attachment', formData.document_attachment, formData.document_attachment.name);
            }

            if (isEditMode && recordId) {
                console.log(' edit mode called.......')
               if(selectedBlockTownId === '1') {
                 submitData.append('block', selectedBlockId);
                 submitData.append('panchayat', selectedPanchayatId);
                 submitData.append('village_street', selectedTownPanchayatVillageId);
                }

                if(selectedBlockTownId === '2') {
                     submitData.append('block', selectedBlockId);
                     submitData.append('town_panchayat', selectedTownPanchayatId);
                     submitData.append('village_street', selectedTownPanchayatVillageId);
                }

                if(selectedBlockTownId === '3') {
                     //submitData.append('street_name', value);
                }
                console.log('FormData Contents:');
                for (var pair of submitData.entries()) {
                    console.log(pair[0]+ ': ' + pair[1]);
                }

                response =await UpdateServiceRequestDetails(recordId, submitData, token);
                if(response.success && response.status === 200) {
                    showMessage("Record updated successfully!", "success");
                }
                else {
                    showMessage(`Failed to save record: 'Unknown error'`, "error");
                }
            } else {
                response = await CreateServiceRequestDetails(submitData, token);
                if(response.success && response.status === 201) {
                    showMessage("Record created successfully!", "success");
                }
                else {
                    showMessage(`Failed to save record: 'Unknown error'`, "error");
                }
            }
            onSaved(); // Notify parent to close modal and refresh list
        } catch (error) {
            console.error('Error saving request:', error);
            const errorMessage = error.message || 'Unknown error occurred. Please check console for details.';
            setFormError(`Failed to save record: ${errorMessage}`);
            showMessage(`Failed to save record: ${errorMessage}`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (

        <form onSubmit={handleSubmit} autoComplete="off">
            {loading && <div className="text-center py-2">Loading form data...</div>}
            {formError && <div className="alert alert-danger">{formError}</div>}

            <div className="row g-3">
                {/* Service Detail ID */}
                <div className="col-12 col-md-4">
                    <label htmlFor="service_details_id" className="form-label">வேலைகள் {userData?.isCreator} {userData?.isApprover}</label>
                    <select
                        id="service_details_id"
                        name="service_details_id"
                        className="form-select"
                        value={selectedServiceDetailsId} // HIGHLIGHT: Bind value to state
                        onInput={handleChange} // HIGHLIGHT: Bind onChange to handler
                        required
                    >
                        <option value="">வேலையைத் தேர்ந்தெடுக்கவும்</option>
                        {serviceDetails.map(service => (
                            <option key={service.service_details_id} value={service.service_details_id}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-md-4">
                    <label htmlFor="shop_num" className="form-label">கடை எண்</label>
                    <input
                        type="text"
                        id="shop_num"
                        name="shop_num"
                        className="form-control"
                        value={formData.shop_num} // HIGHLIGHT: Bind value
                        onInput={handleChange} // HIGHLIGHT: Bind onChange
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
                        onInput={handleChange} // HIGHLIGHT: Bind onChange
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="amount" className="form-label">தொகை</label>
                    <input
                        type="text" // Use type="number" for amount, but ensure value is string
                        id="amount"
                        name="amount"
                        className="form-control"
                        value={formData.amount} // HIGHLIGHT: Bind value (it's already a string from setFormData)
                        onInput={handleChange} // HIGHLIGHT: Bind onChange
                        onBlur={handleBlur}
                        inputMode="decimal"
                        maxLength="7" // Provides a visual limit for the user
                        placeholder="0.00"
                        required
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="first_name" className="form-label">பயனாளி முதல் பெயர்</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        className="form-control"
                        value={formData.first_name} // HIGHLIGHT: Bind value
                        onInput={handleChange} // HIGHLIGHT: Bind onChange
                        maxLength={50}
                        required
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="last_name" className="form-label">பயனாளி கடைசிப் பெயர்</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        className="form-control"
                        value={formData.last_name} // HIGHLIGHT: Bind value
                        onInput={handleChange} // HIGHLIGHT: Bind onChange
                        maxLength={50}
                        required
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
                        onInput={handleBlockTownChange} // HIGHLIGHT: Use specific handler
                        required
                    >
                        <option selected value="">பிரிவைத் தேர்ந்தெடுக்கவும்</option>
                        <option value="1">ஒன்றியம்</option> {/* Town Panchayat */}
                        <option value="2">பேரூராட்சி</option>    {/* Panchayat */}
                         {/* <option value="3">இதர</option>      Other (Direct Street Name) */}
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
                                onInput={handleChange} // HIGHLIGHT: Bind onChange
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
                                onInput={handleChange} // HIGHLIGHT: Bind onChange
                                required
                            >
                                <option value="">ஊராட்சியைத் தேர்ந்தெடுக்கவும்</option>
                                {filteredPanchayats.map(panchayat => (
                                    <option key={panchayat.id} value={panchayat.id}>{panchayat?.name}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {selectedBlockTownId === '2' && ( // "பேரூராட்சி"
                    <>
                         <div className="col-12 col-md-4">
                                <label htmlFor="block_id" className="form-label">ஒன்றியம்</label>
                                <select
                                    id="block_id"
                                    name="block_id"
                                    className="form-select"
                                    value={selectedBlockId} // HIGHLIGHT: Bind value
                                    onInput={handleChange} // HIGHLIGHT: Bind onChange
                                    required
                                >
                                    <option value="">ஒன்றியத்தைத் தேர்ந்தெடுக்கவும்</option>
                                    {blocks.map(block => (
                                        <option key={block.id} value={block.block_id}>{block.name}</option>
                                    ))}
                                </select>
                        </div>
                        <div className="col-12 col-md-4">
                            <label htmlFor="town_panchayat_id" className="form-label">பேரூராட்சி</label>
                            <select
                                id="town_panchayat_id"
                                name="town_panchayat_id"
                                className="form-select"
                                value={selectedTownPanchayatId}
                                onInput={handleChange}
                                required
                            >
                                <option value="">பேரூராட்சியைத் தேர்ந்தெடுக்கவும்</option>
                                {filteredTownPanchayats.map(tp => (
                                    <option key={tp.town_panchayat_id} value={tp.town_panchayat_id}>{tp.name}</option>
                                ))}
                            </select>
                        </div>
                     </>
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
                            onInput={handleChange} // HIGHLIGHT: Bind onChange
                            required
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
                        type="number"
                        id="ward_number"
                        name="ward_number"
                        className="form-control"
                        value={formData.ward_number} // HIGHLIGHT: Bind value
                        onInput={handleChange} // HIGHLIGHT: Bind onChange
                        maxLength={3}
                        required
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="address_line1" className="form-label">முகவரி</label>
                    <input
                        type="text"
                        id="address_line1"
                        name="address_line1"
                        className="form-control"
                        value={formData.address_line1} // HIGHLIGHT: Bind value
                        onInput={handleChange} // HIGHLIGHT: Bind onChange
                        required
                    />
                </div>
                
                {selectedBlockTownId === '3' && ( // "இதர" (direct street name input)
                    <div className="col-12 col-md-4">
                        <label htmlFor="street_name" className="form-label">இதர தெரு பெயர்</label>
                        <input
                            type="text"
                            id="street_name"
                            name="street_name"
                            className="form-control"
                            value={formData.street_name} // HIGHLIGHT: Bind value
                            maxLength={50}
                            onInput={handleChange} // HIGHLIGHT: Bind onChange
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
                        onInput={handleMobileChange} // HIGHLIGHT: Bind onChange
                        maxLength={10}
                        inputMode="numeric"
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
                        onInput={handleMobileChange} // HIGHLIGHT: Bind onChange
                        maxLength={10}
                        inputMode="numeric"
                        required
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
                        onInput={handleChange} // HIGHLIGHT: Bind onChange
                        maxLength={50}
                        required
                    />
                </div>

                {canUserApprove && (
                <div className="col-12 col-md-4">
                    <label htmlFor="status-select">சேவை நிலை:</label>
                    <select
                        id="status"
                        name="status"
                        className="form-select"
                        value={formData.status || "Pending"}
                        onChange={handleChange}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                )}

                <div className="col-12 col-md-4">
                    <label htmlFor="document_attachment" className="form-label">சான்றிதழை பதிவேற்று</label>
                    <input
                        type="file"
                        id="document_attachment"
                        name="document_attachment"
                        className="form-control"
                        onInput={handleChange} // HIGHLIGHT: Bind onChange
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