import { API } from "./userAPI";

export const createLightType = (data)=> API.post('/lightType', data);
export const getLightType = ()=> API.get('/lightType')
export const deleteLightType = (data)=>API.delete(`/lightType/${data}`)