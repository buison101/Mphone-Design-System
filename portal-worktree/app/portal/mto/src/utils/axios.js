import axios from 'axios';

// project imports
import { getLocalResponse } from 'data/local-api';

// ==============================|| AXIOS - LOCAL UI LAB ADAPTER ||============================== //

const localAdapter = async (config) => ({
  data: getLocalResponse(config.url, config.method, config.data),
  status: 200,
  statusText: 'OK',
  headers: {},
  config,
  request: null
});

const axiosServices = axios.create({ adapter: localAdapter });

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
