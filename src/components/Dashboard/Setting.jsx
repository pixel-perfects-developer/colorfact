"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import DashboardHeader from "./Header.jsx";
import { Formik, Form, Field } from "formik";

const DEFAULT_AVATAR = "/Person-icon.png";

const Setting = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);

  const emailRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && emailRef.current) {
      emailRef.current.focus();
    }
  }, [isEditing]);

  const handleAvatarChange = (e, setFieldValue) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFieldValue("avatar", file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <>
      <DashboardHeader heading="Account" />

      <section
        className="
          flex flex-col-reverse md:flex-row
          items-start md:items-center
          justify-between
          rounded-2xl bg-white
          p-4 lg:p-[1%]
          gap-4 md:gap-0
        "
      >
        {/* LEFT */}
        <div className="w-full md:w-[40%]">
          <h4 className="mb-[0.5rem] lg:mb-[1%]">Admin User</h4>

          <Formik
            initialValues={{
              email: "admin@example.com",
              phone: "+9267856567877",
              avatar: null,
            }}
            onSubmit={(values, { setSubmitting }) => {
              console.log("FORM VALUES:", values);
              setTimeout(() => {
                setSubmitting(false);
                setIsEditing(false);
              }, 600);
            }}
          >
            {({
              values,
              dirty,
              isSubmitting,
              setFieldValue,
              resetForm,
            }) => (
              <Form>
                {!isEditing ? (
                  <>
                    <h6 className="mb-[0.5rem] lg:mb-[1%]">
                      {values.email}
                    </h6>
                    <h6>{values.phone}</h6>
                  </>
                ) : (
                  <>
                    <Field
                      innerRef={emailRef}
                      name="email"
                      type="email"
                      className="
                        w-full mb-[1rem]
                        px-[0.5rem] py-[0.7rem]
                        text-[0.8rem]
                        bg-white
                        rounded-md ring-2 ring-gray-300
                        focus:ring-[#F16935] outline-none
                      "
                    />

                    <Field
                      name="phone"
                      type="text"
                      className="
                        w-full
                        px-[0.5rem] py-[0.7rem]
                        text-[0.8rem]
                        bg-white
                        rounded-md ring-2 ring-gray-300
                        focus:ring-[#F16935] outline-none
                      "
                    />
                  </>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex flex-row gap-2 mt-4">
                  {!isEditing ? (
                    <button
                      type="button"
                      className="btn-gray"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={!dirty || isSubmitting}
                        className="btn-pink disabled:opacity-50"
                      >
                        Save Changes
                      </button>

                      <button
                        type="button"
                        className="btn-gray"
                        onClick={() => {
                          resetForm();
                          setAvatarPreview(DEFAULT_AVATAR);
                          setIsEditing(false);
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  <button type="button" className="btn-pink">
                    Delete Account
                  </button>
                </div>

                {/* AVATAR (MOBILE CENTERED) */}
                <div className="flex justify-center md:hidden mt-6">
                  <Avatar
                    avatarPreview={avatarPreview}
                    fileInputRef={fileInputRef}
                    onChange={(e) =>
                      handleAvatarChange(e, setFieldValue)
                    }
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* RIGHT - AVATAR (DESKTOP) */}
        <div className="hidden md:flex justify-center">
          <Avatar
            avatarPreview={avatarPreview}
            fileInputRef={fileInputRef}
            onChange={(e) =>
              handleAvatarChange(e, () => {})
            }
          />
        </div>
      </section>
    </>
  );
};

/* ================= AVATAR COMPONENT ================= */

const Avatar = ({ avatarPreview, onChange, fileInputRef }) => (
  <div
    className="
      bg-[#fff3f3]
      p-[1.5rem] lg:p-[2vw]
      flex items-center justify-center
      rounded-2xl
      cursor-pointer
      overflow-hidden
      group relative
    "
  >
    <div
      className="size-24 md:size-[5rem] lg:size-[5vw] relative"
      onClick={() => fileInputRef.current.click()}
    >
      <Image
        src={avatarPreview}
        alt="Profile avatar"
        fill
        unoptimized
        className="object-cover"
      />
    </div>

    {/* Hover Overlay */}
    <div
      className="
        absolute inset-0
        bg-black/40
        flex items-center justify-center
        opacity-0 group-hover:opacity-100
        transition
      "
    >
      <span className="text-white text-xs">Change</span>
    </div>

    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={onChange}
    />
  </div>
);

export default Setting;
