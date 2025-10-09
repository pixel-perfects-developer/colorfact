"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import FormSelect from "./FormSelect";

const UploadAnImage = () => {
  // Garment Dropdown States
  const [openGarment, setOpenGarment] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState(null);
  const garmentRef = useRef();

  // Gender Dropdown States
  const [openGender, setOpenGender] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const genderRef = useRef();

  // 🔹 Local image preview
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Dummy Data
  const Garments = [
    { id: 1, name: "T-shirts" },
    { id: 2, name: "Jackets" },
    { id: 3, name: "Pants" },
    { id: 4, name: "Dresses" },
    { id: 5, name: "Sweaters" },
  ];

  const Gender = [
    { id: 1, name: "Men" },
    { id: 2, name: "Women" },
    { id: 3, name: "Mixed" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (garmentRef.current && !garmentRef.current.contains(e.target)) {
        setOpenGarment(false);
      }
      if (genderRef.current && !genderRef.current.contains(e.target)) {
        setOpenGender(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="bg-[#faf5e7] min-h-screen ">
      <div className="container-global  lg:w-[70%] mx-auto">
        {/* Upload Box */}
        <div
          className="border-2 border-dashed border-gray-400 rounded-[1vw] py-[5%] cursor-pointer"
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex justify-center ">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="uploaded-garment"
                width={400}
                height={400}
                className="w-[80%] lg:w-[40%]"
              />
            ) : (
              <Image
                src="/drag-drop.png"
                alt="drag-drop-upload"
                width={400}
                height={400}
                className="w-[80%] lg:w-[40%]"
              />
            )}
          </div>
          <p className="text-center mt-[2rem] lg:mt-[2%] w-[80%] lg:w-[40%] mx-auto text-gray-700">
            {imagePreview
              ? "Your garment image has been uploaded locally."
              : "Drag-and-drop a photo of your favorite garment and discover what to pair it with!"}
          </p>

          {/* Hidden input for upload */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Garment Type Dropdown */}
        <div className="mt-[2rem] lg:mt-[2%]">
          <FormSelect
            ref={garmentRef}
            open={openGarment}
            setOpen={setOpenGarment}
            selectedLabel={"Select Garment"}
            MainService={Garments}
            handleSelectChange={setSelectedGarment}
            selectedCategory={selectedGarment}
          />
        </div>

        {/* Gender Dropdown */}
        <div className="mt-[2rem] lg:mt-[2%]">
          <FormSelect
            ref={genderRef}
            open={openGender}
            setOpen={setOpenGender}
            selectedLabel={"Select Gender"}
            MainService={Gender}
            handleSelectChange={setSelectedGender}
            selectedCategory={selectedGender}
          />
        </div>

        {/* Button */}
        <div className="flex justify-center mt-[2rem] lg:mt-[4%]">
          <button className="btn-slider lg:py-[1%]">Analyze My Garment</button>
        </div>

        <p className="text-center mt-[2rem] lg:mt-[2%]">
          We analyze the colors and style of your item to suggest matching
          garments.
        </p>
      </div>
    </div>
  );
};

export default UploadAnImage;
