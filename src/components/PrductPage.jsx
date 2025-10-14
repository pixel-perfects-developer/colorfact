"use client";
import Image from "next/image";
import React, { useState } from "react";

const ProductPage = () => {
  const product = {
    title: "CHEMISE À IMPRIMÉ ABSTRAIT",
    price: 99,
    description:
      "Chemise à coupe décontractée. Col camp et manches courtes. Fermeture boutonnée à l’avant.",
    colors: [
      { name: "Bleu", hex: "#2D5BFF" },
      { name: "Gris", hex: "#555555" },
      { name: "Menthe", hex: "#B6E0D6" },
      { name: "Bleu clair", hex: "#C8D3FF" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2X"],
    images: ["/shirt.png", "/suit.png", "/shirt.png", "/suit.png"], // à remplacer par de vraies images
  };


const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="bg-white">
    <div className="container-global flex flex-col md:flex-row justify-center  md:gap-x-[4%] lg:gap-x-[10%]  ">
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
        <h2>
          {product.title}
        </h2>
        <h4 className="my-[2%] ">€{product.price}</h4>
        <p className="text-gray-400">Prix TTC, toutes taxes comprises</p>
        <p className="text-sm my-[2%]" >{product.description}</p>
        <button className="w-full mt-[14%] bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-800 transition">
          Buy
        </button>
      </div>
    </div>
    </div>

  );
};

export default ProductPage;
