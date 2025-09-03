//GET login details
const ENDPOINT_BASE_URL = 'http://127.0.0.1:8000';
const CONTENT_TYPE_JSON = 'application/json';

//Common function
const fetchLoginData = async (endpoint, options = {}) => {
    try {
        //Create a base headers object with common headers
        const headers = {
            'Content-Type': CONTENT_TYPE_JSON,
            ...options.headers, // Allow custom headers to override or extend
        };

        // Stringify the body if it's an object
        const body = options.body ? JSON.stringify(options.body) : undefined;

        const response = await fetch(`${ENDPOINT_BASE_URL}/${endpoint}`, {...options, headers, body});
        return await handleResponse(response);
      } catch (error) {
       // Catch network errors (e.g., server is down, no internet connection)
        console.error("Network error during API call:", error);
        return {
          success: false,
          status: 0, // Use a non-HTTP status code for network errors
          data: null,
          error: error.message || "Network request failed."
        };
    }
};

const fetchData = async (endpoint, options = {}, token = null) => {
    try {
        console.log('body ',options.body)

        const isFormData = options.body instanceof FormData;
        const method = options.method ? options.method.toUpperCase() : 'GET';
        const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
        console.log('Is form data', isFormData)
        const content_type = !isFormData || options.body === 'undefined' ? CONTENT_TYPE_JSON : null
        const headers = new Headers();

          // Add Content-Type header conditionally
          if (hasBody && !isFormData) {
            headers.set('Content-Type', 'application/json');
          }

          // Add Authorization header conditionally
          if (token) {
            headers.set('Authorization', `Token ${token}`);
          }

          // Add any other custom headers passed in the options
          for (const key in options.headers) {
            headers.set(key, options.headers[key]);
          }

        // Handle the body: do not stringify FormData
        const body = (hasBody && !isFormData) ? JSON.stringify(options.body) : options.body;

        const response = await fetch(`${ENDPOINT_BASE_URL}/${endpoint}`, {...options, headers, body});
        return await  handleResponse(response);

    // if (!response.ok) {
    //   throw new Error(`Error: ${response.statusText}`);
    //   console.log('Status Text: ' + response.statusText + ' Status :' +  response.status, 'Headers: ' + response.headers.status)
    // }
    //
    // if (response.status === 201) {
    //   return { success: true, status: 201, message: 'Record created successfully.' };
    // }
    //
    // if (response.status === 204) {
    //   return { success: true, status: 204, message: 'Record deleted successfully.' };
    // }
    // //No content, return an empty object or null
    //return await response.json();
  } catch (error) {
       // Catch network errors (e.g., server is down, no internet connection)
        console.error("Network error during API call:", error);
        return {
          success: false,
          status: 0, // Use a non-HTTP status code for network errors
          data: null,
          error: error.message || "Network request failed."
        };
    }
};

const fetchBlobData = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${ENDPOINT_BASE_URL}/${endpoint}`, options);
        return await handleResponse(response);
    } catch (error) {
       // Catch network errors (e.g., server is down, no internet connection)
        console.error("Network error during API call:", error);
        return {
          success: false,
          status: 0, // Use a non-HTTP status code for network errors
          data: null,
          error: error.message || "Network request failed."
        };
    }
};

//Get users
export const getUsers = async (auth_data) => {
    const response = await fetchLoginData('api/users/GetLogin/', {
            method: 'POST',
            body: auth_data
        });
    return await response;
}

//forgot password
export const getForgotPassword = async (data) => {
    const response = await fetchLoginData('api/forgotpassword/',{
    method: 'POST',
    body: data
  });
  return await response;
}

//restore password - named function
export const  ResetPassword  = async (data) =>
{
    const response = await fetchLoginData('api/resetpassword/', {
    method: 'POST',
    body: data
  });
  return await response;
}

export const postUser = async (data) => {
    const response = await fetchLoginData('/api/users/', {
        method: 'POST',
        body: data
    });
    return await response;
}

//Get service
export const getMasterService = async (token) => {
    const response = await fetchData('api/service/services/', {
        method: 'GET', token
    });
    return response;
}

//Get service details
export const getServiceDetails = async  (token, serviceid) => {
    const response = await fetchData(`api/service/servicesdetails/?serviceid=${serviceid}`, {
        method: 'GET', token
    });
    return response;
}

//Get service request details
export const getServiceRequestDetails = async (token, url, serviceid) => {
    const response = await fetchData(`api/service/servicerequestdetails/${url ? url : ''}&serviceid=${serviceid}`, {
        method: 'GET', token
    });
        console.log('ddd', response)
    return await response;
}

export const CreateServiceRequestDetails = async (formData, token) => {
    const response = await fetchData('api/service/servicerequestdetails/', {
        method: 'POST',
        body: formData, token
    });

    return await response;
}

export const getServiceRequestDetailsById = async (id, token) => {
    const response = await fetchData(`api/service/servicerequestdetails/${id}/`, {
        method: 'GET', token
    });
    return await response;
}

// This is the function you need for updating
export const UpdateServiceRequestDetails = async (recordId, formData, token) => {
    const response = await fetchData(`api/service/servicerequestdetails/${recordId}/`, {
        method: 'PUT', // Changed method from POST to PUT
        body: formData, token
    });
    return await response;
}

export const DeleteServiceRequestDetails = async (recordId, token) => {
    const response = await fetchData(`api/service/servicerequestdetails/${recordId}/`, {
        method: 'DELETE',token
    });
    return await response;
}

export const GenerateCertificate = async (recordId, token) => {
    const response = await fetchBlobData(`api/service/servicerequestdetails/${recordId}/generate_certificate`, {
        method: 'GET',
        headers: {
            'authorization': `Token ${token}`
        }
    });
    return await response;
}

//Get district details
export const getDistrictDetails = async (token, url) => {
    const response = await fetchData('api/master/districtdetails/', {
        method: 'GET',token
    });
    return await response;
}

//Get block details
export const getBlockDetails = async (token, url) => {
    const response = await fetchData('api/master/blocklist/', {
        method: 'GET',token
    });
    return await response;
}
//Get town panchayat details
export const getTownPanchayatDetails = async (token, url) => {
    const response = await fetchData('api/master/townpanchayatlist/', {
        method: 'GET',token
    });
    return await response;
}

//Get panchayat details
export const getPanchayatDetails = async (token, url) => {
    const response = await fetchData('api/master/panchayatlist/', {
        method: 'GET',token
    });
    return await response;
}
//Get revenue village details
export const getRevenueVillages = async (token, url) => {
    const response = await fetchData('api/master/revenuevillagelist/', {
        method: 'GET',token
    });
    return await response;
}

//Get town panchayat village street details
export const getTownPanchayatVillageStreetDetails = async (token, url) => {
    const response = await fetchData('api/master/townvillagestreetlist/', {
        method: 'GET', token
    });
    return await response;
}

/**
 * Handles an API response, throwing a detailed error for non-OK statuses.
 * @param {Response} response The raw fetch Response object.
 * @returns {Promise<any>} A promise that resolves with the parsed JSON data.
 */
async function handleResponse(response) {
    console.log('handle response ', response)
    // Check if the response is successful (e.g., status 2xx)
    const isSuccess = response.ok;

    // Determine if the response has JSON content
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    let data = null;
    let error = null;

    // Only attempt to parse JSON if the content type is JSON
    if (isJson) {
        try {
          data = await response.json();
        } catch (e) {
          // Handle cases where parsing the JSON fails
        console.error("Failed to parse JSON response:", e);
        error = "Invalid JSON response from server.";
        }
    }

    // If the response was not a success, create an error object
    if (!isSuccess) {
        // You could also pull the error message from the 'data' object if available
        error = error || (data && data.message) || `Request failed with status: ${response.status}`;
    }

    // Return a single, consistent object
    return {
        success: isSuccess,
        status: response.status,
        data: data,
        error: error
    };
}