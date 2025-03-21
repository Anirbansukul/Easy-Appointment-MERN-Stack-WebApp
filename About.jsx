import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
    return (
        <div>
            <div className='text-center text-2xl pt-10 text-gray-700'>
                <p>About <span className='text-gray-900 font-medium'>US</span></p>
            </div>

            <div className='my-10 flex flex-col md:flex-row gap-12'>
                <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
                    <p>At EasyAppointment, we aim to simplify healthcare access by connecting patients with experienced and verified doctors. Our platform offers a hassle-free appointment booking system, ensuring you receive quality medical consultation at your convenience</p>
                    <p>Whether for routine check-ups or specialist care, we are committed to making healthcare accessible, efficient, and stress-free.</p>
                    <b className='text-gray-900'>Our Vision</b>
                    <p>Our vision at EasyAppointment is to revolutionize healthcare accessibility by providing a seamless and efficient platform for patients to connect with trusted medical professionals. We strive to make quality healthcare available to everyone, ensuring timely consultations, hassle-free appointment scheduling, and a patient-centric experience. Through innovation and technology, we aim to bridge the gap between patients and doctors, making healthcare more accessible, reliable, and convenient for all.</p>
                </div>
            </div>
            <div className='text-xl my-4'>
                <p>WHY <span className='text-gray-800 font-semibold'>CHOOSE US</span></p>
            </div>
            <div className='flex flex-col md:flex-row gap-6 my-10'>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col text-[15px] hover:bg-green-700 hover:text-white transition-all duration-500 text-gray-700 cursor-pointer'>
                    <b>Efficiency:</b>
                    <p>At EasyAppointment, efficiency is at the core of our services. We ensure a seamless booking experience, minimizing wait times and maximizing convenience. Our streamlined platform connects patients with top doctors quickly, offering real-time availability, instant confirmations, and hassle-free scheduling. By leveraging technology, we optimize healthcare accessibility, ensuring fast, reliable, and effortless medical consultations for everyone.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col text-[15px] hover:bg-green-700 hover:text-white transition-all duration-500 text-gray-700 cursor-pointer'>
                    <b>Convience:</b>
                    <p>At EasyAppointment, we prioritize your convenience by offering a hassle-free way to connect with top doctors. Our user-friendly platform allows you to book appointments anytime, anywhere, with just a few clicks. Whether you need a consultation from home or prefer an in-person visit, we ensure a seamless experience with real-time availability, instant confirmations, and flexible scheduling. Your healthcare, your way—effortless and accessible.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col text-[15px] hover:bg-green-700 hover:text-white transition-all duration-500 text-gray-700 cursor-pointer'>
                    <b>Personalization:</b>
                    <p>We believe that healthcare should be tailored to each individual. At EasyAppointment, we offer a personalized experience by helping patients find the right doctors based on their specific needs, preferences, and medical history. Our platform ensures customized appointment scheduling, doctor recommendations, and seamless communication, making every consultation more relevant and patient-focused. Your health, your way—because personalized care matters.</p>
                </div>
            </div>
        </div>
    )
}

export default About