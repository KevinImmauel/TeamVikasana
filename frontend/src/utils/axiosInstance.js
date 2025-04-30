import axios from 'axios';
import { getToken } from './tokenHelper';

const api = axios.create({
    baseURL:"https://cyber-acrt.onrender.com/api/v1",
    
});
   

api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
