
import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const cs = '₹';
    const backendurl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [userData, setUserData] = useState(null);

    console.log("Backend URL:", backendurl);

    const getDoctorsData = async () => {
        try {
            const savedToken = localStorage.getItem('token');
            if (!savedToken) {
                console.error("No token found, redirecting to login...");
                return;
            }

            console.log("Fetching doctors data...");
            const response = await axios.get(`${backendurl}/api/doctor/list`, {
                headers: { Authorization: `Bearer ${savedToken}` }
            });

            console.log("API Response:", response.data);

            if (response.data.success && response.data.doctors.length > 0) {
                setDoctors(response.data.doctors);
                console.log("Doctors set in state:", response.data.doctors);
            } else {
                console.error("No doctors found:", response.data.message);
                setDoctors([]);
            }
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to fetch doctors");
        }
    };


    const loadUserProfileData = async () => {
        try {
            const savedToken = localStorage.getItem('token');
            if (!savedToken) {
                console.error("No token found, skipping profile fetch.");
                return;
            }

            console.log("Sending user profile request with token:", savedToken);

            const { data } = await axios.get(`${backendurl}/api/user/get-profile`, {
                headers: { Authorization: `Bearer ${savedToken}` }
            });

            console.log("User Profile API Response:", data);

            if (data.success && data.userData) {
                console.log("User Profile Loaded:", data.userData);
                setUserData({ ...data.userData });
            } else {
                console.error("Profile Fetch Failed:", data.message);
                toast.error(data.message || "User profile not found.");
                setUserData(null);
            }
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            toast.error("Failed to load profile.");
            setUserData(null);
        }
    };


    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            loadUserProfileData();
        } else {
            setUserData(null);
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        getDoctorsData();
    }, []);

    const value = {
        doctors,
        cs,
        getDoctorsData,
        setDoctors,
        token, setToken,
        backendurl, userData, setUserData, loadUserProfileData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
