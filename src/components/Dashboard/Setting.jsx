"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { User } from "lucide-react";
import { 
    accountInfo, 
    preferencesData, 
    privacyData, 
    subscriptionData, 
    supportData 
} from "../Dashboard/Dropdowndata.js";
import FormSelect from '../FormSelect.jsx';
import Image from 'next/image.js';

const Setting = () => {

    // Dropdown States
    const [dropdowns, setDropdowns] = useState({
        language: { open: false, selected: preferencesData.language },
        theme: { open: false, selected: preferencesData.theme },
    });
    const [isEditing, setIsEditing] = useState(false);

    const [email, setEmail] = useState('admin@example.com');
    const [phone, setPhone] = useState('+9267856567877');

    const emailRef = useRef(null);

    useEffect(() => {
        if (isEditing && emailRef.current) {
            emailRef.current.focus();
        }
    }, [isEditing]);
    const languageRef = React.useRef(null);
    const themeRef = React.useRef(null);

    const updateDropdown = (key, value) =>
        setDropdowns((prev) => ({ ...prev, [key]: { ...prev[key], ...value } }));


    return (
        <div className="w-full p-[1rem] lg:p-[2%]">

            {/* Header */}
            <header className="flex justify-between items-center">
                <h2>Account</h2>
                <Link href={""} className="bg-white py-[0.5%] px-[2%] rounded-md shadow text-black hover:bg-gray-100">
                    <p>Logout</p>
                </Link>
            </header>

            {/* Account Info Section */}
            <section className="flex flex-col-reverse md:flex-row items-center justify-between rounded-2xl bg-white p-[1rem] lg:p-[2%] my-[1rem]">
                
                {/* Info */}
                  <div className='w-full md:w-[40%] mt-[1rem] '>
                    {!isEditing ? (
                        <>
                            <h6>{email}</h6>
                            <h6>{phone}</h6>
                        </>
                    ) : (
                        <>
                            <input
                                ref={emailRef}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-b border-gray-300 focus:outline-none py-1"
                            />

                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border-b border-gray-300 focus:outline-none py-1 mt-2"
                            />
                        </>
                    )}

                    
                    {/* edit button */}
                    <div className="flex items-center gap-x-[2%] lg:mt-[2%] mt-[1rem] whitespace-nowrap">
                        {!isEditing ? (
                            <button
                                className="btn-gray"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                className="btn-pink"
                                onClick={() => setIsEditing(false)}
                            >
                                Save Changes
                            </button>
                        )}

                        <button className="btn-gray">
                            Delete Account
                        </button>
                    </div>

                </div>
                {/* Icon */}
                 <div className="w-[9rem] h-[9rem] lg:w-[9vw] lg:h-[9vw] 2xl:w-34 2xl:h-34 bg-[#fff3f3] flex items-center justify-center rounded-2xl">
                        <Image
                            src="/Person-icon.png"
                            alt="Profile icon"
                            width={72}
                            height={72}
                            className='w-[5rem] h-[5rem] lg:w-[5vw] lg:h-[5vw]  2xl:w-20 2xl:h-20'
                        />
                    </div>
            </section>

            {/* Preferences Section */}
            <section className="rounded-2xl bg-white p-[1rem] lg:p-[2%] my-[1rem]">
                <h4>Preferences</h4>

                <div className="flex flex-col md:flex-row md:justify-between gap-x-[2%]">

                    {/* Language Dropdown */}
                    <FormSelect
                        ref={languageRef}
                        open={dropdowns.language.open}
                        setOpen={(val) => updateDropdown("language", { open: val })}
                        selectedLabel="Select Language"
                        MainService={preferencesData.languages}
                        handleSelectChange={(val) =>
                            updateDropdown("language", { selected: val, open: false })
                        }
                        selectedCategory={dropdowns.language.selected}
                    />

                    {/* Theme Dropdown */}
                    <FormSelect
                        ref={themeRef}
                        open={dropdowns.theme.open}
                        setOpen={(val) => updateDropdown("theme", { open: val })}
                        selectedLabel="Select Theme"
                        MainService={preferencesData.themes}
                        handleSelectChange={(val) =>
                            updateDropdown("theme", { selected: val, open: false })
                        }
                        selectedCategory={dropdowns.theme.selected}
                    />

                </div>
            </section>

            {/* Privacy Section */}
            <section className="rounded-2xl bg-white p-[1rem] lg:p-[2%] my-[1rem]">
                <h4>Privacy & Security</h4>
                {privacyData.map((item, i) => (
                    <div key={i} className={i > 0 ? "my-[1rem]" : "mt-[1%]"}>
                        <h6>{item.title}</h6>
                        <p>{item.desc}</p>
                    </div>
                ))}
            </section>

            {/* Subscription Section */}
            <section className="rounded-2xl bg-white p-[1rem] lg:p-[2%] my-[1rem]">
                <h4>Subscription & Billing</h4>

                <div className="flex flex-col md:flex-row md:justify-between my-[1rem]">
                    <div className="w-full md:w-1/2">
                        <h6>Payment Method</h6>
                        <p>{subscriptionData.payment.method}</p>
                        <p>Expires {subscriptionData.payment.expires}</p>
                    </div>

                    <div className="w-full md:w-1/2">
                        <h6>Billing History</h6>
                        {subscriptionData.history.map((h, i) => (
                            <p key={i}>{h}</p>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                    {subscriptionData.buttons.map((btn, i) => (
                        <button key={i} className={i === 0 ? "btn-gray" : "btn-pink"}>
                            {btn}
                        </button>
                    ))}
                </div>
            </section>

            {/* Support Section */}
            <section className="rounded-2xl bg-white p-[1rem] lg:p-[2%] my-[1rem]">
                <h4>Support</h4>

                <div className="flex flex-col md:flex-row md:justify-between my-[1rem]">
                    {supportData.sections.map((sec, i) => (
                        <div key={i} className="w-full md:w-1/2 my-2">
                            <h6>{sec.title}</h6>
                            <p>{sec.desc}</p>
                        </div>
                    ))}
                </div>

                <button className="btn-pink mt-2">{supportData.button}</button>
            </section>

        </div>
    );
};

export default Setting;
