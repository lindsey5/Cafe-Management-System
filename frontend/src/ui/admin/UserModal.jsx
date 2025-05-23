import { Modal, TextField, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material"
import { useEffect, useState } from "react"
import { postData, updateData } from "../../services/api";
import { confirmUpdate } from "../../utils/utils";

const UserModal = ({ open, handleClose, user, setUser }) => {
    const [error, setError] = useState('');

    const handleSave = async () => {
        setError('');
        if (!user.username) setError('Username is required.');
        else if (!user.firstname) setError('Firstname is required.');
        else if (!user.lastname) setError('Lastname is required.');
        else if (!user.password && !user?.id) setError('Password is required.');
        else if (!user.role) setError('Role is required.');
        else if (user.password !== user.confirmPassword && !user?.id) setError("Password doesn't match");
        else {
            if (confirm('Save user?')) {
                confirmUpdate(await user.id ? updateUser() : addUser());
            }
        }
    };

    const addUser = async () => {
        const response = await postData('/api/auth/signup', user);
        if (response.success) window.location.reload();
        else setError(response.message);
    };

    const updateUser = async () => {
        const response = await updateData(`/api/user/${user.id}`, user);
        if (response.success) window.location.reload();
        else setError(response.message);
    };

    return (
        <Modal onClose={handleClose} open={open}>
            <div className="w-[400px] flex flex-col gap-5 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-10 bg-white rounded-lg">
                <h1 className="text-[#FF8C00] font-bold text-2xl">{user?.id ? 'Update user' : 'Add new user'}</h1>
                {error && <p className="text-red-600">{error}</p>}
                <TextField
                    value={user?.username}
                    label="Username"
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                />
                <TextField
                    value={user?.firstname}
                    label="Firstname"
                    onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                />
                <TextField
                    value={user?.lastname}
                    label="Lastname"
                    onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                />
                <TextField
                    value={user?.password}
                    label="Password"
                    type="password"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
                <TextField
                    value={user?.confirmPassword}
                    label="Confirm Password"
                    type="password"
                    onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                />
                <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={user.role}
                        label="Role"
                        onChange={(e) => setUser({...user, role: e.target.value})}
                    >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Cashier">Cashier</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    onClick={handleSave}
                    sx={{ backgroundColor: '#FF8C00', color: 'white', borderRadius: 20 }}
                >
                    Save
                </Button>
                <Button
                    onClick={handleClose}
                    sx={{
                        color: 'red',
                        px: 2,
                        border: 1,
                        borderColor: 'red',
                        borderRadius: 20,
                        fontSize: 15
                    }}
                >
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default UserModal;