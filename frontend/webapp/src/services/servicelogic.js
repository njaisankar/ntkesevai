//GET login details
const ENDPOINT_BASE_URL = 'http://127.0.0.1:8000';
const CONTENT_TYPE_JSON = 'application/json';

//Common function 
const fetchData = async (endpoint, options = {}) => {
  try {
    
      //throw new Error(`Error: ${response.statusText}`);
    console.log('options :' + options)
    console.log(`${ENDPOINT_BASE_URL}/${endpoint}`)
    const response = await fetch(`${ENDPOINT_BASE_URL}/${endpoint}`, options);
    console.log('response ', response)
    if (!response.ok) {
      //throw new Error(`Error: ${response.statusText}`);
      console.log('Status Text: ' + response.statusText + ' Status :' +  response.status, 'Headers: ' + response.headers.status)
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

//Get users
export const getUsers = (auth_data) => fetchData('api/users/GetLogin/', {
    method: 'POST',
    headers: { 
    'Content-Type': CONTENT_TYPE_JSON
    },
    body: JSON.stringify(auth_data),
});

//forgot password
export const getForgotPassword = (data) => {  fetchData('api/forgotpassword/',{
    method: 'POST',
    headers: {
      'Content-Type': CONTENT_TYPE_JSON
    },
    body: JSON.stringify(data)
  }
)}


//resetgot password - named function
export const  ResetPassword  = (data) =>
{
   var x = fetchData('api/resetpassword/', {
    method: 'POST',
    headers: {
      'Content-Type': CONTENT_TYPE_JSON
    },
    body: JSON.stringify(data)
  });
  console.log('return ', x.response)
}

export const postUser = (data) => fetchData('/api/users/', {
  method: 'POST',
  headers: { 
  'Content-Type': CONTENT_TYPE_JSON
  },
  body: JSON.stringify(data)
});


////Get service
export const getMasterService = (token) => fetchData('api/service/services/', {
  method: 'GET',
  headers: { 
    'authorization' :  `Token ${token}`,
    'Content-Type': CONTENT_TYPE_JSON
  }
});

//Get service details
export const getServiceDetails = (token, serviceid) => fetchData(`api/service/servicesdetails/?serviceid=${serviceid}`, {
  method: 'GET',
  headers: { 
    'authorization' :  `Token ${token}`,
    'Content-Type': CONTENT_TYPE_JSON
  }
});

//Get service request details
export const getServiceRequestDetails = (token, url, serviceid) => fetchData(`api/service/servicerequestdetails/${url ? url : ''}&serviceid=${serviceid}`, {
  method: 'GET',
  headers: { 
    'authorization' :  `Token ${token}`,
    'Content-Type': CONTENT_TYPE_JSON
  }
});

export const CreateServiceRequestDetails = (formData, token) => fetchData('api/service/servicerequestdetails/', {
  method: 'POST',
  headers: { 
    'authorization' :  `Token ${token}`
    // 'Content-Type': CONTENT_TYPE_JSON
  },
  body: formData
  //JSON.stringify(jsonData)  
});

export const getServiceRequestDetailsById = (id, token) => fetchData(`api/service/serviceseditrequest/?id=${id}`, {
  method: 'GET',
  headers: { 
    'authorization' :  `Token ${token}`,
    'Content-Type': CONTENT_TYPE_JSON
  }
});

// This is the function you need for updating
export const UpdateServiceRequestDetails = (recordId, formData, token) => fetchData(`api/service/servicerequestdetails/?id=${recordId}`, {
    method: 'PUT', // Changed method from POST to PUT
    headers: {
        'authorization': `Token ${token}`//,
        //'Content-Type': CONTENT_TYPE_JSON
    },
    body: formData
    //body: JSON.stringify(data)
});


export const DeleteServiceRequestDetails = (recordId, token) => fetchData(`api/service/servicerequestdetails/?id=${recordId}`, {
    method: 'DELETE', 
    headers: {
        'authorization': `Token ${token}`//,
        //'Content-Type': CONTENT_TYPE_JSON
    }
});

//Get district details
export const getDistrictDetails = (token, url) => fetchData('api/master/districtdetails/', {
  method: 'GET',
  headers: { 
    'authorization' :  `Token ${token}`,
    'Content-Type': CONTENT_TYPE_JSON
  }
});

//Get block details
export const getBlockDetails = (token, url) => fetchData('api/master/blocklist/', {
  method: 'GET',
  headers: { 
    'authorization' :  `Token ${token}`,
    'Content-Type': CONTENT_TYPE_JSON
  }
});

//Get town panchayat details
export const getTownPanchayatDetails = (token, url) => fetchData('api/master/townpanchayatlist/', {
  method: 'GET',
  headers: { 
    'authorization' :  `Token ${token}`,
    'Content-Type': CONTENT_TYPE_JSON
  }
});


//Get panchayat details
export const getPanchayatDetails = (token, url) => fetchData('api/master/panchayatlist/', {
  method: 'GET',
  headers: { 
    'authorization' :  `Token ${token}`,
    'Content-Type': CONTENT_TYPE_JSON
  }
});

//Get revenue village details
export const getRevenueVillages = (token, url) => fetchData('api/master/revenuevillagelist/', {
  method: 'GET',
  headers: { 
    'authorization' :  `Token ${token}`,
    'Content-Type': CONTENT_TYPE_JSON
  }
});

//Get town panchayat village street details
export const getTownPanchayatVillageStreetDetails = (token, url) => fetchData('api/master/townvillagestreetlist/', {
  method: 'GET',
  headers: { 
    'authorization' :  `Token ${token}`,
    'Content-Type': CONTENT_TYPE_JSON
  }
});