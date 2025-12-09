"use client";
import React, { useEffect, useRef, useState } from "react";
import data from "@/app/trendingDummyData.json";
import Image from "next/image";
import Link from "next/link";
import FormSelect from "../FormSelect";
const TrendingTabs = () => {
  const [activeTab, setActiveTab] = useState("Moda");
  const [open, setOpen] = useState(false);
  const openDropdownRef = useRef(null);

  const trends = data?.trends ?? [];
  const categories = data?.categories ?? [];
  const filteredArticles = trends.filter((item) => item.category === activeTab);
  const slugify = (text) =>
    text
      ?.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  const handleSelectChange = (value) => {
    setActiveTab(value);
  };
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (
          openDropdownRef.current?.contains(e.target) 
        )
          return;
  
        setOpen(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  return (
    <div className=" mt-[2rem] lg:mt-[2%]">
      {/* 🔹 Tabs */}
      <div className="hidden lg:flex flex-wrap gap-4 justify-center items-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.name)}
            className={activeTab == cat.name ? "btn-blue" : "btn-white"}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="block lg:hidden">
        <FormSelect
        ref={openDropdownRef} isBlueDropdown={true}
        open={open}
        setOpen={setOpen}
        selectedLabel="Sélectionner le type de vêtement"
        MainService={categories.map((cat, i) => ({
          id: i,
          name: cat.name,
        }))}
        handleSelectChange={handleSelectChange}
        selectedCategory={activeTab}
      />
      </div>

      {/* 🔹 Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {filteredArticles.map((item) => (
          <Link
            href={`/tendencias/${slugify(item.title)}`}
            key={item.id}
            className={`lg:mt-[4%]  rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition cursor-pointer`}
          >
            <Image
              src={item.mainImage}
              alt={item.title}
              width={400}
              height={400}
              className="w-full object-contain "
            />

            <div className="p-[4%]">
              <h4 className="mb-[1%]">{item.title}</h4>
              <p>{item.subtitle}</p>
              <h6 className=" my-[2rem] lg:my-[2%]">BY  <span style={{color:"#F16935"}}>{item.authorName}</span></h6>
           <p >
  {new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
</p>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingTabs;
