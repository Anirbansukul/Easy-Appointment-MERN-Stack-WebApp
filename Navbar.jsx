import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    // const [token, setToken] = useState(true);
    const { token, setToken, userData } = useContext(AppContext);
    // const logout = () => {
    //     setToken(false);
    //     localStorage.removeItem('token')
    // }
    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
        setTimeout(() => {
            navigate('/login');
        }, 500);
    };
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);


    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-500'>
            {/* <img onClick={() => navigate('/')} className='w-40 cursor-pointer' style={{
                marginBottom: "20px",
                width: "70px",
                height: "70px",
                objectFit: "contain"
            }} src="src/assets/EASY.png" alt="" /> */}
            <img
                onClick={() => navigate('/')}
                className="w-10 h-30 sm:w-20 cursor-pointer transition-transform transform hover:scale-110 shadow-lg rounded-lg border border-gray-300 p-2 bg-white"
                src="src\assets\EASY.png"
                alt="Logo"
            />
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'>
                    <li className='py-1'>HOME</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/doctors'>
                    <li className='py-1'>ALL DOCTORS</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/about'>
                    <li className='py-1'>ABOUT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/contact'>
                    <li className='py-1'>CONTACT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
            </ul>
            <div className='flex items-center gap-4'>
                {
                    token && userData
                        ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                            <img className='w-8 rounded-full' src={userData.image} alt="" />
                            <img className='w-2.5 ' src={assets.dropdown_icon} alt="" />
                            <div className='absolute top-0 right-0 pt-14 text-amber-200 font-medium text-gray-800 z-20 hidden group-hover:block'>
                                <div className='min-w-48 bg-stone-200 rounded flex flex-col gap-4 p-4'>
                                    <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                    <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointment</p>
                                    <p onClick={() => logout()} className='hover:text-black cursor-pointer'>Logout</p>
                                </div>
                            </div>
                        </div>
                        : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>


                }
                <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
                <div className={` ${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                    <div className='flex items-center justify-between px-5 py-6'>
                        <img
                            className="w-10 h-30 sm:w-20 cursor-pointer transition-transform transform hover:scale-110 shadow-lg rounded-lg border border-gray-300 p-2 bg-white"
                            src="src\assets\EASY.png"
                            alt="Logo"
                        />
                        <img className='w-7' onClick={() => setShowMenu(false)} src={assets.chats_icon} alt="" />
                    </div>
                    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                        <NavLink to="/"><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
                        <NavLink to="/doctors"><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
                        <NavLink to="/about"><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
                        <NavLink to="/contact"><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default Navbar
