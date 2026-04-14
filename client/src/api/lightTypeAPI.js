import axios from "axios";
import { baseURL } from "./userAPI";

export const API = axios.create({baseURL: baseURL});

export const createLightType = (Data)=> API.post('/lightType', Data);
export const getLightType = ()=> API.get('/lightType')