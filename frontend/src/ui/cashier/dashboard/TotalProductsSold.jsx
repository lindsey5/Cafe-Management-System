import { useEffect, useState } from "react";
import Card from "../../../components/Card"
import { fetchData } from "../../../services/api";

const TotalProductsSold = () => {
   const [total, setTotal] = useState(0);

   useEffect(() => {
        const fetchTotal = async () => {
            const response = await fetchData('/api/item/cashier/total');
            if(response.success) setTotal(response.total)
        }
        fetchTotal()
   }, [])


    return <Card 
        label="Products sold this month"
        value={total}
    />
}

export default TotalProductsSold