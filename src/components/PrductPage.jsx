"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Heart } from "lucide-react";

const ProductPage = () => {
  const product = {
    title: "ABSTRACT PRINT SHIRT",
    price: 99,
    description:
      "Relaxed-fit shirt. Camp collar and short sleeves. Button-up front.",
    colors: [
      { name: "Blue", hex: "#2D5BFF" },
      { name: "Gray", hex: "#555555" },
      { name: "Mint", hex: "#B6E0D6" },
      { name: "Light Blue", hex: "#C8D3FF" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2X"],
    images: ["/shirt.png", "/suit.png", "/shirt.png", "/suit.png"], // replace with real images
  };

const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].hex);
  const [selectedSize, setSelectedSize] = useState("");
  const [liked, setLiked] = useState(false);

  return (
    <div className="container-global flex flex-col md:flex-row justify-center  md:gap-x-[4%] lg:gap-x-[10%]  bg-white">
      {/* 🖼️ Left Section: Main Image + Thumbnails */}
      <div className="flex gap-6 w-full lg:w-[40%] p-[1rem] lg:p-0">
        {/* Thumbnails */}

           {/* Main Image */}
        <div className="relative flex-1  w-[60%] rounded-lg overflow-hidden shadow-sm">
          <Image
    src={product.images[selectedIndex]}
            alt={product.title}
            fill
            className="object-contain p-[2%]"
            priority
          />
        </div>
        <div className="flex flex-col gap-4">
          {product.images.map((img, index) => (
            <div
              key={index}
    onClick={() => setSelectedIndex(index)}
              className={`relative w-20 h-20 border rounded-md overflow-hidden cursor-pointer transition ${
      selectedIndex === index ? "border-[#2D5BFF]" : "border-gray-300"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index}`}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 📋 Right Section: Product Details */}
      <div className="flex flex-col mt-[1rem] lg:mt-0 w-full lg:w-[25%] border border-[#D9D9D9] rounded-md p-[1rem] lg:p-[2%] relative">
     <button
        onClick={() => setLiked(!liked)}
        className="absolute top-0 right-3  rounded-full  transition mt-[2%]"
      >
        <Heart
          size={20}
          color={liked ? "red" : "#666"}
          fill={liked ? "red" : "none"}
          className="transition-transform duration-300 hover:scale-110 rotate-320"
        />
      </button>
        <h2>
          {product.title}
        </h2>
        <h4 className="my-[2%] ">${product.price}</h4>
        <p className="text-gray-400">
          MRP incl. of all taxes
        </p>
        <p className="text-sm my-[2%]" >{product.description}</p>
        <div className="mt-[2%]">
          <h4 className="font-medium mb-[2%]">Color</h4>
          <div className="flex gap-2">
            {product.colors.map((color, i) => (
              <button
                key={i}
                onClick={() => setSelectedColor(color.hex)}
                className={`w-8 h-8  border transition ${
                  selectedColor === color.hex
                    ? "ring-2 ring-offset-2 ring-[#2d5aff3b]"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color.hex }}
              ></button>
            ))}
          </div>
        </div>

        {/* 📏 Size Section */}
        <div className="mt-[6%]">
          <h4 className="font-medium mb-[2%]">Size</h4>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size, i) => (
              <button
                key={i}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-md transition ${
                  selectedSize === size
                    ? "border-[#2D5BFF] bg-[#2D5BFF] text-white"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-[6%]">
            <button className="hover:underline">FIND YOUR SIZE</button>
            <button className="hover:underline">MEASUREMENT GUIDE</button>
          </div>
        </div>

        {/* 🛒 Buy Button */}
        <button className="w-full mt-[14%] bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-800 transition">
          Buy
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
