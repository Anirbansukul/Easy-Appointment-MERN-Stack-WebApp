import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
    return (
        <div>
            <div className='text-center text-2xl pt-10 text-gray-600'>
                <p>CONTACT <span className='text-gray-800 font-semibold'>US</span></p>
            </div>
            <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
                <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
                <div className='flex flex-col justify-center items-start gap-5'>
                    <p className='font-semibold text-lg text-gray-900'>OUR OFFICE</p>
                    <p className='text-gray-600'>PANCHAL<br />BANKURA<br />WEST BENGAL</p>
                    <p className='text-gray-600'>Tel:(415) 567-0979<br />Email:anirbansukul2021@gmail.com</p>
                    <p className='font-semibold text-lg text-gray-700'>Careers at Easy Appointment</p>
                    <p className='text-gray-600'>Learn more about our recent job openings.</p>
                    <button className='border border-black px-8 py-4 text-sm rounded-lg hover:bg-black hover:text-white transition-all duration-500'>Explore jobs</button>

                </div>
            </div>
        </div>
    )
}

export default Contact