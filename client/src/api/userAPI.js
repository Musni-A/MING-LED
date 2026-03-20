import axios from 'axios';

const API = axios.create({ baseURL : 'http://192.168.1.4:5000/api' });

export const createUser = (data) => API.post('/register', data);
export const getUser = (data) => API.post('/login', data);
export const getAllUsers = () => API.get('/users')