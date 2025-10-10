"use client";
import React, { useRef, useState, useEffect } from "react";

const ImageColorPicker = () => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedPos, setSelectedPos] = useState(null);
  const [isImageReady, setIsImageReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Draw image to canvas when loaded
  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    img.onload = () => {
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      setIsImageReady(true);
    };
  }, []);

  // 🟦 Function to pick color at mouse position
  const pickColor = (e) => {
    if (!isImageReady) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clamp to image bounds
    const clampedX = Math.min(Math.max(0, x), canvas.width - 1);
    const clampedY = Math.min(Math.max(0, y), canvas.height - 1);

    const pixel = ctx.getImageData(clampedX, clampedY, 1, 1).data;
    const hex =
      "#" +
      ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
        .toString(16)
        .slice(1);

    setSelectedColor(hex);
    setSelectedPos({ x: clampedX, y: clampedY });
  };

  // 🖱 Handle mouse events
  const handleMouseDown = (e) => {
    setIsDragging(true);
    pickColor(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) pickColor(e);
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F3E9] select-none">
      <h3 className="text-sm font-semibold tracking-wide mb-5 uppercase text-gray-800">
        Pick Color by Click or Drag
      </h3>

      <div
        className="relative w-[400px] h-[250px]"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Canvas for picking color */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        ></canvas>

        {/* Underlying image */}
        <img
          ref={imgRef}
          src="/palette.png"
          alt="Color palette"
          className="w-full h-full object-contain rounded-md border border-gray-300"
          draggable="false"
        />

        {/* Marker */}
        {selectedPos && (
          <div
            className="absolute w-4 h-4 border-2 border-white rounded-full pointer-events-none shadow-md"
            style={{
              backgroundColor: selectedColor,
              left: selectedPos.x - 8,
              top: selectedPos.y - 8,
            }}
          ></div>
        )}
      </div>

      {/* Selected color preview */}
      {selectedColor && (
        <div className="mt-6 text-center">
          <div
            className="w-12 h-12 mx-auto border-2 border-black rounded-sm"
            style={{ backgroundColor: selectedColor }}
          ></div>
          <p className="text-gray-700 text-sm mt-2">
            Selected Color:{" "}
            <span className="font-semibold">{selectedColor}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageColorPicker;
