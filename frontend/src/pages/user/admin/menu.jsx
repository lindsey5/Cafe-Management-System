import { Button, TextField } from "@mui/material"
import Categories from "../../../ui/admin/menu/Categories"
import { useState } from "react"
import AddCategory from "../../../ui/admin/menu/AddCategory";
import Item from "../../../ui/admin/menu/Item";
import Items from "../../../ui/admin/menu/Items";
import SearchField from "../../../components/SearchField";

const Menu = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showItem, setShowItem] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [item, setItem] = useState({
        name: '',
        price: null,
        image: null,
        category_id: '',
        status: 'Available',
        sizes: []
    })

    const handleClose = () => {
        setShowItem(false)
        setItem({
            name: '',
            price: null,
            image: null,
            category_id: '',
            status: 'Available',
            sizes: []
        })
    }

    const openItem = (item) => {
        const { image, ...rest } = item
        const imageSrc = `data:image/jpeg;base64,${image}`
        setShowItem(true)
        setItem({...rest, image: imageSrc})
    }

    const handleSearch = (newValue) => {
        setSelectedCategory('All')
        setSearchTerm(newValue)
    }

    return <div className="flex flex-col flex-1 h-screen p-10">
        <div className="flex justify-between mb-8 gap-10">
                <h1 className="text-[#FF8C00] font-bold text-4xl">Menu</h1>
                <SearchField searchTerm={searchTerm} setSearchTerm={handleSearch}/>
                <div className="flex gap-5">
                    <Button 
                        variant="contained"
                        onClick={() => setShowAddCategory(true)}
                        sx={{ 
                            backgroundColor: 'white', 
                            color: 'black', 
                            height: '35px',
                            border: 1,
                        }}
                    >Add Category</Button>
                    <Button 
                        variant="contained"
                        onClick={() => setShowItem(true)}
                        sx={{ backgroundColor: '#FF8C00', height: '35px' }}
                    >Add item</Button>
                </div>
        </div>
        <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
        <Items searchTerm={searchTerm} openItem={openItem} selectedCategory={selectedCategory}/>
        <AddCategory open={showAddCategory} handleClose={() => setShowAddCategory(false)}/>
        <Item 
            item={item}
            setItem={setItem}
            open={showItem} 
            handleClose={handleClose}
        />
    </div>
}

export default Menu