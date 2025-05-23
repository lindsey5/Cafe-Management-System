import { Avatar, Button } from "@mui/material"
import CustomizedTable from "../../../components/table"
import { TableRow } from "@mui/material"
import { StyledTableCell } from "../../../components/table"
import { useEffect, useMemo, useState } from "react"
import Cashier from "../../../ui/admin/cashiers/cashier"
import { deleteData, fetchData } from "../../../services/api"
import { formatDateTime } from '../../../utils/date'

const Cashiers = () => {
    const [showCashier, setShowCashier] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [cashier, setCashier] = useState({
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        confirmPassword: '',
    });
    const [cashiers, setCashiers] = useState([]);

    useEffect(() => {
        const fetchCashiers = async () => {
            const response = await fetchData('/api/user/cashier')
            if(response.success) setCashiers(response.cashiers)
        }

        fetchCashiers()
    }, [])

    const handleClose = () => {
        setCashier({
            username: '',
            firstname: '',
            lastname: '',
            password: '',
            confirmPassword: '',
        })
        setShowCashier(false)
    }

    const handleEdit = (cashier) => {
        setCashier(cashier)
        setShowCashier(true)
    }

    const deleteCashier = async (id) => {
        if(confirm('Are you sure do you want to delete?')){
            const response = await deleteData(`/api/user/${id}`);
            if(response.success) window.location.reload();
        }
    }

    const filteredCashiers = useMemo(() => {
        return cashiers.filter(cashier => cashier.username.includes(searchTerm) || cashier.firstname.includes(searchTerm) || cashier.lastname.includes(searchTerm))
    }, [cashiers, searchTerm])

    return <div className="flex flex-col flex-1 h-screen p-10">
        <Cashier 
            open={showCashier} 
            cashier={cashier} 
            setCashier={setCashier}
            handleClose={handleClose}
        />
        
        <div className="flex justify-between mb-8 gap-10">
            <h1 className="text-[#FF8C00] font-bold text-4xl">Cashiers</h1>
            <input 
                className="max-w-[500px] flex-1 rounded-2xl border-1 
                border-gray-400 outline-none px-6 py-2" 
                placeholder="Search cashier"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
                onClick={() => setShowCashier(true)}
                variant="contained"
                sx={{ backgroundColor: '#FF8C00', height: '35px' }}
            >Add Cashier</Button>
        </div>
        <CustomizedTable
            cols={<TableRow>
                    <StyledTableCell align="left">Username</StyledTableCell>
                    <StyledTableCell align="left">Firstname</StyledTableCell>
                    <StyledTableCell align="left">Lastname</StyledTableCell>
                    <StyledTableCell align="left">Created at</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>}

            rows={filteredCashiers.length > 0 && filteredCashiers.map((cashier, i) => <TableRow key={i}>
                    <StyledTableCell align="left">
                        <div className="flex items-center gap-5">
                            <Avatar src={`data:image/jpeg;base64,${cashier.image}`}/>
                            <p>{cashier.username}</p>
                        </div>
                    </StyledTableCell>
                    <StyledTableCell align="left">{cashier.firstname}</StyledTableCell>
                    <StyledTableCell align="left">{cashier.lastname}</StyledTableCell>
                    <StyledTableCell align="left">{formatDateTime(cashier.created_at)}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Button 
                            sx={{ color: '#FF8C00' }}
                            onClick={() => handleEdit({...cashier, password: ''})}
                        >Edit</Button>
                        <Button 
                            sx={{ color: 'red' }}
                            onClick={() => deleteCashier(cashier.id)}
                        >Delete</Button>
                    </StyledTableCell>
                </TableRow>
                )}
            />
    </div>
}

export default Cashiers