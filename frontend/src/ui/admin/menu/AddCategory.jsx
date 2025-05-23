import { Button, Modal, TextField } from "@mui/material"
import { useState } from "react"
import { postData } from "../../../services/api";

const AddCategory = ({ open, handleClose}) => {
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addCategory = async () => {
        if(category){
            setLoading(true)
            setError('');
            const response = await postData('/api/category', { category_name: category})
            if(response.success) window.location.reload();
            else setError(response.message)
            setLoading(false)
        }
    }

    return <Modal
        open={open}
        onClose={handleClose}
    >
        <div className="flex flex-col gap-6 fixed top-1/2 left-1/2 transform -translate-1/2 p-10 bg-white rounded-lg">
            <h1 className="text-[#FF8C00] font-bold text-2xl">Add new category</h1>
            {error && <p className="text-red-600">{error}</p>}
            <TextField 
                label="Name"
                value={category}
                disabled={loading}
                onChange={(e) => setCategory(e.target.value)}
            />
           <Button 
                variant="contained"
                disabled={loading}
                sx={{ backgroundColor: '#FF8C00', height: '35px' }}
                onClick={addCategory}
            >Add Category</Button>
        </div>


    </Modal>
}

export default AddCategory