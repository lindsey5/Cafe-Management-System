import { useEffect, useState } from "react";
import Card from "../../../components/Card"
import { fetchData } from "../../../services/api";
import { formatCurrency } from "../../../utils/utils";

const SalesToday = () => {
   const [total, setTotal] = useState(0);

   useEffect(() => {
        const fetchTotal = async () => {
            const response = await fetchData('/api/sale/cashier/today');
            if(response.success) setTotal(response.total)
        }
        fetchTotal()
   }, [])


    return <Card 
        label="Sales Today"
        value={formatCurrency(total)}
    />
}

export default SalesToday