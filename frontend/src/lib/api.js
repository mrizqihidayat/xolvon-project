import axios from 'axios';
import { eventBus } from '../utils/eventBus';

const axiosAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000, 
});

axiosAPI.interceptors.request.use((config) => {
  eventBus.emit('axios-start');
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  eventBus.emit('axios-end');
  return Promise.reject(error);
});

axiosAPI.interceptors.response.use((response) => {
  eventBus.emit('axios-end');
  return response;
}, (error) => {
  eventBus.emit('axios-end');
  return Promise.reject(error);
});

const extractData = (res) => res.data;
const handleError = (err) => { throw err.response?.data || err; };

const get = (url) => axiosAPI.get(url).then(extractData).catch(handleError);
const post = (url, body) => axiosAPI.post(url, body).then(extractData).catch(handleError);
const put = (url, body) => axiosAPI.put(url, body).then(extractData).catch(handleError);
const del = (url) => axiosAPI.delete(url).then(extractData).catch(handleError);

export const getActiveProducts = () => get('/products?active=true');
export const getAllProducts    = () => get('/products');
export const createProduct     = (body) => post('/products', body);
export const updateProduct     = (id, body) => put(`/products/${id}`, body);
export const deleteProduct     = (id) => del(`/products/${id}`);
export const getTransactions   = () => get('/transactions');
export const getTransaction    = (id) => get(`/transactions/${id}`);
export const checkout          = (items, method) => post('/checkout', { items, payment_method: method });

export default axiosAPI;
