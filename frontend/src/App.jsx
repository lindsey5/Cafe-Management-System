import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/user/admin/dashboard";
import Menu from "./pages/user/admin/menu";
import CashierMenu from './pages/user/cashier/menu'
import CashierLayout from "./layouts/CashierLayout";
import CashierDashboard from "./pages/user/cashier/dashboard";
import Sales from "./pages/user/admin/sales";
import CashierSales from './pages/user/cashier/sales'
import Account from "./pages/user/Account";
import Users from "./pages/user/admin/users";

function App() {
  return <BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />}/>
    <Route path="/admin" element={<AdminLayout/>}>
      <Route index element={<Dashboard />} />
      <Route path="menu" element={<Menu />} />
      <Route path="sales" element={<Sales />} />
      <Route path="users" element={<Users />} />
       <Route path="account" element={<Account />}/>
    </Route>
    <Route path="/cashier" element={<CashierLayout />}>
      <Route index element={<CashierDashboard />}/>
      <Route path="menu" element={<CashierMenu />} />
      <Route path="sales" element={<CashierSales />} />
      <Route path="account" element={<Account />}/>
    </Route>
  </Routes>
  </BrowserRouter>
}

export default App