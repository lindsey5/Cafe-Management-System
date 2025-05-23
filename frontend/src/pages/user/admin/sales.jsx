import { Avatar, Button } from "@mui/material"
import CustomizedTable from "../../../components/table"
import { TableRow } from "@mui/material"
import { StyledTableCell } from "../../../components/table"
import { useEffect, useState } from "react"
import { fetchData } from "../../../services/api"
import { formatDateTime } from '../../../utils/date'
import { formatCurrency } from "../../../utils/utils"
import { Pagination } from "@mui/material"
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from "dayjs"
import { formatDate } from "../../../utils/date"

const Sales = () => {
    const [page, setPage] = useState(1)
    const [sales, setSales] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchSales = async () => {
        const response = await fetchData(`/api/sale?page=${page}&searchTerm=${searchTerm}&limit=500${startDate ? `&start_date=${formatDate(startDate)}` : ''}${endDate ? `&end_date=${formatDate(endDate)}` : ''}`)
        if(response.success) {
            setSales(response.sales)
            setTotalPages(response.totalPages)
        }
    }

    const handleChange = (value) => {
        if(value[0]) setStartDate(value[0].$d)
        if(value[1]) setEndDate(value[1].$d)
    }

    const generateCSV = () => {
        const csvRows = [];
        const headers = ['Order number', 'Cashier', 'Date', 'Subtotal', 'Tax', 'Total'];
        csvRows.push(headers.join(',')); // Add header row
    
        // Add data rows
        sales.forEach(row => {
          const values = [row.id, `${row.cashier.firstname} ${row.cashier.lastname}`, formatDateTime(row.date_time), row.subtotal, row.tax, row.sales]
          csvRows.push(values);
        });
        csvRows.push(['Total', sales.reduce((total, sale) => total + sale.sales, 0)]);
        // Create a Blob from the CSV string
        const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);
    
        // Create a link to download the CSV
        const link = document.createElement('a');
        link.href = csvUrl;
        link.download = 'sales_report.csv';
        link.click();
    };

    useEffect(() => {
        const fetch = setTimeout(() => {
            fetchSales()
        }, 300)
      
        return () => clearTimeout(fetch)
    }, [searchTerm, page, startDate, endDate])

    const resetDate = () => {
        setStartDate(null)
        setEndDate(null)
    }

    return <div className="flex flex-col flex-1 h-screen p-10">
        
        <div className="flex justify-between mb-8 gap-10 items-center">
            <h1 className="text-[#FF8C00] font-bold text-4xl">Sales</h1>
            <input 
                className="max-w-[500px] flex-1 rounded-2xl border-1 
                border-gray-400 outline-none px-6 py-2" 
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
             <div className="flex gap-2 items-center">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateRangePicker']}>
                        <DateRangePicker onChange={handleChange} value={[dayjs(startDate) || '', dayjs(endDate) || '']}/>
                    </DemoContainer>
                </LocalizationProvider>
                <Button 
                    onClick={resetDate}
                    sx={{ color: 'red', height: '35px' }}
                >Reset Date</Button>
            </div>
            <Button 
                onClick={generateCSV}
                variant="contained"
                sx={{ backgroundColor: '#FF8C00', height: '35px' }}
            >Export</Button>
        </div>
        <CustomizedTable
            cols={<TableRow sx={{ position: "sticky", top: 0, zIndex: 5}}>
                    <StyledTableCell align="center">Order number</StyledTableCell>
                    <StyledTableCell align="center">Cashier</StyledTableCell>
                    <StyledTableCell align="center">Date</StyledTableCell>
                    <StyledTableCell align="center">Subtotal</StyledTableCell>
                    <StyledTableCell align="center">Tax</StyledTableCell>
                    <StyledTableCell align="center">Total</StyledTableCell>
                </TableRow>}

            rows={sales.length > 0 && sales.map((sale, i) => <TableRow key={i}>
                    <StyledTableCell align="center">{sale.id}</StyledTableCell>
                    <StyledTableCell align="center">
                        <div className="flex items-center justify-center gap-5">
                            <Avatar src={`data:image/jpeg;base64,${sale.cashier.image}`}/>
                            <p>{sale.cashier.firstname} {sale.cashier.lastname}</p>
                        </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">{formatDateTime(sale.date_time)}</StyledTableCell>
                    <StyledTableCell align="center">{formatCurrency(sale.subtotal)}</StyledTableCell>
                    <StyledTableCell align="center">{formatCurrency(sale.tax)}</StyledTableCell>
                    <StyledTableCell align="center">{formatCurrency(sale.sales)}</StyledTableCell>
                </TableRow>
                )}
            />
        <div className="mt-10 flex justify-between">
            <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(e, value) => setPage(value)} 
            />
            <h1 className="font-bold text-xl">Total: {formatCurrency(sales.reduce((total, sale) => sale.sales + total, 0))}</h1>
        </div>
    </div>
}

export default Sales