import axios from "axios";

export const API = axios.create({baseURL: "https://ming-led-server.onrender.com/api"});

export const test = (testData)=> API.post('/test', testData)
export const createParts = (data) => API.post('/parts', data)
export const getAllLedParts = () => API.get('/parts')
export const deleteLedParts = (id) => API.delete(`/parts/${id}`)
export const updateParts = (data, arithType) => API.patch('/parts',{data, arithType})

