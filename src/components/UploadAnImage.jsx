"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import FormSelect from "./FormSelect";
import Link from "next/link";

const UploadAnImage = () => {
  // Dropdown open states
  const [openGarment, setOpenGarment] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState(null);
  const garmentRef = useRef();

  const [openGender, setOpenGender] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const genderRef = useRef();

  // Image preview state
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Options data
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

  // Close dropdown on outside click
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

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleDragOver = (e) => e.preventDefault();

  // Debug selected garment
  console.log("selectedGarment", selectedGarment);

  return (
    <div className="bg-[#faf5e7] min-h-screen">
      <div className="container-global lg:w-[70%] mx-auto">
        {/* Upload area */}
        <div
          className="border-2 border-dashed border-gray-400 rounded-[1vw] py-[5%]  mb-[2%] cursor-pointer"
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex justify-center">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="uploaded-garment"
                width={400}
                height={400}
                className="w-[80%] md:w-[30%]"
              />
            ) : (
              <Image
                src="/drag-drop.png"
                alt="drag-drop-upload"
                width={400}
                height={400}
                className="w-[80%] md:w-[30%]"
              />
            )}
          </div>
          <p className="text-center mt-[2rem] lg:mt-[2%] w-[80%] lg:w-[40%] mx-auto text-gray-700">
            {!imagePreview &&
              "Drag-and-drop a photo of your favorite garment and discover what to pair it with!"}
          </p>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Garment dropdown */}
        <div className="mt-[2rem] lg:mt-[1%] w-full">
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
        <div className="mt-[2rem] lg:mt-[1%] w-full">
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

        {/* Submit button */}
        <div className="flex justify-center mt-[2rem] lg:mt-[2%]">
           <Link href={"/product-analyzation"}>
          <button className="btn-orange xl:w-[10vw] lg:w-[15vw] ">Analyze My Garment</button></Link>
        </div>

        <p className="text-center mt-[2rem] lg:mt-[2%]">
          We analyze the colors and style of your item to suggest matching garments.
        </p>
      </div>
    </div>
  );
};

export default UploadAnImage;
