// import { useState } from "react";
import { getAllUsers } from "../../api/userAPI"
// import { getLightType } from "../../api/lightTypeAPI";
import { getLightWatts } from "../../api/lightAPI";
import { getFinishingGoodsHistory } from "../../api/finishingGoodsHistory";
import {handleLogout} from "./logout"

export const fetchUserData = async (setLoading, setUsers, toast, navigate) =>{
    getAllUsers()
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch users";
        toast.error(errorMessage);
        setLoading(false);
        if (err.response && err.response.status === 401) {
          handleLogout(navigate);
        }
      });
}

export const fetchLightWattsData = async (setLightWatts, toast) => {
  try {
    const wattsRes = await getLightWatts();
    setLightWatts(wattsRes.data);
  } catch (err) {
    toast.error(err.message);
  }
};

export const fetchFinishingGoodsHistoryData = async (setLightWatts, toast, setFinishingGoodsHistory) => {
    try {
      const res = await getFinishingGoodsHistory();
      await fetchLightWattsData(setLightWatts, toast);
      setFinishingGoodsHistory(res.data);
    } catch (err) {
      console.error("Error fetching finishing goods history:", err);
      toast.error("Failed to load delivery history");
    }
};