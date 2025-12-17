"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  preferencesData,
  privacyData,
  subscriptionData,
  supportData,
} from "../Dashboard/Dropdowndata.js";
import FormSelect from "../FormSelect.jsx";
import Image from "next/image.js";
import DashboardHeader from "./Header.jsx";

const Setting = () => {
  // Dropdown States
  const [dropdowns, setDropdowns] = useState({
    language: { open: false, selected: preferencesData.language },
    theme: { open: false, selected: preferencesData.theme },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("admin@example.com");
  const [phone, setPhone] = useState("+9267856567877");

  const emailRef = useRef(null);
  const languageRef = useRef(null);
  const themeRef = useRef(null);

  useEffect(() => {
    if (isEditing && emailRef.current) {
      emailRef.current.focus();
    }
  }, [isEditing]);

  const updateDropdown = (key, value) =>
    setDropdowns((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...value },
    }));

  return (
    <div className="w-full p-4 lg:p-[2%]">
      <DashboardHeader heading="Account" />

      {/* ================= PROFILE ================= */}
      <section
        className="
          flex flex-col-reverse md:flex-row
          items-start md:items-center
          justify-between
          rounded-2xl bg-white
          p-4 lg:p-[2%]
          my-4
          gap-4 md:gap-0
        "
      >
        {/* LEFT */}
        <div className="w-full md:w-[40%]">
          <h4 className="mb-1 text-base sm:text-lg font-semibold">
            Admin User
          </h4>

          {!isEditing ? (
            <>
              <h6 className="mb-1 text-sm text-gray-700">{email}</h6>
              <h6 className="mb-2 text-sm text-gray-700">{phone}</h6>
            </>
          ) : (
            <>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-300 focus:outline-none py-1 text-sm"
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-b border-gray-300 focus:outline-none py-1 mt-2 text-sm"
              />
            </>
          )}

          {/* ACTION BUTTONS */}
          <div
            className="
              flex flex-col sm:flex-row
              gap-2 sm:gap-x-[2%]
              mt-4
            "
          >
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

            <button className="btn-pink">Delete Account</button>
          </div>
        </div>

        {/* RIGHT - AVATAR */}
        <div
          className="
            w-24 h-24
            md:w-[9rem] md:h-[9rem]
            lg:w-[9vw] lg:h-[9vw]
            bg-[#fff3f3]
            flex items-center justify-center
            rounded-2xl
          "
        >
          <Image
            src="/Person-icon.png"
            alt="Profile icon"
            width={72}
            height={72}
            className="
              w-16 h-16
              md:w-[5rem] md:h-[5rem]
              lg:w-[5vw] lg:h-[5vw]
              2xl:w-20 2xl:h-20
            "
          />
        </div>
      </section>

      {/* ================= PRIVACY ================= */}
      <section className="rounded-2xl bg-white p-4 lg:p-[2%] my-4">
        <h4>Privacy & Security</h4>
        {privacyData.map((item, i) => (
          <div key={i} className={i > 0 ? "my-4" : "mt-2"}>
            <h6>{item.title}</h6>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* ================= SUBSCRIPTION ================= */}
      <section className="rounded-2xl bg-white p-4 lg:p-[2%] my-4">
        <h4>Subscription & Billing</h4>

        <div className="flex flex-col md:flex-row md:justify-between my-4 gap-4">
          <div className="w-full md:w-1/2">
            <h6>Payment Method</h6>
            <p>{subscriptionData.payment.method}</p>
            <p className="text-sm text-gray-600">
              Expires {subscriptionData.payment.expires}
            </p>
          </div>

          <div className="w-full md:w-1/2">
            <h6>Billing History</h6>
            {subscriptionData.history.map((h, i) => (
              <p key={i} className="text-sm text-gray-600">
                {h}
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
          {subscriptionData.buttons.map((btn, i) => (
            <button
              key={i}
              className={i === 0 ? "btn-gray" : "btn-pink"}
            >
              {btn}
            </button>
          ))}
        </div>
      </section>

      {/* ================= SUPPORT ================= */}
      <section className="rounded-2xl bg-white p-4 lg:p-[2%] my-4">
        <h4>Support</h4>

        <div className="flex flex-col md:flex-row md:justify-between my-4 gap-4">
          {supportData.sections.map((sec, i) => (
            <div key={i} className="w-full md:w-1/2">
              <h6>{sec.title}</h6>
              <p className="text-sm text-gray-600">{sec.desc}</p>
            </div>
          ))}
        </div>

        <button className="btn-pink mt-2">
          {supportData.button}
        </button>
      </section>
    </div>
  );
};

export default Setting;
