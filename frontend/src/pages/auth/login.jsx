
import { Button, TextField, Checkbox, FormControlLabel, Tab } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import { useState, useEffect } from 'react';
import { postData, fetchData } from '../../services/api';
import { setToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const OrangeTextfield = ({ label, ...rest}) => {
    return <TextField fullWidth {...rest} label={label} variant="outlined" 
        sx={{
            '& label.Mui-focused': {
                color: '#FF8C00'
            },
            '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                    borderColor: '#FF8C00',
                },
            },
        }}
    />
}

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('Cashier');
    const [error, setError] = useState('');
    const [user, setUser] = useState({
        username: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e, newValue) => {
        setRole(newValue)
    }

    const login = async (e) => {
        e.preventDefault();
        setError('')
        const response = await postData('/api/auth/login', {...user, role})
        if(response.success){
            setToken(response.token)
            if(response.role === 'Admin') navigate('/admin') 
            else if(response.role === 'Cashier') navigate('/cashier')
        }else{
            setError(response.message)
        }
    }

    useEffect(() => {
        const getUserAsync = async () => {
            const response = await fetchData('/api/user')

            if(response.success){
                if (response.user.role === 'Admin') setUser(response.user) 
                else if(response.user.role === 'Cashier') setUser(response.user)    
            }else{
                navigate('/', { replace: true })
            }
        }

        getUserAsync();
    }, [])

    return <main className="bg-[url('/orange-bg.jpg')] bg-cover bg-center h-screen">
        <form className="w-[40%] fixed left-[calc(55%)] top-1/2 transform 
            -translate-y-1/2 bg-white
            border-1 border-gray-200 shadow-xl p-10 rounded-xl
            flex flex-col gap-8
            "
            onSubmit={login}
        >
            <div className='flex justify-center'>
                <img className='h-[100px]' src="/logo.png" alt="" />
            </div>
            <Tabs onChange={handleChange} value={role}>
                <Tab label="Cashier" value="Cashier" />
                <Tab label="Admin" value="Admin" />
            </Tabs>
            <h1 className="text-2xl font-bold ">Login as <span className='text-[#FF8C00]'>{role}</span></h1>
            {error && <p className='text-red-600'>{error}</p>}
            <OrangeTextfield 
                label="Username" 
                onChange={(e) => setUser({...user, username: e.target.value})}
                required
            />
            <div className='flex flex-col items-end gap-3'>
                <OrangeTextfield 
                    label="Password" 
                    type={showPassword ? 'text' : 'password'} 
                    onChange={(e) => setUser({...user, password: e.target.value})}
                    required
                />
                <FormControlLabel
                    control={<Checkbox />}
                    label="Show password"
                    labelPlacement="start"
                    sx={{ color: '#FF8C00'}}
                    onClick={() => setShowPassword(!showPassword)}
                />
            </div>
            <Button 
                type='submit'
                variant='contained' 
                sx={{ backgroundColor: '#FF8C00', height: '50px' }}
            >Login</Button>
        </form> 
    </main>
}

export default Login