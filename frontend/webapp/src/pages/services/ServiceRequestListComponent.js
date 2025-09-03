import React, { useState, useMemo, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate'; // Although not directly used with TanStack Table's built-in pagination, keep if you plan external pagination UI.
import { FaEdit, FaTrash } from 'react-icons/fa';

import './ServiceRequestListComponent.css';
import './GenerateCertificateButton.js';

import ServiceRequestForm from './ServiceRequestFormComponent.js'; // Adjust path if needed
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import {
    DeleteServiceRequestDetails,
    getMasterService,
    getServiceDetails,
    getServiceRequestDetails
} from '../../services/servicelogic.js';
import ModelComponent from '../shared/ModelComponent.js'; // Correct path to your ModelComponent

import { MessagePopupContext } from '../../contexts/MessagePopupContext.js';
import GenerateCertificateButton from "./GenerateCertificateButton"; // Import the custom hook

// Helper function to parse the serviceId string (e.g., "1:Ration")
// This function needs to be resilient to non-string inputs from the start.
const parseServiceIdString = (serviceIdString) => {
    if (typeof serviceIdString !== 'string') {
        // console.warn("parseServiceIdString received non-string value:", serviceIdString);
        return { id: null, name: null };
    }

    // Handle '0:முகப்பு', '0:Home', 'home', or empty string as special cases for 'Home'
    if (serviceIdString === '0:முகப்பு' || serviceIdString === '0:Home' || serviceIdString === 'home' || serviceIdString === '') {
        return { id: '0', name: 'முகப்பு' }; // Consistent ID for home service
    }

    const parts = serviceIdString.split(':');
    if (parts.length === 2) {
        return { id: parts[0], name: parts[1] };
    }

    // Fallback for unexpected string formats (e.g., just "Ration" without an ID, or just "1")
    // console.warn("Unexpected serviceId format:", serviceIdString);
    return { id: serviceIdString, name: serviceIdString }; // Treat the whole string as ID and name
};


const ServiceRequestList = ({ serviceId, userData }) => {
    // Initializing 'data' to an empty array is good practice for tables
    const [data, setRequests] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState([]);
    const [displayServiceName, setDisplayServiceName] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [pageCount, setPageCount] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // <--- This state is key!

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editRecordId, setEditRecordId] = useState(null);

    const { showMessage, showConfirm } = useContext(MessagePopupContext);
    // --- Data Fetching Logic ---
    const fetchData = async () => {
        setLoading(true);

        const { id: actualServiceId, name: parsedServiceName } = parseServiceIdString(serviceId);

        setDisplayServiceName(parsedServiceName || 'Unknown Service');

        if (!actualServiceId || actualServiceId === '0') {
            setRequests([]); // Explicitly set to empty array for 'home' or invalid ID
            setPageCount(0); // Also reset pageCount
            setLoading(false);
            return;
        }

        try {
            const token = userData?.token;
            if (!token) {
                console.warn("Authentication token is missing. Cannot fetch data.");
                setRequests([]);
                setPageCount(0);
                setLoading(false);
                return;
            }

            let url = `?page=${pagination.pageIndex + 1}&page_size=${pagination.pageSize}`;
            const responseData = await getServiceRequestDetails(token, url, actualServiceId);

            // HIGHLIGHT: Ensure responseData.results is always an array
            // This is the most crucial part to prevent 'length' errors if results is missing/null.
            setRequests(await responseData?.data.results || []);
            setPageCount(Math.ceil(await (responseData?.data.count || 0) / pagination.pageSize));
        } catch (error) {
            console.error("Error fetching service requests:", error);
            setRequests([]); // HIGHLIGHT: Ensure 'data' is reset to an empty array on error
            setPageCount(0);
            setDisplayServiceName(parsedServiceName || 'Error Loading Service');
        } finally {
            setLoading(false);
        }
    };

    // This function is passed down as `onSaved`
    const handleFormSaved = () => {
        setShowModal(false); // Close the modal
        setEditRecordId(null); // Clear edit state
        setRefreshTrigger(prev => prev + 1); // Increment to trigger re-fetch of the list
    };

    // Effect hook to trigger data fetching
    useEffect(() => {
        fetchData();
    }, [serviceId, pagination.pageIndex, pagination.pageSize, sorting, userData?.token, refreshTrigger]);

    // --- Table Columns Definition ---
    const columns = useMemo(
        () => [
            { header: "ID", accessorKey: "id" },
            { header: "வேலைகள் தலைப்பு", accessorKey: "service_detail_name" }, // Adjusted based on common API responses
            { header: "தலைப்பு", accessorKey: "district_id" },
            { header: "வேலைகள்", accessorKey: "service_details_id" },
            { header: "கடை எண்", accessorKey: "shop_num" },
            { header: "குறிப்பு எண்", accessorKey: "ref_number" },
            { header: "தொகை", accessorKey: "amount" },
            { header: "பயனாளி பெயர்", accessorKey: "first_name" },
            { header: "கடைசிப் பெயர்", accessorKey: "last_name" },
            { header: "பதிவு செய்யப்பட்ட கைபேசி", accessorKey: "registered_mobile" },
            { header: "தொடர்பு எண்", accessorKey: "contact_mobile" },
            { header: "பயனாளியின் மின்னஞ்சல்", accessorKey: "email_id" },
            { header: "ஒன்றியம் / பேரூராட்சி", accessorKey: "block_id" },
            { header: "மற்றவை", accessorKey: "town_panchayat_id" },
            { header: "ஊராட்சி", accessorKey: "panchayat_id" },
            { header: "வருவாய் கிராமம்", accessorKey: "revenue_village_id" },
            { header: "கிராமத்தின் பெயர்", accessorKey: "village_name" },
            { header: "முகவரி வரி 1", accessorKey: "address_line1" },
            { header: "தெரு பெயர்கள்", accessorKey: "street_name" },
            {
                header: "சான்றிதழை பதிவிறக்கு",
                accessorKey: "document_attachment",
                cell: ({ row }) => {
                    const recordId = row.original.id; // Pass down the props needed by the component
                    const documentAttachment = row.original.document_attachment;
                    const recordStatus = row.original.status;

                    // Render the new component and pass the required props
                    return (
                        <GenerateCertificateButton
                            recordId={recordId}
                            recordStatus={recordStatus}
                            token={userData?.token}
                        />
                    );
                }
            },
            {
                header: "செயல்கள்",
                accessorKey: "actions",
                cell: ({ row }) => (
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm btn-outline-primary"
                            title="திருத்து"
                            onClick={() => {
                                setIsEditMode(true);
                                setEditRecordId(row.original.id);
                                setShowModal(true);
                            }}
                        >
                            <FaEdit />
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            title="நீக்கு"
                            onClick={() => handleDelete(row.original.id)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    // --- Tanstack Table Hook ---
    const table = useReactTable({
        data, // This 'data' is the 'data' state variable from useState
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter: filter,
            sorting: sorting,
            pagination: pagination,
        },
        globalFilterFn: (row, columnId, value) => {
            const cellValue = String(row.getValue(columnId)).toLowerCase();
            return cellValue.includes(value.toLowerCase());
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        manualPagination: true,
        manualSorting: true,
        pageCount: pageCount, // HIGHLIGHT: Ensure pageCount is correctly passed to TanStack Table
    });

    // --- Handlers for Actions ---
    const handleDelete = async (id) => { console.log('handleDelete called with id:', id);
      showConfirm(
      'Confirm Deletion', // Modal Title
      'Are you absolutely sure you want to delete this item? This action cannot be undone.', // Modal Message
      async () => {
            try 
            {
                const token = userData?.token;
                if (!token) {
                    showMessage(`Authentication token is missing. Cannot delete record.`, 'error');
                    return;
                }

                var response = await DeleteServiceRequestDetails(id, token);
                console.log('response 1', response.status)

                if(response && response.success && response.status === 204) {
                    showMessage(`Record ${id} deleted successfully!`, 'success');
                    setRefreshTrigger(prev => prev + 1); // Increment to trigger re-fetch of the list
                    fetchData(); // Re-fetch data to update the list after deletion
                }
            } 
            catch (error) 
            {
                console.error('Error deleting request:', error);
                showMessage(`Error deleting record ${id}: ${error.message}`, 'error');
            }        
      },
      () => {
        // --- User clicked 'Cancel' ---
        console.log('User cancelled deletion.');
        showMessage(`Deletion of record ${id} cancelled.`, 'info');
      }
    );
    };

    const handleAddNewRequest = () => {
        setIsEditMode(false);
        setEditRecordId(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        // This will trigger fetchData due to dependency on `showModal` (indirectly via `useEffect` if you added it)
        // Or directly call fetchData here if it's not a dependency
        fetchData(); 
    };

    // --- Render Logic ---
    if (loading) {
        return (
            <div className="text-center py-4">
                Loading {displayServiceName && displayServiceName !== 'முகப்பு' ? displayServiceName : 'Data'}...
            </div>
        );
    }

    return (
        <div className="service-request-list-container">
            <h2>
                {displayServiceName && displayServiceName !== 'முகப்பு'
                    ? `${displayServiceName} சேவை கோரிக்கைகள்`
                    : 'சேவை கோரிக்கைகள்'
                }
            </h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    type="text"
                    placeholder="அனைத்து பத்திகளையும் தேடுங்கள்..."
                    value={filter}
                    onChange={(e) => table.setGlobalFilter(e.target.value)} // HIGHLIGHT: Use table.setGlobalFilter
                    className="form-control w-25"
                />
                <button type="button" className="btn btn-primary" onClick={handleAddNewRequest}>
                    {displayServiceName && displayServiceName !== 'முகப்பு' ? `${displayServiceName} சேவையைக் கோருங்கள்` : 'புதிய சேவையைக் கோருங்கள்'}
                </button>
            </div>

            {/* Conditional rendering for no data */}
            {data.length === 0 ? ( // HIGHLIGHT: This check works because 'data' is always initialized as []
                <div className="alert alert-info text-center mt-3">
                    {displayServiceName && displayServiceName !== 'முகப்பு'
                        ? ` ${displayServiceName} சேவைக்கு எந்த பதிவுகளும் இல்லை.`
                        : 'இந்த சேவைக்கு எந்த பதிவுகளும் இல்லை.'}
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className='table table-striped table-bordered'>
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} colSpan={header.colSpan}>
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        {...{
                                                            className: header.column.getCanSort()
                                                                ? 'cursor-pointer select-none'
                                                                : '',
                                                            onClick: header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: " 🔼",
                                                            desc: " 🔽",
                                                        }[header.column.getIsSorted()] ?? null}
                                                    </div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <nav>
                            <ul className="pagination mb-0">
                                <li className={`page-item${!table.getCanPreviousPage() ? ' disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        &laquo; முந்தையது
                                    </button>
                                </li>
                                <li className="page-item disabled">
                                    <span className="page-link">
                                        பக்கம் {table.getState().pagination.pageIndex + 1} இல் {table.getPageCount()}
                                    </span>
                                </li>
                                <li className={`page-item${!table.getCanNextPage() ? ' disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        அடுத்தது &raquo;
                                    </button>
                                </li>
                                <li className="page-item ms-2">
                                    <select
                                        className="form-select"
                                        style={{ width: 150 }}
                                        value={table.getState().pagination.pageSize}
                                        onChange={e => table.setPageSize(Number(e.target.value))}
                                    >
                                        {[10, 25, 50, 100].map((pageSize) => (
                                            <option key={pageSize} value={pageSize}>
                                                {pageSize} காட்டு
                                            </option>
                                        ))}
                                    </select>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </>
            )}

            {/* Modal Component for Add/Edit Form */}
            <ModelComponent
                showModal={showModal}
                onClose={handleCloseModal}
                title={isEditMode
                    ? 'சேவை கோரிக்கையை திருத்து'
                    : `${displayServiceName && displayServiceName !== 'முகப்பு' ? displayServiceName : 'புதிய'} சேவையைக் கோருங்கள்`
                }
            >
                <ServiceRequestForm
                    onClose={handleCloseModal}
                    isEditMode={isEditMode}
                    recordId={editRecordId}
                    serviceId={parseServiceIdString(serviceId).id}
                    onSaved={handleFormSaved}
                    // Pass userData if needed by the form for default values or permissions
                    userData={userData}
                />
            </ModelComponent>
        </div>
    );
};

export default ServiceRequestList;