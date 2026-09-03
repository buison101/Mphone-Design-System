import axios from 'axios';

// project imports
import { isOffline, recall, remember } from './offline-cache';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3010/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => {
    // Keep a copy of every successful read, so the same page still renders offline.
    if (response.config?.method === 'get') remember(response.config.url, response.data);
    return response;
  },
  (error) => {
    // The mock API never answered. Serve the cached copy rather than failing the page.
    if (isOffline(error) && error.config?.method === 'get') {
      const cached = recall(error.config.url);
      if (cached !== undefined) {
        return Promise.resolve({ data: cached, status: 200, statusText: 'OK (offline cache)', config: error.config, headers: {} });
      }
    }

    // Vendor behaviour, guarded: error.response is undefined on a network failure.
    if (error.response?.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/maintenance/500';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};
