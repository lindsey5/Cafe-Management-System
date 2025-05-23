import { createContext, useEffect, useState } from "react";
import { fetchData } from "../services/api";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    const navigate = useNavigate();
    
    useEffect(() => {
        const getUserAsync = async () => {
            const response = await fetchData('/api/user')

            if(response.success){
                if (response.user.role === 'Admin') setUser(response.user) 
                else if(response.user.role === 'Cashier') setUser(response.user)    
            }else{
                navigate('/', { replace: true })
            }
        }

        getUserAsync();
    }, [])
  
    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )
};