"use client";
import React, { useRef, useState, useEffect } from "react";
import FormSelect from "./FormSelect";
import Link from "next/link";

const ImageColorPicker = () => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedPos, setSelectedPos] = useState(null);
  const [isImageReady, setIsImageReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
 const [openGarment, setOpenGarment] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState(null);
  const garmentRef = useRef();

  // Gender Dropdown States
  const [openGender, setOpenGender] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const genderRef = useRef();
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
  // 🖼️ Draw image to canvas when loaded
  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext("2d");

    const drawImageToCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      setIsImageReady(true);
    };

    img.onload = drawImageToCanvas;

    if (img.complete) {
      drawImageToCanvas(); // handle cached images
    }
  }, []);

  // 🟦 Pick color from canvas
  const pickColor = (e) => {
    if (!isImageReady) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;

    const hex =
      "#" +
      ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
        .toString(16)
        .slice(1);

    setSelectedColor(hex);
    setSelectedPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // 🖱 Mouse handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    pickColor(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) pickColor(e);
  };

  // 🛑 Global mouseup listener
  useEffect(() => {
    const stopDragging = () => setIsDragging(false);
    window.addEventListener("mouseup", stopDragging);
    return () => window.removeEventListener("mouseup", stopDragging);
  }, []);

  return (
    <div className="bg-[#F9F3E9] ">
    <div className="flex flex-col items-center container-global justify-center   select-none">
      <h3 className="text-sm font-semibold tracking-wide mb-5 uppercase text-gray-800">
        Pick Color by Click or Drag
      </h3>

      <div className="relative w-[400px] h-[250px] mb-[2%]">
        {/* Canvas overlay */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Image underneath */}

        
        <img
          ref={imgRef}
          src="/palette.png"
          alt="Color palette"
          className="w-full h-full object-contain rounded-md border border-gray-300 pointer-events-none"
          draggable="false"
        />

        {/* Marker */}
        {selectedPos && (
          <div
            className="absolute w-4 h-4 border-2 border-white rounded-full pointer-events-none shadow-md"
            style={{
              // backgroundColor: selectedColor,
              left: selectedPos.x - 8,
              top: selectedPos.y - 8,
            }}
          />
        )}
      </div>

      {/* Selected color preview */}
      {/* {selectedColor && (
        <div className="mt-6 text-center">
          <div
            className="w-12 h-12 mx-auto border-2 border-black rounded-sm"
            style={{ backgroundColor: selectedColor }}
          />
          <p className="text-gray-700 text-sm mt-2">
            Selected Color: <span className="font-semibold">{selectedColor}</span>
          </p>
        </div>
      )} */}
      
        {/* Garment Type Dropdown */}
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

        {/* Button */}
        <div className="flex justify-center mt-[2rem] lg:mt-[2%]">
          <Link href={"/product-analyzation"}>
          <button className="btn-orange xl:w-[10vw] lg:w-[15vw]">Analyze My Garment</button>
          </Link>

        </div>
    </div>
    </div>

  );
};

export default ImageColorPicker;
