import { useEffect, useMemo, useState } from "react"
import { fetchData, deleteData } from "../../../services/api"
import { Button } from "@mui/material"

const Items = ({ searchTerm, openItem, selectedCategory }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const getItems = async () => {
            const response = await fetchData('/api/item')
            if(response.success) {
                const sizeOrder = ['S', 'M', 'L'];
                setItems(
                    response.items.map(item => ({
                    ...item,
                    sizes: item.sizes.sort(
                    (a, b) => sizeOrder.indexOf(a.size_name) - sizeOrder.indexOf(b.size_name)
                    )
                })))
            }
        }

        getItems();
    }, [])

    const filteredItems = useMemo(() => {
        if(selectedCategory === 'All') return items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        else return items.filter(item => item.category.category_name === selectedCategory)

    }, [selectedCategory, items, searchTerm])

    return <div className="py-5 mt-5 overflow-y-auto flex flex-wrap gap-5  w-full">
        {filteredItems && filteredItems.map(item => <ItemContainer key={item.id} item={item} openItem={openItem}/>)}
    </div>
}

export default Items


const ItemContainer = ({ item, openItem }) => {
    const [selectedSize, setSelectedSize] = useState();
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if(item) {
            if(item.sizes.length > 0){
                setPrice(item.sizes[0].price)
                setSelectedSize(item.sizes[0])
            }else{
                setPrice(item.price)
            }
        }
    }, [item])

    const handleClick = (size) => {
        setPrice(size.price)
        setSelectedSize(size)
    }

    const handleDelete = async () => {
        if(confirm("Are you sure do you want to remove this item?")){
            const response = await deleteData(`/api/item/${item.id}`);
            if(response.success) window.location.reload()
        }
    }

    return <div className="rounded-md flex gap-8 w-[350px] p-5 bg-white border-gray-200 border-1 shadow-lg">
            <img className="w-[90px] h-[120px]" src={`data:image/jpeg;base64,${item.image}`}/>
            <div className="w-full flex flex-col gap-5">
                <div className="flex w-full justify-between gap-2">
                    <h1 className="text-xl font-bold break-works flex-1">{item.name}</h1>
                    <h1 className="text-xl font-bold break-all text-[#FF8C00]">₱{price.toFixed(2)}</h1>
                </div>
                <p className="text-gray-500">{item.category.category_name} / {item.status}</p>
                <div className="flex gap-2 flex-1">
                {item.sizes.map(size => <Button 
                    key={size.id}
                    onClick={() => handleClick(size)}
                    sx={{
                        backgroundColor: selectedSize?.id === size.id ? '#FF8C00' : 'transparent',
                        color: selectedSize?.id === size.id ? 'white' : '#FF8C00',
                        border: 1,
                        minWidth: 0,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        padding: 0,
                        '&:hover': {
                            backgroundColor: '#fdcd92',
                            color: 'white'
                        }
                    }}
                    >
                    {size.size_name}
                </Button>)}
                </div>
                <div className="flex gap-2">
                    <Button 
                        onClick={() => openItem(item)}
                        variant="outlined"
                        sx={{ 
                            color: '#FF8C00', 
                            height: '35px',
                            border: 1,
                            flex: 1,
                            borderColor: '#FF8C00'
                        }}
                    >Edit</Button>
                    <Button 
                        onClick={() => handleDelete(item)}
                        variant="outlined"
                        sx={{ 
                            color: 'red', 
                            height: '35px',
                            border: 1,
                            flex: 1,
                            borderColor: 'red'
                        }}
                    >Remove</Button>
                </div>
            </div>

        </div>
}