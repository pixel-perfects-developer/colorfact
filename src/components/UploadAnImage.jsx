"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import FormSelect from "./FormSelect";
import Link from "next/link";
import DropDownMenu from "./DropDownMenu";

const UploadAnImage = () => {
const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // 🔹 Image upload handlers
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };
  const handleDragOver = (e) => e.preventDefault();

  // 🔹 Dynamically load subcategories

  return (
    <div className="bg-[#faf5e7]">
      <div className="container-global lg:w-[70%] mx-auto min-h-[clamp(32rem,79vh,50rem)] flex flex-col items-center justify-center">
        {/* 🖼 Upload Area */}
        <div
          className="border-2 border-dashed border-gray-400 rounded-[1vw] py-[3%] mb-[2%] w-full cursor-pointer hover:border-orange-400 transition-colors"
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
                className="w-[60%] md:w-[30%] lg:w-[20%]"
              />
            ) : (
              <Image
                src="/drag-drop.png"
                alt="drag-drop-upload"
                width={400}
                height={400}
                className="w-[60%] md:w-[30%] lg:w-[20%]"
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

        {/* 🔸 Dropdown Section */}
         <DropDownMenu/>
        {/* 🔘 CTA */}
        <div className="flex justify-center mt-[2rem] lg:mt-[2%]">
          <Link href="/articles">
            <button className="btn-orange">Analyser mon vêtement</button>
          </Link>
        </div>

        <p className="text-center mt-[2rem] lg:mt-[2%]">
          Nous analysons les couleurs et le style de votre article afin de vous
          suggérer des vêtements assortis.
        </p>
      </div>
    </div>
  );
};

export default UploadAnImage;
