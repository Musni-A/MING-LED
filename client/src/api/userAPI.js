import axios from 'axios';

// 'http://localhost:5000/api'
// https://ming-led-server.onrender.com/api
export const baseURL = 'http://localhost:5000/api';

export const API = axios.create({baseURL : baseURL});

export const createUser = (data) => API.post('/register', data);
export const getUser = (data) => API.post('/login', data);
export const getAllUsers = () => API.get('/users')
export const deleteUser = (id) => API.delete(`/users/${id}`)
