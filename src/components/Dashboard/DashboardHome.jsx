"use client";
import React from "react";
import DashboardHeader from "./Header";

const stats = [
  { label: "Total Articles", value: 42 },
  { label: "Published", value: 36 },
  { label: "Scheduled", value: 10 },
  { label: "Drafts", value: 6 },
];

const recentArticles = [
  {
    id: 1,
    title: "Fall Fashion Trends",
    category: "Style",
    author: "Sarah Johnson",
    date: "April 20, 2023",
    status: "Published",
    views: 1240,
  },
  {
    id: 2,
    title: "Summer Outfit Ideas",
    category: "Fashion",
    author: "Mark Wilson",
    date: "May 02, 2023",
    status: "Draft",
    views: 0,
  },
  {
    id: 3,
    title: "Winter Layering Guide",
    category: "Trends",
    author: "Emily Clark",
    date: "March 15, 2023",
    status: "Pending",
    views: 320,
  },
  {
    id: 4,
    title: "Street Style Inspiration",
    category: "Lifestyle",
    author: "Alex Brown",
    date: "February 28, 2023",
    status: "Published",
    views: 890,
  },
];
const getStatusClasses = (status) => {
  switch (status) {
    case "Published":
      return "bg-green-100 text-green-700";
    case "Draft":
      return "bg-gray-100 text-gray-600";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Scheduled":
      return "bg-blue-100 text-blue-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};


  const SectionCardsMobile=({label,value,isStatus})=>{
    return(
          <div className="flex justify-between items-center text-[0.8rem]">
              <span className="font-bold">{label}</span>
  {isStatus ? (
        <span
          className={`px-4 py-2 rounded-md text-xs font-bold  text-center
            ${getStatusClasses(value)}
          `}
        >
          {value}
        </span>
      ) : (
        <span>{value}</span>
      )}
            </div>
    )
  }
export default function DashboardHome() {


  return (
    <>
      <DashboardHeader heading="Dashboard Overview" />

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 mb-[1rem] lg:mb-[1%]">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-[1rem] lg:p-[1vw] 2xl:p-[2rem] shadow "
          >
            <h5 className="mb-[1rem] lg:mb-[2%]">{item.label}</h5>
            <h5 className="font-bold">{String(item.value).padStart(2, "0")}</h5>
          </div>
        ))}
      </div>

      <h3 className="mb-[0.5rem] lg:mb-[1%]">Recent Articles</h3>

      <div className="bg-white hidden lg:block rounded-xl shadow p-[1%] overflow-x-auto">
        {/* Desktop Table */}
<table className="w-full ">
  <thead>
    <tr className="text-left border-b border-[#D0D0D0]">
    {["Title","Category","Author","Date","Status"].map((item) => (
  <th key={item} className="pb-[1%] text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem]">{item}</th>))}    
    </tr>
  </thead>

  <tbody>
    {recentArticles.map((item) => (
      <tr key={item} className="border-b border-[#D0D0D0] space-y-[1%]    lg:text-[0.6vw] 2xl:text-[0.85rem] ">
        <td className=" font-[600] py-[1%]">{item.title}</td>
        <td>{item.category}</td>
        <td>{item.author}</td>
        <td>{item.date}</td>
     <td>
  <span
    className={`inline-flex items-center justify-center
      lg:w-[6vw] 2xl:w-[6rem] py-[2%]   text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem] font-medium rounded-md
      ${
        item.status === "Published" 
          ? "bg-green-100 text-green-700"
          : item.status === "Draft"
          ? "bg-gray-100 text-gray-600"
          : "bg-yellow-100 text-yellow-700"
      }
    `}
  >
    {item.status}
  </span>
</td>
      </tr>
    ))}
  </tbody>
</table>

      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {recentArticles.map((item, i) => (
          <div
            key={i}
            className="bg-[#fafafa] p-4 rounded-lg shadow flex flex-col gap-2"
          >
            <SectionCardsMobile label="Title" value={item.title} />
            <SectionCardsMobile label="Category" value={item.category} />
            <SectionCardsMobile label="Author" value={item.author} />
            <SectionCardsMobile label="Date" value={item.date} />
            <SectionCardsMobile isStatus label="Status" value={item.status} />
          </div>
        ))}
      </div>
    </>
  );
}