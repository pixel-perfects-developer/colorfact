"use client";
import Link from "next/link";
import React from "react";

const stats = [
  { label: "Total Articles", value: 42 },
  { label: "Published", value: 36 },
  { label: "Drafts", value: 6 },
];

const recentArticles = [
  {
    title: "Fall Fashion Trends",
    category: "Style",
    date: "April 20, 2023",
    status: "Published",
  },
  {
    title: "Fall Fashion Trends",
    category: "Style",
    date: "April 20, 2023",
    status: "Published",
  },
  {
    title: "Fall Fashion Trends",
    category: "Style",
    date: "April 20, 2023",
    status: "Published",
  },
  {
    title: "Fall Fashion Trends",
    category: "Style",
    date: "April 20, 2023",
    status: "Published",
  },
];

export default function DashboardHome() {
  return (
    <div className="w-full h-screen p-[4%]  lg:p-[2%]">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap ">
        <h2>Dashboard Overview</h2>
        <button className="btn-gray w-full sm:w-auto">Logout</button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-[2%]">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow flex flex-col gap-6"
          >
            <h5>{item.label}</h5>
            <h5 className="font-bold text-2xl">{String(item.value).padStart(2, "0")}</h5>
          </div>
        ))}
      </div>

      {/* RECENT ARTICLES */}
      <h3 className="my-6">Recent Articles</h3>

      <div className="bg-white hidden md:block rounded-xl shadow p-4 overflow-x-auto">
        {/* Desktop Table */}
        <table className="w-full hidden md:table">
          <thead>
            <tr className="text-left border-b border-[#D0D0D0] ">
              <th className="pb-2">Title</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentArticles.map((item, i) => (
              <tr key={i} className="border-b border-[#D0D0D0]">
                <td className="py-4">{item.title}</td>
                <td>{item.category}</td>
                <td>{item.date}</td>
                <td className="text-green-600 font-medium">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 ">
        {recentArticles.map((item, i) => (
          <div
            key={i}
            className="bg-[#fafafa] p-4 rounded-lg shadow flex flex-col gap-2"
          >
            <div className="flex justify-between">
              <span className="font-semibold">Title:</span>
              <span>{item.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Category:</span>
              <span>{item.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Date:</span>
              <span>{item.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Status:</span>
              <span className="text-green-600 font-medium">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}