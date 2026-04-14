import axios from "axios";

export const API = axios.create({baseURL: "http://localhost:5000/api"});

export const test = (testData)=> API.post('/test', testData)
export const createParts = (data) => API.post('/parts', data)
export const getAllLedParts = () => API.get('/parts')
export const deleteLedParts = (id) => API.delete(`/parts/${id}`)
export const updateParts = (data, arithType) => API.patch('/parts',{data, arithType})
export const createBulbType = (data)=> API.post('/bulbType', data)

