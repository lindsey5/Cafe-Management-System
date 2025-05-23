import { TextField, Button, IconButton, Avatar } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { updateData } from "../../services/api"
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

const SettingsTextfield = ({ label, field, setUpdatedData, updatedData, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';

    return (
        <div>
        <p className="text-gray-700 text-md font-bold mb-2">{label}</p>
        <TextField
            type={isPassword ? (showPassword ? 'text' : 'password') : 'text'}
            sx={{
            width: '350px',
            '& label.Mui-focused': {
                color: '#FF8C00',
            },
            '& .MuiInputBase-input': {
                fontSize: '14px',
            },
            '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                borderColor: '#FF8C00',
                },
            },
            }}
            value={updatedData ? updatedData[field] : ''}
            onChange={(e) =>
            setUpdatedData((prev) => ({ ...prev, [field]: e.target.value }))
            }
            InputProps={
            isPassword
                ? {
                    endAdornment: (
                    <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                    >
                        {showPassword ? (
                        <VisibilityOffRoundedIcon fontSize="medium" />
                        ) : (
                        <VisibilityRoundedIcon fontSize="medium" />
                        )}
                    </IconButton>
                    ),
                }
                : {}
            }
        />
        </div>
    );
};

const Account = () => {
    const { user } = useContext(UserContext);
    const [updatedData, setUpdatedData] = useState()
    const [error, setError] = useState('');

    const setData = () => {
        const { image, ...rest} = user
        setUpdatedData({...rest, image: `data:image/jpeg;base64,${image}`})
    }

    useEffect(() => {
        if(user) setData();
    }, [user])

    const handleSave = async () => {
        setError('')
        if(!updatedData.username) setError('Username is required.')
        else if(!updatedData.firstname) setError('Firstname is required.')
        else if(!updatedData.lastname) setError('Lastname is required.')
        else if(updatedData.password !== updatedData.confirmPassword) setError('Password doesn\'t matched')
        else {
            if(confirm('Save cashier?')){
                const { image, ...rest } = updatedData; 

                const imageBase64 = image.split(',')[1]
                const response = await updateData(`/api/user/${user.id}`, {...updatedData, image: imageBase64})
                if(response.success) window.location.reload()
                else setError(response.message)
            }
        }
    }

    

    const handleFiles = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedData(prev => ({
                    ...prev,
                    image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    }

    return <div className="flex-1 flex flex-col p-10 gap-8 h-full overflow-y-auto">
            <h1 className="text-[#FF8C00] font-bold text-3xl">Account Settings</h1>
            <div className="flex gap-5 items-center">
                <Avatar src={`${updatedData?.image}`} sx={{ width: 80, height: 80}}/>
                <div>
                    <p>{updatedData?.firstname} {updatedData?.lastname}</p>
                    <Button 
                        sx={{ 
                            color: '#FF8C00', 
                            border: 1, 
                            borderColor: '#FF8C00', 
                            fontSize: 13, 
                            marginTop: 2
                        }}
                        component="label"
                    >
                        <input
                            type="file"
                            onChange={handleFiles}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    Upload image
                    </Button>
                </div>
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <SettingsTextfield 
                label="Username"
                field="username"
                setUpdatedData={setUpdatedData}
                updatedData={updatedData}
            />
            
            <SettingsTextfield 
                label="Firstname"
                field="firstname"
                setUpdatedData={setUpdatedData}
                updatedData={updatedData}
            />
           <SettingsTextfield 
                label="Lastname"
                field="lastname"
                setUpdatedData={setUpdatedData}
                updatedData={updatedData}
            />
            <SettingsTextfield 
                label="New password"
                field="password"
                type="password"
                setUpdatedData={setUpdatedData}
                updatedData={updatedData}
            />
            <SettingsTextfield 
                label="Confirm password"
                field="confirmPassword"
                type="password"
                setUpdatedData={setUpdatedData}
                updatedData={updatedData}
            />
            <div className="flex gap-5">
                <Button 
                onClick={handleSave}
                sx={{ width: '80px', backgroundColor: '#FF8C00', color: 'white'}}
            >Save</Button>
            <Button 
                onClick={setData}
                sx={{ 
                    width: '80px',
                    color: 'red', 
                    px: 2,
                    border: 1, 
                    borderColor: 'red', 
                    fontSize: 15
                }}
            >Cancel</Button>
            </div>
    </div>
}

export default Account