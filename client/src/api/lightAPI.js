import axios from "axios";

export const API = axios.create({baseURL: "http://localhost:5000/api"});

export const createLightWatts = (Data)=> API.post('/lightWatts', Data);
export const getLightWatts = ()=> API.get('/lightWatts')
export const updateLightWatts = (data) => API.patch('/lightWatts', data)
export const deleteLightWatts = (id) => API.delete(`/lightWatts/${id}`)