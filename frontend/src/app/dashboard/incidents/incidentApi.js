import axios from 'axios';

const incidentApi = {
    get: async (url, config = {}) => {
        try {
            const response = await axios.get(url, config);
            return response.data; // Return the response data
        } catch (error) {
            throw error; // Forward the error to be handled by the calling function
        }
    },

    post: async (url, data, config = {}) => {
        try {
            const response = await axios.post(url, data, config);
            return response.data; // Return the response data
        } catch (error) {
            throw error; // Forward the error to be handled by the calling function
        }
    },
};

export default incidentApi;
