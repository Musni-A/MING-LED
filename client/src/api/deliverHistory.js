import axios from "axios";

import { baseURL } from "./userAPI";

export const API = axios.create({baseURL: baseURL});

export const createDeliverHistory = ( Data )=> API.post('/deliverHistory',  Data);