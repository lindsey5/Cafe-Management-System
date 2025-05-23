import { useEffect, useMemo, useState } from "react"
import { fetchData } from "../../../services/api"
import { Button, IconButton } from "@mui/material"
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const Items = ({ searchTerm, selectedCategory, addOrder }) => {
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

    return <div className="py-5 mt-5 overflow-y-auto flex flex-wrap gap-5 justify-center w-full">
        {filteredItems && filteredItems.map(item => <ItemContainer addOrder={addOrder} key={item.id} item={item} />)}
    </div>
}

export default Items


const ItemContainer = ({ item, addOrder }) => {
    const [selectedSize, setSelectedSize] = useState();
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);

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

    const handleOrder = () => {
        const order = { 
            item_name: item.name, 
            quantity,
            image: item.image,
            subtotal: price,
            size: selectedSize?.size_name, 
            category: item.category.category_name,
            total: quantity * price
        }
        setQuantity(1)
        addOrder(order)
    }

    return <div className="flex flex-col justify-between rounded-md w-[350px] p-5 bg-white border-gray-200 border-1 shadow-lg">
            <div className="flex gap-8">
                <img className="w-[80px] h-[100px]" src={`data:image/jpeg;base64,${item.image}`}/>
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
                </div>
            </div>
            <div className="w-full flex mt-8 gap-8">
                <div className="flex gap-3 items-center">
                    <IconButton 
                        sx={{ border: 1, padding: 0, width: 25, height: 25}}
                        disabled={quantity === 1}
                        onClick={() => setQuantity(quantity - 1)}
                    >
                        <RemoveIcon fontSize="small"/>
                    </IconButton>
                    <p className="">{quantity}</p>
                    <IconButton 
                        sx={{ border: 1, padding: 0, width: 25, height: 25}}
                        onClick={() => setQuantity(quantity + 1)}
                    >
                        <AddIcon fontSize="small"/>
                    </IconButton>
                </div>
                <Button
                    variant="contained"
                    disabled={item.status === "Unavailable"}
                    sx={{ flex: 1, backgroundColor: '#FF8C00', color: 'white'}}
                    onClick={handleOrder}
                >Add</Button>
            </div>

        </div>
}