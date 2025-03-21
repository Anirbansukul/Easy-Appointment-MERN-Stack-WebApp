import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, cs, backendurl, token, userData } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const navigate = useNavigate();
    const [slotDate, setSlotDate] = useState('');
    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    useEffect(() => {
        const fetchDocInfo = () => {
            const docData = doctors.find(doc => doc._id === docId);
            if (docData) {
                setDocInfo(docData);
            }
        };

        if (doctors.length > 0) {
            fetchDocInfo();
        }
    }, [doctors, docId]);

    useEffect(() => {
        const getAvailableSlots = () => {
            if (!docInfo) return;

            let availableSlots = [];
            let today = new Date();

            for (let i = 0; i < 7; i++) {
                let cd = new Date(today);
                cd.setDate(today.getDate() + i);
                let et = new Date();
                et.setDate(today.getDate() + i);
                et.setHours(21, 0, 0, 0);

                if (today.getDate() === cd.getDate()) {
                    cd.setHours(cd.getHours() > 10 ? cd.getHours() + 1 : 10);
                    cd.setMinutes(cd.getMinutes() > 30 ? 30 : 0);
                } else {
                    cd.setHours(10);
                    cd.setMinutes(0);
                }

                let ts = [];
                while (cd < et) {
                    let ft = cd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    let day = cd.getDate();
                    let month = cd.getMonth() + 1;
                    let year = cd.getFullYear();
                    const formattedDate = `${day}_${month}_${year}`;

                    const isSlotAvailable = !(
                        docInfo.slots_booked[formattedDate] &&
                        docInfo.slots_booked[formattedDate].includes(ft)
                    );

                    if (isSlotAvailable) {
                        ts.push({
                            dateTime: new Date(cd),
                            time: ft
                        });
                    }

                    cd.setMinutes(cd.getMinutes() + 30);
                }

                if (ts.length > 0) {
                    availableSlots.push(ts);
                }
            }

            setDocSlots(availableSlots);
        };

        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    const bookAppointment = async () => {
        try {
            if (!token) {
                toast.error("Please login first.");
                navigate('/login');
                return;
            }

            if (!docId || !slotDate || !slotTime) {
                toast.error("Please select a date and time.");
                return;
            }

            const payload = {
                userId: userData?._id,
                docId,
                slotDate,
                slotTime
            };

            const { data } = await axios.post(`${backendurl}/api/user/book-appointment`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success("Appointment booked successfully!");

                // ✅ Remove booked slot from `docSlots`
                setDocSlots(prevSlots => {
                    return prevSlots
                        .map(daySlots =>
                            daySlots.filter(
                                slot =>
                                    slot.time !== slotTime ||
                                    `${slot.dateTime.getDate()}_${slot.dateTime.getMonth() + 1}_${slot.dateTime.getFullYear()}` !== slotDate
                            )
                        )
                        .filter(daySlots => daySlots.length > 0); // ✅ Remove empty slot days
                });

                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to book appointment.");
            console.error("API Error (Book Appointment):", error.response?.data || error.message);
        }
    };

    return docInfo && (
        <div>
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-fuchsia-600 w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-gray-500 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="" />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-700'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-800 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>
                    <p className='text-gray-700 font-medium mt-4'>
                        Appointment Fee: <span className='text-gray-800'> {docInfo.fees}{cs}</span>
                    </p>
                </div>
            </div>

            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                <p>Booking Slots</p>
                <div className='flex gap-4 items-center w-full overflow-x-scroll mt-4'>
                    {docSlots.length > 0 && docSlots.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                setSlotIndex(idx);
                                setSlotDate(`${item[0]?.dateTime.getDate()}_${item[0]?.dateTime.getMonth() + 1}_${item[0]?.dateTime.getFullYear()}`);
                            }}
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === idx ? 'bg-slate-500 text-white' : 'border border-gray-400'}`}>
                            <p>{item[0] ? daysOfWeek[item[0].dateTime.getDay()] : ''}</p>
                            <p>{item[0] ? item[0].dateTime.getDate() : ''}</p>
                        </div>
                    ))}
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length > 0 && docSlots[slotIndex]?.map((item, idx) => (
                        <p key={idx}
                            onClick={() => setSlotTime(item.time)}
                            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-slate-500 text-white' : 'text-fuchsia-800 border border-gray-600'}`}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button onClick={bookAppointment} className='bg-slate-600 text-white text-sm font-light px-14 py-3 rounded-full my-6'>
                    Book Appointment
                </button>
            </div>

            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    );
};

export default Appointment;
