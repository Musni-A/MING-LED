import axios from 'axios';

const API = axios.create({ baseURL : 'https://ming-led-server.onrender.com' });

export const createUser = (data) => API.post('/register', data);
export const getUser = (data) => API.post('/login', data);
export const getAllUsers = () => API.get('/users')