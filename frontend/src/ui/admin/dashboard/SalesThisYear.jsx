import { useEffect, useState } from "react";
import Card from "../../../components/Card"
import { fetchData } from "../../../services/api";
import { formatCurrency } from "../../../utils/utils";

const SalesThisYear = () => {
   const [total, setTotal] = useState(0);

   useEffect(() => {
        const fetchTotal = async () => {
            const response = await fetchData('/api/sale/year');
            if(response.success) setTotal(response.total)
        }
        fetchTotal()
   }, [])


    return <Card 
        label="Sales this year"
        value={formatCurrency(total)}
    />
}

export default SalesThisYear