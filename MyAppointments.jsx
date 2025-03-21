import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
    const { backendurl, token, getDoctorsData } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const isTokenExpired = () => {
        if (!token) return true;
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) return true;

        try {
            const decoded = JSON.parse(atob(tokenParts[1])); // Decode the payload
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    };

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendurl}/api/user/appointments`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setAppointments(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch appointments");
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${backendurl}/api/user/cancel-appointment`,
                { appointmentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(data.message);
                getUserAppointments();
                getDoctorsData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to cancel appointment.");
        } finally {
            setLoading(false);
        }
    };

    const initPay = async (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Appointment Payment",
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,

            handler: async (response) => {
                try {
                    const { data } = await axios.post(
                        `${backendurl}/api/user/verify-razorpay`,
                        {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (data.success) {
                        toast.success("Payment Verified Successfully!");
                        getUserAppointments();
                    } else {
                        toast.error("Payment verification failed.");
                    }
                } catch (error) {
                    toast.error("Payment verification request failed.");
                }
            },
        };

        const rzp = new window.Razorpay(options);
        await rzp.open();
    };

    const appointmentRazorpay = async (appointmentId) => {
        try {
            if (isTokenExpired()) {
                toast.error("Session expired. Please log in again.");
                navigate("/login");
                return;
            }

            const { data } = await axios.post(
                `${backendurl}/api/user/payment-razorpay`,
                { appointmentId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (data.success) {
                initPay(data.order);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to initiate payment.");
        }
    };

    useEffect(() => {
        if (token) {
            getUserAppointments();
        } else {
            navigate("/login");
        }
    }, [token]);

    return (
        <div>
            <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>

            {loading && <p className="text-center text-gray-500">Loading...</p>}

            <div>
                {appointments.length === 0 && !loading && <p className="text-center text-gray-500 mt-4">No appointments found.</p>}

                {appointments.map((item, idx) => (
                    <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={idx}>
                        <div>
                            <img className="w-32 bg-indigo-100" src={item.docData.image} alt={`Dr. ${item.docData.name}`} />
                        </div>
                        <div className="flex-1 text-sm text-zinc-500">
                            <p className="text-neutral-900 font-semibold">{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className="text-xs mt-1">
                                <span className="text-sm text-neutral-800 font-medium">Date & Time:</span> {`${item.slotDate} | ${item.slotTime}`}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 justify-end">
                            {!item.cancelled && item.payment && !item.isCompleted && (
                                <button className="sm:min-w-48 py-2 border rounded text-white bg-green-600">
                                    Paid
                                </button>
                            )}

                            {!item.cancelled && !item.payment && !item.isCompleted && (
                                <button
                                    onClick={() => appointmentRazorpay(item._id)}
                                    className="text-sm text-stone-700 text-center sm:min-w-48 py-2 border rounded hover:bg-violet-600 hover:text-white transition-all duration-500"
                                >
                                    Pay Online
                                </button>
                            )}

                            {!item.cancelled && !item.isCompleted && (
                                <button
                                    onClick={() => cancelAppointment(item._id)}
                                    className="text-sm text-stone-700 text-center sm:min-w-48 py-2 border rounded hover:bg-red-700 hover:text-white transition-all duration-500"
                                    disabled={loading}
                                >
                                    {loading ? "Cancelling..." : "Cancel Appointment"}
                                </button>
                            )}

                            {item.cancelled && !item.isCompleted &&
                                < button className="sm:min-w-40 py-2 border-red-600 text-red-800">
                                    Appointment Cancelled
                                </button>
                            }
                            {
                                item.isCompleted && <button className="sm:min-w-48 py-2 border-green-600 rounded text-green-600 ">Completed</button>
                            }

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyAppointments;
