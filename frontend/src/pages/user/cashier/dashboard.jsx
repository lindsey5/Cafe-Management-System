import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState, useEffect, Suspense, lazy } from 'react';
import { fetchData } from '../../../services/api';
import CardSkeleton from '../../../components/CardSkeleton';
import { formatCurrency } from '../../../utils/utils';

const TotalProducts = lazy(() => import('../../../ui/admin/dashboard/TotalProducts'));
const SalesToday = lazy(() => import('../../../ui/cashier/dashboard/SalesToday'));
const SalesThisYear = lazy(() => import('../../../ui/cashier/dashboard/SalesThisYear'));
const TotalProductsSold = lazy(() => import('../../../ui/cashier/dashboard/TotalProductsSold'))

const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const CashierDashboard = () => {
    
    return <div className="bg-gray-100 flex flex-col flex-1">
        <div className='w-full p-10 bg-white border-b border-gray-300'>
             <h1 className="text-[#FF8C00] font-bold text-4xl">Dashboard</h1>
        </div>
        <div className='w-full px-10 py-5 flex flex-col gap-10'>
            <div className="gap-10 grid grid-cols-4">
                <Suspense fallback={<CardSkeleton />}>
                    <SalesToday />
                </Suspense>
                <Suspense fallback={<CardSkeleton />}>
                    <TotalProducts />
                </Suspense>
                <Suspense fallback={<CardSkeleton />}>
                    <TotalProductsSold />
                </Suspense>
                <Suspense fallback={<CardSkeleton />}>
                    <SalesThisYear />
                </Suspense>
            </div>
            <div className='grid grid-cols-[2fr_1fr] gap-10'>
                <MonthlySales />
                <TopProducts />
            </div>
        </div>
    </div>
}

export default CashierDashboard

const MonthlySales = () => {
    const [sales, setSales] = useState([])

    useEffect(() => {
        const fetchMonthlySales = async () => {
            const response = await fetchData('/api/sale/cashier/month'); 
            if(response.success){
                const monthlySales = response.monthlySales;
                const formattedData = monthLabels.map((label, index) => ({
                        month: label,
                        total: monthlySales.find(sales => sales.month === index + 1)?.total || 0,
                        color: 'red'
                    })
                );

                setSales(formattedData);
                };
            }

        fetchMonthlySales();
    }, []);

    return <div className='bg-white shadow-md shadow-gray-300 rounded-md'>
        <BarChart
            dataset={sales}
            xAxis={[{ dataKey: 'month' }]}
            series={[{ dataKey: 'total', label: 'Your Monthly Sales' }]}
            height={350}
            colors={['#FF8C00']}
            grid={{ horizontal: true }}
        />
    </div>
}

const TopProducts = () => {
    const [items, setItems] = useState([]);


    useEffect(() => {
        const fetchTopProducts = async () => {
            const response = await fetchData('/api/item/top')
            if(response.success) setItems(response.topItems.map(item => ({ value: item.totalSales, label: item.itemName})))
        }

        fetchTopProducts()
    }, []);

    const valueFormatter = (item) => formatCurrency(item.value)

    const data = {
        data: items,
        valueFormatter,
    };

    return <div className='p-6 bg-white shadow-md shadow-gray-300 rounded-md flex flex-col items-center'>
        <h1>Top 10 Products</h1>
        <PieChart
            series={[ data ]}
            width={200}
            height={200}
        />
    </div>
}