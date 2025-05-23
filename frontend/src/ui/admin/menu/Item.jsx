import { Button, IconButton, Modal, TextField, Select, MenuItem, FormControl, InputLabel} from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import {  fetchData, postData, updateData } from "../../../services/api";

const Item = ({ open, handleClose, item, setItem}) => {
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const getCategories = async () =>{
            const response = await fetchData('/api/category')
            if(response.success) setCategories(response.categories)
        }
        getCategories()
    }, [])

    useEffect(() => {
        return () => setError('')
    }, [item])

    const handleSave = async () => {
        setError('')
        if(!item.name) setError('Name is required')
        else if(!item.category_id) setError('Category is required')
        else if(!item.price && item.sizes.length === 0) setError('Price is required')
        else if(!item.image) setError('Image is required')
        else if(item.sizes.find(size => !size.size_name)) setError('Size is required')
        else if(item.sizes.find(size => !size.price)) setError('Size price is required')
        else {
            if(item.sizes.length > 0) item.price = null;
            const { image, ...rest } = item 
            const imageBase64 = image.split(',')[1]
            
            if(confirm('Save item?')) !item.id ? addItem({...rest, image: imageBase64}) : updateItem({...rest, image: imageBase64});
        }
    }

    const updateItem = async (item) => {
        const response = await updateData(`/api/item/${item.id}`, item)
        if(response.success) window.location.reload();
        else setError(response.message)
    }

    const addItem = async (item) => {
        const response = await postData('/api/item', item)
        
        if(response.success) window.location.reload();
        else setError(response.message)
    }

    const addSize = () => {
        if(item.sizes.length < 3) setItem({...item, sizes: [...item.sizes, { size_name: '', price: ''}] })
    }

    const removeSize = (index) => {
        setItem({...item, sizes: item.sizes.filter((size, i) => i !== index)})
    }

    const handleSize = (newValue, index) => {
        setItem({...item, sizes: item.sizes.map((size, i) => {
            return i === index ? {...size, size_name: newValue} : size
        } )})
    }

    const handlePrice = (newValue, index) => {
        setItem({...item, sizes: item.sizes.map((size, i) => {
            return i === index ? {...size, price: newValue} : size
        } )})
    }

    const handleFiles = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setItem(prev => ({
                    ...prev,
                    image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    }

    return <Modal open={open} onClose={handleClose}>
        <div className="w-[450px] h-[95%] overflow-y-auto flex flex-col gap-6 fixed top-1/2 left-1/2 transform -translate-1/2 px-10 py-5 bg-white rounded-lg">
            <h1 className="text-[#FF8C00] font-bold text-2xl">{item?.id ? 'Update item' : 'Add new item'}</h1>
            <p className="text-red-400">{error}</p>
            <div className="flex flex-col gap-5 items-center">
                <img className="w-[80px] h-[80px]" src={item?.image} />
                <Button 
                    sx={{ color: '#FF8C00', border: 1, borderColor: '#FF8C00', borderRadius: 20}}
                    component="label"
                >
                    <input
                        type="file"
                        onChange={handleFiles}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    Upload image
                </Button>
            </div>
            <TextField 
                value={item?.name}
                label="Name"
                onChange={(e) => setItem({...item, name: e.target.value})}
            />
            <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                    value={item.category_id}
                    label="Size"
                    onChange={(e) => setItem({...item, category_id: e.target.value})}
                >
                    {categories.map(category => <MenuItem key={category.id} value={category.id}>
                            {category.category_name}
                    </MenuItem>)}    
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                    value={item.status}
                    label="Size"
                    onChange={(e) => setItem({...item, status: e.target.value})}
                >
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Unavailable">Unavailable</MenuItem>
                </Select>
            </FormControl>
            {item?.sizes.length === 0 && <TextField 
                value={item?.price || ''}
                label="Price"
                type="number"
                onChange={(e) => setItem({...item, price: e.target.value})}
            />}
            <div className="flex justify-between items-center">
                <h1 className="text-[#3c3c3c]">Sizes:</h1>
                {item?.sizes.length < 3 && <Button 
                    onClick={addSize}
                    sx={{ 
                        color: '#FF8C00', 
                        px: 2,
                        border: 1, 
                        borderColor: '#FF8C00', 
                        borderRadius: 20,
                        fontSize: 15
                    }}
                    >+ Add size</Button>}
            </div>
            {item.sizes.map((size, i) => (
                <div className="flex gap-5" key={i}>
                <FormControl sx={{ flex: 1}}>
                    <InputLabel>Size</InputLabel>
                    <Select
                        value={size.size_name}
                        label="Size"
                        onChange={(e) => handleSize(e.target.value, i)}
                    >
                    {['S', 'M', 'L']
                        .filter((s) => 
                        !item.sizes.some((sz, index) => sz.size_name === s && index !== i)
                        )
                        .map((s) => (
                        <MenuItem key={s} value={s}>
                            {s}
                        </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                    <TextField 
                        value={size.price} 
                        type="number" 
                        label="Price" 
                        onChange={(e) => handlePrice(e.target.value, i)}
                    />
                    <IconButton onClick={() => removeSize(i)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ))}
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

export default Item