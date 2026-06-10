import axios from "axios";

import { baseURL } from "./userAPI";

export const API = axios.create({baseURL: baseURL});

export const createFinishingGoodsHistory = ( Data, distributor )=> API.post('/finishingGoodsHistory',  Data, { params: { distributor } });
export const getFinishingGoodsHistory = () => API.get('/getFinishingGoodsHistory')