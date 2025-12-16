"use client";
// app/manage-trends/page.js
import React, { useEffect, useRef, useState } from "react";
// import { IoChevronDown } from "react-icons/io5";

export default function ManageTrends() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Select");
  const [isOn, setIsOn] = useState(false);
  const dropdownRef = useRef(null);

  const options = ["Fashion", "Style", "Travel", "Tech"];

  const handleToggle = () => {
    setIsOn((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full min-h-screen p-[4%]  lg:p-[2%] bg-[#faf5e7] font-sans">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          Manage Trends
        </h1>
        <button className="btn-gray w-full sm:w-auto">Logout</button>
      </header>

      {/* Add Article Section */}
      <section className="w-full pb-10 border-b border-b-[#d0d0d0]">
        <h4 className="mb-4 text-black text-lg">Add Trend Article</h4>

        <form className="space-y-6">
          {/* Title */}
          <div>
            <h6 className="mb-2 text-black">Title</h6>
            <input
              type="text"
              id="title"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sub title */}
          <div>
            <h6 className="mb-2 text-black">Sub-title / Short Intro</h6>
            <input
              type="text"
              id="subtitle"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category + Tags */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Category */}
            <div className="w-full md:w-1/2 relative" ref={dropdownRef}>
              <h6 className="mb-2 text-black">Category</h6>

              <div
                onClick={() => setOpen(!open)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md 
                flex justify-between items-center cursor-pointer select-none"
              >
                <span className="text-gray-700">{selected}</span>
                {/* <IoChevronDown
                  className={`text-xl transition-transform duration-300 ${open ? "rotate-180" : ""
                    }`}
                /> */}
              </div>

              <ul
                className={`
                            absolute left-0 right-0 bg-white border border-gray-300 rounded-md
                            mt-1 shadow-md z-20 overflow-hidden
                            transition-all duration-300 ease-in-out
                            ${open
                                            ? 'max-h-60 opacity-100 translate-y-0'
                                            : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'}
                          `}
              >
                {options.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSelected(option);
                      setOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  >
                    {option}
                  </li>
                ))}
              </ul>

            </div>

            {/* Tags */}
            <div className="w-full md:w-1/2">
              <h6 className="mb-2 text-black">Tags</h6>
              <input
                type="text"
                id="tags"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Image + Publish Switch */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="w-full md:w-1/2">
              <h6 className="mb-2 text-black">Image</h6>

              <div className="w-full flex items-center bg-white border border-gray-300 rounded-md">
                <input
                  type="text"
                  id="image"
                  placeholder="Upload"
                  className="flex-1 px-3 py-2"
                  readOnly
                />
                <button
                  type="button"
                  className="ml-2 px-4 py-2 bg-[#f7f7f9] rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  Browse
                </button>
              </div>
            </div>

            {/* Publish Switch */}
            <div className="flex flex-col">
              <h6 className="text-gray-800 mb-3">Publish</h6>

              <div
                onClick={handleToggle}
                className={`w-14 h-7 flex items-center rounded-full cursor-pointer transition-colors duration-300 ${isOn ? "bg-[#446dbc]" : "bg-gray-300"
                  }`}
              >
                <div
                  className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn ? "translate-x-7" : "translate-x-1"
                    }`}
                />
              </div>
            </div>
          </div>
        </form>
      </section>

      {/* All Articles */}
      <h4 className="my-4 text-lg">All Articles</h4>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-700">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-gray-200">
              <td className="px-6 py-4 text-gray-900">
                Fall Fashion Trends
              </td>
              <td className="px-6 py-4 text-gray-900">Style</td>
              <td className="px-6 py-4 text-gray-900">April 20, 2023</td>
              <td className="px-6 py-4 text-gray-900">Published</td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <button className="btn-gray">Edit</button>
                  <button className="btn-pink">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h5 className="text-gray-900 font-medium text-base">
                Fall Fashion Trends
              </h5>
              <p className="text-sm text-gray-500">Category: Style</p>
              <p className="text-sm text-gray-500">
                Date: April 20, 2023
              </p>
              <p className="text-sm text-gray-500">Status: Published</p>
            </div>
            <div className="flex space-x-2 mt-2">
              <button className="btn-gray text-xs px-2 py-1">
                Edit
              </button>
              <button className="btn-pink text-xs px-2 py-1">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}