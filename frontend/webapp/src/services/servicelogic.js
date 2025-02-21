//GET login details
const ENDPOINT_BASE_URL = 'http://127.0.0.1:8000';
const CONTENT_TYPE_JSON = 'application/json';

//Common function 
const fetchData = async (endpoint, options = {}) => {
  try {
    console.log('options :' + JSON.stringify(options))
    const response = await fetch(`${ENDPOINT_BASE_URL}/${endpoint}`, options);
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
export const getUsers = (auth_data) => fetchData('/users/GetLogin/', {
    method: 'POST',
    headers: { 
    'Content-Type': CONTENT_TYPE_JSON
    },
    body: "{\"username\":\"njais\",\"password\":\"ntkesevai!980\"}",
});


//Get users
export const getServiceRequest = (token) => fetchData('api/servicesdetails/', {
  method: 'GET',
  headers: { 
    'authorization' :  `Token ${token}`,
  'Content-Type': CONTENT_TYPE_JSON
  }
});