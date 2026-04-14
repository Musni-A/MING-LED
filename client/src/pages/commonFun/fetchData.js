import { getAllUsers } from "../../api/userAPI"

export const fetchData = async () =>{
    getAllUsers().then((res)=>{
        localStorage.setItem('users', JSON.stringify(res.data))
    }).catch((err)=>{
        console.log(err)
    })
}