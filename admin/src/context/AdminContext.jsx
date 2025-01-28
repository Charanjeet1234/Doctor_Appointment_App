import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) =>
{
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')? localStorage.getItem('aToken'): '')
    const [doctors, setDoctors] = useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL

//  arrow function to get All Doctors
const getAllDoctors = async () =>
{
    try
    {
         const {data} = await axios.post(backendUrl + '/api/admin/all-doctors',{}, {headers: {aToken}});
         if(data.success)
         {
            console.log(data.doctor)
            setDoctors(data.doctor)
            
         }
         else
         {
            toast.error(data.message)
         }

    }
    catch(error)
    {
        toast.error(error.message)
        console.error(error)
    }
}

// Chnage doctor availablity with api

const changeAvailability = async (docId) =>
{
    try{
        const {data} = await axios.post(backendUrl + '/api/admin/change-availablity', {docId}, {headers: {aToken}})
        if(data.success)
        {
            toast.success(data.message)
            getAllDoctors() // Update the data if the availablity change
        }
        else{
            toast.error(data.message)
        }
    }
    catch(error)
    {
        toast.error(error.message)
        console.error(error)
    }
}
    const value = {
       aToken, 
       setAToken, 
       backendUrl,
       doctors,
       getAllDoctors,
       changeAvailability
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider