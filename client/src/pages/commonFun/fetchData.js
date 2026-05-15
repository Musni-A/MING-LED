import { useState } from "react";
import { getAllUsers } from "../../api/userAPI"

export const fetchUserData = async (setLoading, setUsers, toast) =>{
    getAllUsers()
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch users";
        toast.error(errorMessage);
        setLoading(false);
      });
}