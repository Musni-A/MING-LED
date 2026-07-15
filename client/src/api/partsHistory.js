import axios from "axios";
import { baseURL } from "./userAPI";

export const API = axios.create({baseURL : baseURL});

export const createPartsHistory = (data) => API.post('/createPartsHistory',data)
export const getPartsHistory = () => API.get('/parts-history/dates')