import { API } from "./userAPI";

export const createFinishingGoodsHistory = ( Data, distributor )=> API.post('/finishingGoodsHistory',  Data, { params: { distributor } });
export const getFinishingGoodsHistory = () => API.get('/getFinishingGoodsHistory')