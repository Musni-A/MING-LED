import axios from "axios";
import { baseURL } from "./userAPI";

export const API = axios.create({baseURL: baseURL});

export const createLightWatts = (Data)=> API.post('/lightWatts', Data);
export const getLightWatts = ()=> API.get('/lightWatts')
export const updateLightWatts = (data) => API.patch('/lightWatts', data)
export const deleteLightWatts = (id) => API.delete(`/lightWatts/${id}`)
export const updateProductStock = (productId, data) => API.patch(`/updateProductStock/${productId}`, data);
export const bulkUpdateProducts = (data) => API.patch('/bulkUpdateProducts', data);