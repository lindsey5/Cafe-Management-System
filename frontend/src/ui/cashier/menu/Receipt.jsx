import { useContext, useMemo, useRef } from "react";
import html2pdf from "html2pdf.js";
import { Button, Modal } from "@mui/material";
import { formatDateTime } from "../../../utils/date";
import { UserContext } from "../../../contexts/UserContext";
import { formatCurrency } from "../../../utils/utils";

const Receipt = ({ open, close, orders }) => {
    const receiptRef = useRef();
    const { user } = useContext(UserContext)

    const subtotal = useMemo(() => orders.reduce((total, order) => total + order.total, 0), [orders]);

    const tax = subtotal * 0.12;
    const grandTotal = subtotal + tax;

    const handleDownloadPDF = () => {
        const element = receiptRef.current;
        if (!element) return;

        const clonedElement = element.cloneNode(true);

        // Inject fallback CSS for PDF compatibility
        const style = document.createElement("style");
        style.textContent = `
            * {
                color: black !important;
                background-color: white !important;
                border-color: black !important;
            }
        `;
        clonedElement.prepend(style);

        const container = document.createElement("div");
        container.style.padding = "20px";
        container.style.background = "white";
        container.appendChild(clonedElement);
        document.body.appendChild(container);
        

        html2pdf()
            .set({
                margin: 0.5,
                filename: "receipt.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "in", orientation: "portrait" },
            })
            .from(container)
            .save()
            .then(() => {
                document.body.removeChild(container);
            })
            .catch(err => console.error('PDF generation error:', err));
    };



    return <Modal 
            sx={{ 
                overflowY: "auto",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingY: 5,

            }} 
            open={open} 
            onClose={close}
        >   
            <div className="w-[430px] bg-white p-10 rounded-lg">                   
                <div className="bg-white flex flex-col gap-2" ref={receiptRef}>
                    <div className="w-full flex flex-col items-center gap-3 mb-4 mb-5">
                        <img className="w-40 h-20" src="/logo.png" alt="" />
                        <p>Taguig City, Philippines</p>
                        <p>+1234567890</p>
                    </div>
                    <p>Cashier: {user?.firstname} {user?.lastname}</p>
                    <p>Date: {formatDateTime(new Date())}</p>
                    <table className="w-full border-t border-gray-300">
                        <thead>
                            <tr>
                                <th className="text-left pt-6 pb-2">Item</th>
                                <th className="text-center pt-6 pb-2">Qty</th>
                                <th className="text-right pt-6 pb-2">Price</th>
                                <th className="text-right pt-6 pb-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                        {orders.map((order, index) => (
                            <tr key={index}>
                                <td className="py-3">{order.item_name}</td>
                                <td className="text-center">{order.quantity}</td>
                                <td className="text-right">{formatCurrency(order.subtotal)}</td>
                                <td className="text-right">{formatCurrency(order.total)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <table className="w-full mt-8 border-t border-gray-300">
                        <tbody>
                            <tr>
                                <td className="py-2">Subtotal</td>
                                <td className="py-2 text-right">{formatCurrency(subtotal)}</td>
                            </tr>
                            <tr>
                                <td className="py-2">Tax (12%)</td>
                                <td className="py-2 text-right">{formatCurrency(tax)}</td>
                            </tr>
                            <tr>
                                <td className="pt-4 text-xl font-bold">Total</td>
                                <td className="pt-4 text-xl font-bold text-right">{formatCurrency(grandTotal)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Button 
                    onClick={handleDownloadPDF}
                    sx={{ marginTop: 5, width: '100%', backgroundColor: '#FF8C00'}}
                    variant="contained"
                >Print Receipt</Button>
            </div>
        </Modal>
};

export default Receipt;