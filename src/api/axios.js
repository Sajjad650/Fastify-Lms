import axios from 'axios';
// import { setLogout } from '../auth/authSlice';
import { toast } from 'react-toastify';
import { store } from '../store';

export const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
http.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      //   localStorage.removeItem('accessToken');
      //   store.dispatch(setLogout());
    } else if (error.code === 'ERR_NETWORK') {
      // toast.error("Network Error");
    }
    return Promise.reject(error);
  }
);

const handleApiError = (error) => {
  if (error.response) {
    // toast.error(error?.response?.data?.message);
    // toast.error(`Success: ${error?.response?.data?.success}`);
  } else if (error.request) {
    // toast.error("No response received for the request:", error.request);
  } else {
    // toast.error("Error setting up the request:", error.message);
  }
  return error;
};

// Generic function to perform CRUD operations
const performRequest = async (method, url, data, config = {}) => {
  try {
    const response = await method(url, data, config);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const get = async (url, config = {}) => {
  return performRequest(http.get, url, config);
};

export const post = async (url, data, config = {}) => {
  return performRequest(http.post, url, data, config);
};

export const put = async (url, data, config = {}) => {
  return performRequest(http.put, url, data, config);
};

export const del = async (url, config = {}) => {
  return performRequest(http.delete, url, config);
};
