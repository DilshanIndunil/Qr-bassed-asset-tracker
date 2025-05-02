import axios from 'axios';

const API_URL = 'http://localhost:5000';  // Backend API URL

// Axios instance for API calls
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Upload image
export const uploadImage = async (assetID, file) => {
    try {
        const token = localStorage.getItem('token'); // Retrieve auth token

        // Check if token exists
        if (!token) {
            throw new Error('Authorization token not found');
        }

        // Ensure file is selected
        if (!file) {
            throw new Error('No file selected for upload');
        }

        const formData = new FormData();
        formData.append('image', file); // Ensure field name matches backend expectations

        const response = await api.post(`/api/upload-single/${assetID}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
                'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        // Return a more descriptive error message
        throw error.response?.data || error.message || 'Unknown error occurred during upload';
    }
};



// export const fetchImage = async (assetId) => {
//     try {
//         const response = await fetch(`http://localhost:5000/api/fetch-image/${assetId}`);
//         const data = await response.json();
//         return data.image ? `http://localhost:5000/uploads${data.image}` : null;
//     } catch (error) {
//         console.error("Error fetching image:", error);
//         return null;
//     }
// };



// SLT Admin Login
export const loginSltAdmin = async (username, password) => {
    try {
        const response = await api.post('/api/slt-admin/login', { username, password });

        return response.data; // Contains the token and message
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error.response ? error.response.data : { message: "Server error" };
    }
};

// Function to send a verification code to the administrator's email
export const sendVerificationCode = async (email) => {
    try {
        const response = await api.post('/api/administrator/send-code', { email });
        return response.data; // Return the success message from the backend
    } catch (error) {
        console.error('Error sending verification code:', error.response?.data || error.message);
        // Return or throw an appropriate error message
        throw error.response?.data?.message || 'Failed to send verification code. Please try again.';
    }
};

// Function to verify the administrator's code
export const verifyCode = async (email, code) => {
    try {
        const response = await api.post('/api/administrator/verify-code', { email, code });
        return response.data; // Return the token and success message from the backend
    } catch (error) {
        console.error('Error verifying code:', error.response?.data || error.message);
        // Return or throw an appropriate error message
        throw error.response?.data?.message || 'Invalid verification code. Please try again.';
    }
};


// Function to add a company
export const addCompany = async (companyData) => {
    try {
        const token = localStorage.getItem('token');

        // Ensure that the Authorization header is set correctly
        const response = await api.post('/api/slt-admin/add-company', companyData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding company:', error.response?.data || error.message);
        // If the error response is available, use it. Otherwise, send a generic message.
        throw error.response?.data || { message: 'Something went wrong' };
    }
};

// Function to fetch companies
export const getCompanies = async () => {
    try {

        const token = localStorage.getItem('token');

        // Make API call to fetch companies
        const response = await api.get('/api/slt-admin/companies', {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data; // Return the list of companies
    } catch (error) {
        console.error('Error fetching companies:', error.response?.data || error.message);
        // Handle error gracefully
        throw error.response?.data || { message: 'Something went wrong while fetching companies.' };
    }
};

// Function to delete a company
export const deleteCompany = async (companyId) => {

    try {

        const token = localStorage.getItem('token');

        const response = await api.delete(`/api/company/${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Attach JWT token for authorization
            },
        });
        return response.data; // Return the success message from the backend
    } catch (error) {
        console.error('Error deleting company:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Server error' };
    }
};

// Function to update company details
export const updateCompany = async (companyId, updatedCompanyData) => {
    try {
        const token = localStorage.getItem('token');

        // Sending the PUT request with the Authorization header
        const response = await api.put(`/api/company/${companyId}`, updatedCompanyData, {
            headers: {
                Authorization: `Bearer ${token}`, // Attach JWT token for authorization
            },
        });

        return response.data; // Return the updated company data from the server
    } catch (error) {
        console.error('Error updating company:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Failed to update company' };
    }
};

// Function to get administrators by company ID
export const getAdministratorsByCompanyId = async (companyId) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`${API_URL}/api/slt-admin/administrator/${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Assuming token is stored in localStorage
            },
        });

        // Check if administrators exist in the response
        if (response.data && response.data.administrators) {
            return response.data.administrators;  // Return administrators if available
        } else {
            // If no administrators are found, return an empty array
            return [];
        }
    } catch (error) {
        // Handle errors without throwing them, log and return empty array or a message if needed
        console.error('Error fetching administrators:', error.response?.data || error.message);
        // Return an empty array in case of any error
        return [];
    }
};


// Add administrators to the company
export const addAdministratorToCompany = async (companyId, email, name) => {
    try {
        const token = localStorage.getItem('token'); // Fetch the token from localStorage

        // Use the `api` instance for consistency with the baseURL
        const response = await api.post(
            `/api/slt-admin/add-administrator`, // Ensure the path is relative to the API baseURL
            { companyId, email, name },        // Data sent in the body
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token for authorization
                },
            }
        );

        // Return the response data (e.g., success message or updated administrators list)
        return response.data;
    } catch (error) {
        console.error('Error adding administrator:', error.response?.data || error.message);

        // Return a meaningful error message or throw it for handling by the caller
        throw error.response?.data?.message || 'Failed to add administrator. Please try again.';
    }
};


// Function to remove an administrator from a company
export const removeAdministratorFromCompany = async (companyId, email) => {
    try {
        const token = localStorage.getItem('token'); // Fetch the token from localStorage

        // Use the `api` instance for consistency with the baseURL
        const response = await api.delete(
            `/api/slt-admin/remove-administrator`, // Ensure the path is relative to the API baseURL
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token for authorization
                },
                data: {
                    companyId, // Include companyId in the request body
                    email,     // Include the email of the administrator to be removed
                },
            }
        );

        // Return the response data (e.g., success message or updated administrators list)
        return response.data;
    } catch (error) {
        console.error('Error removing administrator:', error.response?.data || error.message);

        // Return a meaningful error message or throw it for handling by the caller
        throw error.response?.data?.message || 'Failed to remove administrator. Please try again.';
    }
};


// Function to fetch administrator details
export const getAdministratorDetails = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/administrator/details', {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data; // Assuming the response contains the details
    } catch (error) {
        console.error('Error fetching administrator details:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to fetch administrator details.';
    }
};


// Function to add a factory worker
export const addFactoryWorker = async (workerData) => {
    try {
        const { companyId } = await getAdministratorDetails();
        const token = localStorage.getItem('token');
        const response = await api.post(`/api/factory-worker/add/${companyId}`, workerData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data.factoryWorker; // Return the added factory worker data
    } catch (error) {
        console.error('Error adding factory worker:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to add factory worker. Please try again.';
    }
};


// Function to fetch factory workers by company ID
export const getFactoryWorkersByCompanyId = async () => {
    try {

        const { companyId } = await getAdministratorDetails();
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/factory-worker/company/${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data.factoryWorkers; // Assuming the response contains the list of factory workers
    } catch (error) {
        console.error('Error fetching factory workers:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to fetch factory workers.';
    }
};

// Function to update a factory worker's details
export const updateFactoryWorker = async (workerId, workerData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.put(`/api/factory-worker/${workerId}`, workerData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data.factoryWorker; // Return the updated factory worker data
    } catch (error) {
        console.error('Error updating factory worker:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to update factory worker. Please try again.';
    }
};

// Function to delete a factory worker
export const deleteFactoryWorker = async (workerId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.delete(`/api/factory-worker/${workerId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data; // Assuming the response contains a success message
    } catch (error) {
        console.error('Error deleting factory worker:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to delete factory worker. Please try again.';
    }
};

// Function to fetch assets by company ID
export const getAssetsByCompanyId = async () => {
    try {
        const { companyId } = await getAdministratorDetails();
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/assets/${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data.assets; // Assuming the response contains the list of assets
    } catch (error) {
        console.error('Error fetching assets:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to fetch assets.';
    }
};


// Function to fetch asset details by asset ID
export const getAssetById = async (assetId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/assets/details/${assetId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data.asset; // Assuming the response contains the asset details
    } catch (error) {
        console.error('Error fetching asset details:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to fetch asset details.';
    }
};


// Function to update asset details by asset ID
export const updateAssetById = async (assetId, assetData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.patch(`/api/update/${assetId}`, assetData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data.asset; // Assuming the response contains the updated asset details
    } catch (error) {
        console.error('Error updating asset details:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to update asset details.';
    }
};


// Function to add a new asset
export const addAsset = async (assetData) => {
    try {
        const { companyId } = await getAdministratorDetails();
        const token = localStorage.getItem('token');
        const response = await api.post(`/api/assets/add/${companyId}`, assetData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data.asset; // Assuming the response contains the added asset details
    } catch (error) {
        console.error('Error adding asset:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to add asset.';
    }
};

// Function to delete an asset by asset ID
export const deleteAssetById = async (assetId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.delete(`/api/assets/${assetId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data; // Assuming the response contains a success message
    } catch (error) {
        console.error('Error deleting asset:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to delete asset. Please try again.';
    }
};


// Function to fetch all maintenance records
export const getMaintenanceRecords = async () => {
    try {
        const { companyId } = await getAdministratorDetails(); // Ensure this returns a valid companyId
        if (!companyId) {
            throw new Error('No company ID found');
        }

        const token = localStorage.getItem('token'); // Ensure the token is available

        const response = await api.get(`/api/maintenance/company/${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token for authorization
            },
        });
        return response.data.data; // Assuming the response contains the records in `data` field
    } catch (error) {
        console.error('Error fetching maintenance records:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to fetch maintenance records.';
    }
};

// Function to get the asset count for the company associated with the administrator
export const getAssetCountByCompany = async () => {
    try {
        // Fetch administrator details to get the company ID
        const { companyId } = await getAdministratorDetails();

        if (!companyId) {
            throw new Error('No company ID found for the administrator.');
        }

        const token = localStorage.getItem('token'); // Fetch the token from localStorage

        // Use the `api` instance to make the GET request
        const response = await api.get(`/api/companies/asset-count/${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token for authorization
            },
        });

        // Return the asset count from the response
        return response.data.assetCount;
    } catch (error) {
        console.error('Error fetching asset count:', error.response?.data || error.message);

        // Return or throw an appropriate error message
        throw error.response?.data?.message || 'Failed to fetch asset count. Please try again.';
    }
};

// Function to get the user count for the company associated with the administrator
export const getUserCountByCompany = async () => {
    try {
        // Fetch administrator details to get the company ID
        const { companyId } = await getAdministratorDetails();

        if (!companyId) {
            throw new Error('No company ID found for the administrator.');
        }

        const token = localStorage.getItem('token'); // Fetch the token from localStorage

        // Use the `api` instance to make the GET request to the user count API endpoint
        const response = await api.get(`/api/user-count/${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token for authorization
            },
        });

        // Return the user count from the response
        return response.data; // Assuming the response contains user count data
    } catch (error) {
        console.error('Error fetching user count:', error.response?.data || error.message);

        // Return or throw an appropriate error message
        throw error.response?.data?.message || 'Failed to fetch user count. Please try again.';
    }
};



export default api;
