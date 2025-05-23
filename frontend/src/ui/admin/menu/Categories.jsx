import { useEffect, useState } from "react"
import { deleteData, fetchData } from "../../../services/api";
import { Chip } from "@mui/material";

const Categories = ({ selectedCategory, setSelectedCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetchData('/api/category');
            if(response.success) setCategories(response.categories)
        }
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if(confirm('Are you sure you want to remove?')){
            const response = await deleteData(`/api/category/${id}`);
            console.log(response)
            if(response.success) window.location.reload(); 
        }
    }

    return <div className="flex gap-3 w-full">
            <Chip
                label="All"
                onClick={() => setSelectedCategory('All')}
                variant={selectedCategory === 'All' ? 'filled' : 'outlined'}
                sx={[{ width: 100, fontSize: 18}, selectedCategory === 'All' && {
                    backgroundColor: '#FF8C00',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#e67300',
                    },
                    '& .MuiChip-deleteIcon': {
                        color: 'white'
                    }
                }]}
            />
        {categories.map(category => (
            <Chip
                key={category.id} 
                label={category.category_name}
                onClick={() => setSelectedCategory(category.category_name)}
                variant={selectedCategory === category.category_name ? 'filled' : 'outlined'}
                onDelete={() => handleDelete(category.id)} 
                sx={[
                { fontSize: 18 },
                selectedCategory === category.category_name && {
                    backgroundColor: '#FF8C00',
                    color: 'white',
                    '&:hover': {
                    backgroundColor: '#e67300',
                    },
                    '& .MuiChip-deleteIcon': {
                    color: 'white',
                    },
                },
                ]}
            />
            ))}
    </div>
}

export default Categories