import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
    const { userData, setUserData, token, backendurl, loadUserProfileData } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     if (userData?.image) {
    //         setPreviewImage(`${backendurl}${userData.image}`);
    //     }
    // }, [userData]);
    useEffect(() => {
        if (userData?.image) {
            setPreviewImage(
                userData.image.startsWith('http') ? userData.image : `${backendurl}${userData.image}`
            );
        }
    }, [userData]);


    const updateUserProfileData = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('phone', userData.phone);
            formData.append('address', JSON.stringify(userData.address));
            formData.append('gender', userData.gender);
            formData.append('dob', userData.dob);

            if (image) {
                formData.append('image', image);
            }

            const { data } = await axios.post(`${backendurl}/api/user/update-profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data',
                },
            });

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Profile update failed.");
        }
        setLoading(false);
    };

    return userData && (
        <div className='max-w-lg flex flex-col gap-2 text-sm'>
            {isEdit ? (
                <label htmlFor='image'>
                    <div className='relative cursor-pointer'>
                        <img className='w-36 rounded opacity-75' src={previewImage || URL.createObjectURL(image)} alt="Profile" />
                        {!image && <img className='w-10 absolute bottom-12 right-12' src={assets.upload_icon} alt="Upload Icon" />}
                    </div>
                    <input
                        type="file"
                        id="image"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setImage(file);
                            setPreviewImage(URL.createObjectURL(file));
                        }}
                    />
                </label>
            ) : (
                <img className='w-36 rounded' src={previewImage} alt="Profile" />
            )}

            {isEdit ? (
                <input className='bg-gray-600 text-3xl font-medium max-w-60 mt-4' type="text" value={userData.name}
                    onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))} />
            ) : (
                <p className='font-medium text-3xl text-neutral-600 mt-5'>{userData.name}</p>
            )}

            <hr className='bg-zinc-200 h-[1px] border-none' />

            <div>
                <p className='text-neutral-600 underline mt-4'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-4 text-neutral-600'>
                    <p className='font-medium'>Email Id:</p>
                    <p className='text-blue-700'>{userData.email}</p>
                    <p className='font-medium'>Phone</p>
                    {isEdit ? (
                        <input className='bg-gray-400 max-w-52' type="text" value={userData.phone}
                            onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))} />
                    ) : (
                        <p className='text-blue-600'>{userData.phone}</p>
                    )}
                </div>
            </div>

            <div>
                <p className='text-neutral-600 underline mt-4'>ADDRESS</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-4 text-neutral-600'>
                    <p className='font-medium'>Address:</p>
                    {isEdit ? (
                        <div>
                            <input className='bg-gray-400' type="text" value={userData.address.line1}
                                onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
                            <br />
                            <input className='bg-gray-400' type="text" value={userData.address.line2}
                                onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />
                        </div>
                    ) : (
                        <p className='text-gray-600'>{userData.address.line1}, {userData.address.line2}</p>
                    )}
                </div>
            </div>

            <div>
                <p className='text-neutral-600 underline mt-4'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-4 text-neutral-600'>
                    <p className='font-medium'>Gender:</p>
                    {isEdit ? (
                        <select className='max-w-20 bg-gray-400' onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    ) : (
                        <p className='text-gray-500'>{userData.gender}</p>
                    )}
                    <p>Birthday:</p>
                    {isEdit ? (
                        <input className='max-w-28 bg-slate-500 hover:bg-slate-500 hover:text-white transition-all' type="date"
                            onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
                    ) : (
                        <p className='text-gray-500'>{userData.dob}</p>
                    )}
                </div>
            </div>

            <div className='mt-10'>
                {isEdit ? (
                    <button className='border border-gray-400 px-8 py-2 rounded-full' onClick={updateUserProfileData} disabled={loading}>
                        {loading ? "Saving..." : "Save Information"}
                    </button>
                ) : (
                    <button className='border border-gray-400 px-8 py-2 rounded-full' onClick={() => setIsEdit(true)}>
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
};

export default MyProfile;
