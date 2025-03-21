import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [state, setState] = useState('Sign Up');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const { backendurl, token, setToken } = useContext(AppContext)
    const navigate = useNavigate()
    const onSubmitH = async (e) => {
        e.preventDefault();
        try {
            let data;
            if (state === 'Sign Up') {
                console.log("Attempting Signup...");
                const response = await axios.post(`${backendurl}/api/user/register`, { name, password, email });
                data = response.data;
            } else {
                console.log("Attempting Login...");
                const response = await axios.post(`${backendurl}/api/user/login`, { password, email });
                data = response.data;
            }

            console.log("API Response:", data);

            if (data.success) {
                console.log("Token Received:", data.token);
                localStorage.setItem('token', data.token);
                setToken(data.token);
            } else {
                console.error("Signup/Login Failed:", data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Signup/Login failed.");
        }
    };


    useEffect(() => {
        console.log("Token Updated in Context (Effect Triggered):", token);
        if (token) {
            setTimeout(() => navigate('/'), 200);
        }
    }, [token, navigate]);

    return (
        <form onSubmit={onSubmitH} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
                <p>Please {state === 'Sign Up' ? "sign-up" : "log in"} to book appointment</p>
                {
                    state === 'Sign Up' && <div className='w-full'>
                        <p>Full Name</p>
                        <input className='border border-zinc-700 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} required />
                    </div>
                }

                <div className='w-full'>
                    <p>Email</p>
                    <input className='border border-zinc-700 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input className='border border-zinc-700 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                </div>
                <button type='submit' className='bg-slate-700 text-white w-full py-2 rounded-md text-base'>{state === 'Sign Up' ? "Create Account" : "Login"}</button>
                {
                    state === "Sign Up"
                        ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-gray-800 underline cursor-pointer'> Login Here</span></p>
                        : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='text-gray-800 underline cursor-pointer'>Click Here</span></p>

                }
            </div>

        </form>
    )
}

export default Login