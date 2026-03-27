import axios from "axios";

const API = axios.create({baseURL: "https://ming-led-server.onrender.com/api"});

export const test = (testData)=> API.post('/test', testData)

