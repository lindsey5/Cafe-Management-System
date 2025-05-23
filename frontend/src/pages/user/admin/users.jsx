import { Avatar, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material"
import CustomizedTable from "../../../components/table"
import { TableRow } from "@mui/material"
import { StyledTableCell } from "../../../components/table"
import { useEffect, useMemo, useState } from "react"
import { deleteData, fetchData } from "../../../services/api"
import { formatDateTime } from '../../../utils/date'
import UserModal from "../../../ui/admin/UserModal"
import ConfirmDialog from "../../../components/ConfirmDialog"
import { confirmUpdate } from "../../../utils/utils"

const Users = () => {
    const [showUserModal, setShowUserModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState({
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        confirmPassword: '',
    });
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState();
    const [role, setRole] = useState('Cashier');

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetchData(`/api/user/users?role=${role}`);
            if (response.success) setUsers(response.users); 
        };

        fetchUsers();
    }, [role]);

    const handleClose = () => {
        setUser({
            username: '',
            firstname: '',
            lastname: '',
            password: '',
            confirmPassword: '',
        });
        setShowUserModal(false);
    };

    const handleEdit = (userData) => {
        setUser(userData);
        setShowUserModal(true);
    };

    const deleteUser = async () => {
        const response = await deleteData(`/api/user/${userId}`);
        if (response.success) window.location.reload();
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.username.includes(searchTerm) ||
            user.firstname.includes(searchTerm) ||
            user.lastname.includes(searchTerm)
        );
    }, [users, searchTerm]);

    return (
        <div className="flex flex-col flex-1 h-screen p-10">
            <UserModal
                open={showUserModal}
                user={user}
                setUser={setUser}
                handleClose={handleClose}
            />
            <ConfirmDialog 
                message="Are you sure you want to delete?"
                open={userId}
                onCancel={() => setUserId()}
                onConfirm={() => {
                    confirmUpdate(deleteUser)
                    setUserId();
                }}
            />
            <div className="flex justify-between mb-8 gap-10">
                <h1 className="text-[#FF8C00] font-bold text-4xl">Users</h1>
                <input
                    className="max-w-[500px] flex-1 rounded-2xl border-1 border-gray-400 outline-none px-6 py-2"
                    placeholder="Search user"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FormControl sx={{ width: 120}}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={role}
                        label="Role"
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Cashier">Cashier</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    onClick={() => setShowUserModal(true)}
                    variant="contained"
                    sx={{ backgroundColor: '#FF8C00', height: '35px' }}
                >
                    Add User
                </Button>
            </div>

            <CustomizedTable
                cols={
                    <TableRow>
                        <StyledTableCell align="left">Username</StyledTableCell>
                        <StyledTableCell align="left">Firstname</StyledTableCell>
                        <StyledTableCell align="left">Lastname</StyledTableCell>
                        <StyledTableCell align="left">Role</StyledTableCell>
                        <StyledTableCell align="left">Created at</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                }

                rows={
                    filteredUsers.length > 0 &&
                    filteredUsers.map((user, i) => (
                        <TableRow key={i}>
                            <StyledTableCell align="left">
                                <div className="flex items-center gap-5">
                                    <Avatar src={`data:image/jpeg;base64,${user.image}`} />
                                    <p>{user.username}</p>
                                </div>
                            </StyledTableCell>
                            <StyledTableCell align="left">{user.firstname}</StyledTableCell>
                            <StyledTableCell align="left">{user.lastname}</StyledTableCell>
                            <StyledTableCell align="left">{user.role}</StyledTableCell>
                            <StyledTableCell align="left">{formatDateTime(user.created_at)}</StyledTableCell>
                            <StyledTableCell align="center">
                                <Button
                                    sx={{ color: '#FF8C00' }}
                                    onClick={() => handleEdit({ ...user, password: '' })}
                                >
                                    Edit
                                </Button>
                                <Button
                                    sx={{ color: 'red' }}
                                    onClick={() => setUserId(user.id)}
                                >
                                    Delete
                                </Button>
                            </StyledTableCell>
                        </TableRow>
                    ))
                }
            />
        </div>
    );
};

export default Users;