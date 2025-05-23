import {Outlet } from "react-router-dom"
import { UserContextProvider } from "../contexts/UserContext";
import Sidebar from "../ui/admin/Sidebar";

const AdminLayout = () => {

    return <main className="flex h-screen">
        <UserContextProvider>
            <Sidebar />
            <Outlet />
        </UserContextProvider>
    </main>
}

export default AdminLayout