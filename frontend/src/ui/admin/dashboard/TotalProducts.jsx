import { useEffect, useState } from "react";
import Card from "../../../components/Card"
import { fetchData } from "../../../services/api";

const TotalProducts = () => {
   const [total, setTotal] = useState(0);

   useEffect(() => {
        const fetchTotal = async () => {
            const response = await fetchData('/api/item/total');
            if(response.success) setTotal(response.totalItems)
        }
        fetchTotal()
   }, [])


    return <Card 
        label="Total Products"
        value={total}
    />
}

export default TotalProducts