import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img
                        className="w-10 h-30 sm:w-20 cursor-pointer transition-transform transform hover:scale-110 shadow-lg rounded-lg border border-gray-300 p-2 bg-white"
                        src="src\assets\EASY.png"
                        alt="Logo"
                    />

                    <p className='w-full md:w-2/3 text-gray-700 leading-7'>Book an appointment today and connect with top doctors for expert medical care.</p>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-700'>
                        <li>Home </li>
                        <li>About</li>
                        <li>Contact</li>
                        <li>Privacy & Policy</li>
                    </ul>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-700'>
                        <li>+91-8907679808</li>
                        <li>anirbansukul2021@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2025@ EasyAppointment. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer
