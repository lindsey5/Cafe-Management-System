import SidebarButton from "../../components/SidebarButton"
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LocalCafeRoundedIcon from '@mui/icons-material/LocalCafeRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Avatar } from "@mui/material";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { signout } from "../../utils/auth";

const Sidebar = () =>{
     const pathname = useLocation().pathname;
     const navigate = useNavigate();
     const { user } = useContext(UserContext)

    return <aside className="w-[250px] flex flex-col h-full border-r-1 border-gray-300 py-10 px-5">
        <img className="w-full" src="/logo.png"/>
        <div className="flex-1 flex flex-col mt-10 justify-between">
            <div className="flex flex-col gap-2">
                <SidebarButton
                    sx={{ ...pathname === '/admin' && { color: '#FF8C00'}}}
                    onClick={() => navigate('/admin')}
                >
                    <DashboardRoundedIcon sx={{ width: 35, height: 35}}/> Dashboard
                </SidebarButton>
                <SidebarButton
                    sx={{ ...pathname === '/admin/menu' && { color: '#FF8C00'}}}
                    onClick={() => navigate('/admin/menu')}
                >
                    <LocalCafeRoundedIcon sx={{ width: 35, height: 35}}/> Menu
                </SidebarButton>
                <SidebarButton
                    sx={{ ...pathname === '/admin/sales' && { color: '#FF8C00'}}}
                    onClick={() => navigate('/admin/sales')}
                >
                    <AttachMoneyRoundedIcon sx={{ width: 35, height: 35}}/> Sales
                </SidebarButton>
                <SidebarButton
                    sx={{ ...pathname === '/admin/cashiers' && { color: '#FF8C00'}}}
                    onClick={() => navigate('/admin/cashiers')}
                >
                    <PersonRoundedIcon sx={{ width: 35, height: 35}}/> Cashiers
                </SidebarButton>
                <SidebarButton
                    sx={{ ...pathname === '/admin/account' && { color: '#FF8C00'}}}
                    onClick={() => navigate('/admin/acount')}
                >
                    <SettingsIcon sx={{ width: 35, height: 35}}/> Account
                </SidebarButton>
                <SidebarButton onClick={signout}>
                    <LogoutRoundedIcon sx={{ width: 35, height: 35}}/> Sign out
                </SidebarButton>
            </div>
            <div className="items-center flex flex-col gap-3 border-1 border-gray-300 p-2">
                <Avatar src={user?.image} sx={{ width: 45, height: 45}}/>
                <p className="font-bold text-[#3c3c3c] text-xl break-all">{user?.firstname} {user?.lastname}</p>
                <p className="text-gray-500 break-all">{user?.role}</p>
            </div>
        </div>
    </aside>
}

export default Sidebar