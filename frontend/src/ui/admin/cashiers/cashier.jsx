import { Modal, TextField, Button } from "@mui/material"
import { useEffect, useState } from "react"
import { postData, updateData } from "../../../services/api";

const Cashier = ({ open, handleClose, cashier, setCashier }) => {
    const [error, setError] = useState('');

    useEffect(() => {
        return () => setError('')
    }, [cashier])

    const handleSave = async () => {
        setError('')
        if(!cashier.username) setError('Username is required.')
        else if(!cashier.firstname) setError('Firstname is required.')
        else if(!cashier.lastname) setError('Lastname is required.')
        else if(!cashier.password && !cashier?.id) setError('Password is required.')
        else if(cashier.password !== cashier.confirmPassword && !cashier?.id) setError('Password doesn\'t matched')
        else {
            if(confirm('Save cashier?')){
                await cashier.id ? updateCashier() : addCashier()
            }
        }
    }

    const addCashier = async () => {
        const response = await postData('/api/auth/signup', {...cashier, role: 'Cashier'});
        if(response.success) window.location.reload()
        else setError(response.message)
    }

    const updateCashier = async () => {
        const response = await updateData(`/api/user/${cashier.id}`,cashier)
        if(response.success) window.location.reload()
        else setError(response.message)
    }
    
    return <Modal onClose={handleClose} open={open}>
        <div className="w-[400px] flex flex-col gap-5 fixed top-1/2 left-1/2 transform -translate-1/2 p-10 bg-white rounded-lg">
            <h1 className="text-[#FF8C00] font-bold text-2xl">{cashier?.id ? 'Update cashier' : 'Add new cashier'}</h1>
            {error && <p className="text-red-600">{error}</p>}
            <TextField 
                value={cashier?.username}
                label="Username"
                onChange={(e) => setCashier({...cashier, username: e.target.value})}
            />
            <TextField 
                value={cashier?.firstname}
                label="Firstname"
                onChange={(e) => setCashier({...cashier, firstname: e.target.value})}
            />
            <TextField 
                value={cashier?.lastname}
                label="Lastname"
                onChange={(e) => setCashier({...cashier, lastname: e.target.value})}
            />
            <TextField 
                value={cashier?.password}
                label="Password"
                type="password"
                onChange={(e) => setCashier({...cashier, password: e.target.value})}
            />
            <TextField 
                value={cashier?.confirmPassword}
                label="Confirm Password"
                type="password"
                onChange={(e) => setCashier({...cashier, confirmPassword: e.target.value})}
            />
            <Button 
                onClick={handleSave}
                sx={{ backgroundColor: '#FF8C00', color: 'white', borderRadius: 20}}
            >Save</Button>
            <Button 
                onClick={handleClose}
                sx={{ 
                    color: 'red', 
                    px: 2,
                    border: 1, 
                    borderColor: 'red', 
                    borderRadius: 20,
                    fontSize: 15
                }}
            >Cancel</Button>
        </div>
    </Modal>
}

export default Cashier