import axios from "axios";
import { baseURL } from "./userAPI";

export const API = axios.create({baseURL: baseURL});

export const createLightWatts = (Data)=> API.post('/lightWatts', Data);
export const getLightWatts = ()=> API.get('/lightWatts')
export const updateLightWatts = (data) => API.patch('/lightWatts', data)
export const deleteLightWatts = (id) => API.delete(`/lightWatts/${id}`)