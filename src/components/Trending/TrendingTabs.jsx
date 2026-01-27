"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import data from "@/app/trendingDummyData.json";
import Image from "next/image";
import Link from "next/link";
import FormSelect from "../FormSelect";
import { ArrowRightIcon } from "lucide-react";

const TrendingTabs = () => {
  const [activeTab, setActiveTab] = useState("Moda");
  const [open, setOpen] = useState(false);
  const openDropdownRef = useRef(null);

  const trends = data?.trends ?? [];
  const categories = data?.categories ?? [];

  const filteredArticles = useMemo(
    () => trends.filter((item) => item.category === activeTab),
    [trends, activeTab],
  );

  const slugify = (text) =>
    text
      ?.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

  const handleSelectChange = (value) => {
    setActiveTab(value);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!openDropdownRef.current) return;
      if (openDropdownRef.current.contains(e.target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  return (
    <div>
      
      <div className="hidden lg:flex flex-wrap gap-4 justify-center items-center sticky top-[8%] bg-[#F9F3E9] py-[2%]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.name)}
            className={activeTab === cat.name ? "btn-blue" : "btn-white"}
          >
            {cat.name}
          </button>
        ))}
      </div>
      {/* 🔹 MOBILE DROPDOWN */}
      <div
        className="block lg:hidden mt-[1rem] w-full sticky z-20 top-24 "
        ref={openDropdownRef}
      >
        <FormSelect
          isBlueDropdown={true}
          open={open}
          ref={openDropdownRef}
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
      {/*  */}
      {/* 🔹 ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {filteredArticles.map((item) => (
          <Link
            href={`/tendances/${slugify(item.title, item.id)}`}
            key={item.id}
            className="lg:mt-[4%] flex flex-row items-start gap-x-[1rem] p-[0.5rem] lg:p-0 lg:flex-col lg:rounded-lg overflow-hidden border-b lg:border-gray-300 lg:border lg:border-gray-200 lg:bg-white lg:shadow-sm hover:shadow-lg transition cursor-pointer"
          >
            {/* IMAGE */}
            <Image
              src={item.mainImage}
              alt={item.title}
              width={400}
              height={400}
              className="w-[6rem] lg:w-full h-[6rem] 2xl:h-[16rem] lg:h-[16vw] object-cover rounded-md lg:rounded-none"
            />

            {/* CONTENT */}
            <div className="flex flex-col h-full relative lg:p-[4%]">
              <h4 className="mb-[1%]">{item.title}</h4>

              <p className="md:h-[4rem] lg:h-[5.5vw] 2xl:h-[6.5rem]">
                {item.subtitle?.slice(0, 80)}
              </p>
              <div className="flex justify-between">
                <div>
                  <h6 className="my-[0.5rem] lg:my-[2%]">
                    BY{" "}
                    <span style={{ color: "#F16935" }}>{item.authorName}</span>
                  </h6>

                  <p>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* 🔹 ARROW FIXED (NO FONT CHANGE) */}
                <div className="mt-auto flex lg:hidden justify-end pt-[0.5rem]">
                  <ArrowRightIcon className="size-4 text-black" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingTabs;
