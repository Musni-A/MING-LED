import axios from "axios";

export const API = axios.create({baseURL: "http://localhost:5000/api"});

export const createLightType = (Data)=> API.post('/lightType', Data);
export const getLightType = ()=> API.get('/lightType')