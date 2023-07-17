import axios from 'axios'

export const apiClient = axios.create(
    {
        baseURL: process.env.REACT_APP_SERVER_URL,
        // header for first time api calls after refresh
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    }
);