import { API } from "./userAPI";

export const createPartsHistory = (data) => API.post('/createPartsHistory',data)
export const getPartsHistory = () => API.get('/parts-history/dates')
export const getPartsHistoryByDate = (date) => API.get(`/parts-history/${date}`)