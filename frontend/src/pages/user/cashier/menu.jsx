import { useState } from "react"
import Categories from "../../../ui/cashier/menu/Categories"
import Items from "../../../ui/cashier/menu/Items";
import SearchField from "../../../components/SearchField";
import Orders from "../../../ui/cashier/menu/Orders";


const Menu = () => {
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);

    const addOrder = (order) => {
        const existedOrder = orders.findIndex(o => 
            o.item_name === order.item_name && 
            o.size === order.size
        );

        if (existedOrder === -1) {
            setOrders([...orders, order]); 
        } else {

            const updatedOrders = orders.map((o, i) =>
                i === existedOrder ? { ...o, 
                    quantity: o.quantity + order.quantity, 
                    total:  (o.quantity + order.quantity) * order.subtotal
                } : o
            );
            setOrders(updatedOrders);
        }
    };

    const handleSearch = (newValue) => {
        setSelectedCategory('All')
        setSearchTerm(newValue)
    }

    return <div className="flex flex-1 h-screen"> 
            <div className="flex flex-col flex-1 p-10">
                <div className="flex justify-between mb-8 gap-10">
                    <h1 className="text-[#FF8C00] font-bold text-4xl">Menu</h1>
                    <SearchField setSearchTerm={handleSearch} searchTerm={searchTerm}/>
                </div>
                <Categories 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory}
                />
                <Items 
                    searchTerm={searchTerm}
                    addOrder={addOrder}
                    selectedCategory={selectedCategory}
                />
            </div>
            <Orders setOrders={setOrders} orders={orders}/>

    </div>
}

export default Menu
