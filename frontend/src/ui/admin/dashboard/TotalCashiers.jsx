
import { useEffect, useState } from "react";
import Card from "../../../components/Card"
import { fetchData } from "../../../services/api";

const TotalCashiers = () => {
   const [total, setTotal] = useState(0);

   useEffect(() => {
        const fetchTotal = async () => {
            const response = await fetchData('/api/user/total?role=Cashier');
            if(response.success) setTotal(response.total)
        }
        fetchTotal()
   }, [])


    return <Card 
        label="Total Cashiers"
        value={total}
    />
}

export default TotalCashiers