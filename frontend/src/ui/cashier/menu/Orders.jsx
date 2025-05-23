import { IconButton, Button } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useMemo } from "react";
import Receipt from "./Receipt";
import { postData } from "../../../services/api";
import { formatCurrency } from "../../../utils/utils";

const Orders = ({ orders, setOrders}) => {
    const [editable, setEditable] = useState(false);

    const setQuantity = (quantity, index) => {
        setOrders(orders.map((order, i) => (i === index 
            ? { ...order, quantity, total: order.subtotal * quantity} 
            : order)))
    }

    const removeOrder = (index) => {
        if(confirm("Remove this order?")){
            setOrders(orders.filter((order, i) => i !== index))
        }
    }

    const clear = () => {
        setOrders([])
    }

    return  <div className="flex flex-col min-w-[300px] gap-3 w-[30%] border-l-1 border-gray-300 p-5">
                    <h1 className="text-3xl font-bold mb-3">Orders</h1>
                    <div className="flex justify-between">
                        <Button 
                        sx={{ color: '#FF8C00'}} 
                        onClick={() => setEditable(!editable)}
                        >{!editable ? 'Edit' : 'Cancel'}</Button>
                        <Button 
                            sx={{ color: 'red' }} 
                            onClick={clear}
                        >Clear all</Button>
                    </div>
                <div className="flex flex-col flex-grow min-h-0 overflow-y-auto gap-5">
                    {orders.map((order, index) => <div key={index} className="flex gap-1 justify-between items-center">
                        <div className="flex flex-1 gap-3 items-center">
                           {editable && <IconButton onClick={() => removeOrder(index)}>
                                <DeleteIcon />
                            </IconButton>}
                            <img className='w-[80px] h-[70px]' src={`data:image/jpeg;base64,${order.image}`}/>
                            <div>
                                <h2>{order.item_name}</h2>
                                <h2 className="mb-2">{order.size}</h2>
                                <h1>₱{order.total.toFixed(2)}</h1>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex gap-3 items-center">
                                <IconButton 
                                    sx={{ border: 1, padding: 0, width: 25, height: 25}}
                                    disabled={order.quantity === 1}
                                    onClick={() => setQuantity(order.quantity - 1, index)}
                                >
                                    <RemoveIcon fontSize="small"/>
                                </IconButton>
                                <p>{order.quantity}</p>
                                <IconButton 
                                    sx={{ border: 1, padding: 0, width: 25, height: 25}}
                                    onClick={() => setQuantity(order.quantity + 1, index)}
                                >
                                    <AddIcon fontSize="small"/>
                                </IconButton>
                            </div>
                        </div>
                    </div>)}
                </div>
                <OrdersAmount orders={orders} clear={clear} setOrders={setOrders}/>
            </div>
}

export default Orders

const OrdersAmount = ({ orders, setOrders }) => {
    const TAX_RATE = 0.12;
    const [showReceipt, setShowReceipt] = useState(false);

    const subtotal = useMemo(() => {
        return orders.reduce((total, order) => total + order.total, 0);
    }, [orders]);

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    const handlePay = async () => {
        if(confirm('Click ok to continue')){
            const sales = {
                subtotal,
                tax,
                sales: total,
                sales_items: orders
            }
            const response = await postData('/api/sale', sales);
            if(response.success){
                setOrders(response.sales.sales_items)
                setShowReceipt(true)
            }
        }
    }

    const handleClose = () => {
        setShowReceipt(false)
        setOrders([])
    }

    return (
        <div className="w-full p-5">
            <Receipt 
                orders={orders}
                close={handleClose}
                open={showReceipt}
            />
        <table className="w-full">
            <tbody>
            <tr>
                <td className="pb-2">Subtotal</td>
                <td className="pb-2 text-right">{formatCurrency(subtotal)}</td>
            </tr>
            <tr>
                <td className="border-b border-gray-300 pb-2">Tax (12%)</td>
                <td className="border-b border-gray-300 pb-6 text-right">{formatCurrency(tax)}</td>
            </tr>
            <tr>
                <td className="text-2xl font-bold py-8">Total</td>
                <td className="text-2xl font-bold py-8 text-right">{formatCurrency(total)}</td>
            </tr>
            </tbody>
        </table>
        <Button
            variant="contained"
            disabled={orders.length < 1}
            sx={{ backgroundColor: '#FF8C00', width: '100%', color: 'white' }}
            onClick={handlePay}
        >
            Pay
        </Button>
        </div>
    );
};