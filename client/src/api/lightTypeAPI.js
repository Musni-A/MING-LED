import axios from "axios";
import { baseURL } from "./userAPI";

export const API = axios.create({baseURL: baseURL});

export const createLightType = (data)=> API.post('/lightType', data);
export const getLightType = ()=> API.get('/lightType')
export const deleteLightType = (data)=>API.delete(`/lightType/${data}`)