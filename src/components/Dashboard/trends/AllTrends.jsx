"use client";
import React, { useMemo, useState } from "react";
import {
  Pencil,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  EyeIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { recentArticles } from "./DummyArticles";
import DashboardHeader from "../Header";

const ITEMS_PER_PAGE = 10;
const slugify = (text) =>
  text
    ?.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const AllTrends = () => {


  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const isSelected = (id) => selectedIds.includes(id);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(paginatedArticles.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };
  /* ================= STATUS COLORS ================= */
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

  /* ================= SEARCH ================= */
  const filteredArticles = useMemo(() => {
    return recentArticles.filter((item) =>
      `${item.title} ${item.category} ${item.author.name} ${item.status}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const getPaginationRange = (current, total) => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const SectionCardsMobile = ({ label, value, isStatus }) => (
    <div className="flex justify-between items-center text-[0.8rem]">
      <span className="font-bold">{label}</span>
      {isStatus ? (
        <span
          className={`px-4 py-2 rounded-md text-xs font-bold text-center
            ${getStatusClasses(value)}
          `}
        >
          {value}
        </span>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );

  return (
    <>
      <DashboardHeader heading="All Articles" />

      {/* ================= SEARCH + ADD ================= */}
      <div className="whitespace-nowrap flex sticky lg:static top-23 lg:top-0 p-[0.7rem] lg:p-0 z-10 bg-[#faf5e7] justify-between items-center mb-[0.5rem] lg:mb-[1%] gap-x-[1%]">
        <div
          className="
            w-full my-[0.5rem] lg:my-[1%]
            px-[0.5rem] py-[0.7rem]
            lg:px-[1%] lg:py-[0.5%]
            bg-white 
            text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem]
            flex items-center justify-between
            rounded-md
            border-2 border-gray-300
            focus-within:border-[#F16935]
            transition-all duration-300
          "
        >
          <input
            type="text"
            placeholder="Search Your Articles by Title, Category, Author, Status..."
            className="w-full bg-transparent outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Search className="text-gray-400 size-4 lg:size-[1.2vw] 2xl:size-6" />
        </div>

        <Link href="/dashboard/trends/create" className="btn-pink lg:block hidden">
          + Add Articles
        </Link>
        <Link href="/dashboard/trends/create" className="btn-pink block lg:hidden">
          +
        </Link>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="xl3:min-h-[62vh]  hidden lg:block 2xl:min-h-[36rem]">
        <div className="bg-white  rounded-xl shadow p-[1%]  ">
          <table className="w-full ">
            <thead>
              <tr className="text-left border-b border-[#D0D0D0]">
                {/* CHECKBOX HEADER */}
                <th className="w-[3%] py-[1%]">
                  <input
                    type="checkbox"
                    checked={
                      paginatedArticles.length > 0 &&
                      paginatedArticles.every((item) =>
                        selectedIds.includes(item.id)
                      )
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="
    lg:size-[1vw] 2xl:size-5
    appearance-none
    border-2
    border-[#5b6ea8ad]
    rounded-[3px]
    cursor-pointer
    flex items-center justify-center
    checked:bg-[#F16935]
    checked:border-[#F16935]
    checked:before:content-['✓']
    checked:before:text-white
    checked:before:text-[14px]
    checked:before:flex
    checked:before:items-center
    checked:before:justify-center
  "
                  />
                </th>

                {["Title", "Category", "Author", "Date", "Status", "Actions"].map(
                  (item) => (
                    <th
                      key={item}
                      className="py-[1rem] text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem]"
                    >
                      {item}
                    </th>
                  )
                )}
              </tr>
            </thead>


            <tbody>
              {paginatedArticles.map((item, index) => (

                <tr
                  key={index}
                  className="border-b border-[#D0D0D0] lg:text-[0.6vw] 2xl:text-[0.85rem]"
                >
                  <td className="w-[3%]">
                    <input
                      type="checkbox"
                      checked={isSelected(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="
        lg:size-[1vw] 2xl:size-5
    appearance-none
    border-2
    border-[#5b6ea8ad]
    rounded-[3px]
    cursor-pointer
    flex items-center justify-center
    checked:bg-[#F16935]
    checked:border-[#F16935]
    checked:before:content-['✓']
    checked:before:text-white
    checked:before:text-[14px]
    checked:before:flex
    checked:before:items-center
    checked:before:justify-center
  "
                    />




                  </td>
                  <td className="font-[600] py-[1%] w-[20%]"><Link href={`/dashboard/trends/${slugify(item.title)}`} className="hover:underline">{item.title}</Link></td>
                  <td className="w-[15%]">{item.category}</td>
                  <td className="w-[20%]">{item.author.name}</td>
                  <td className="w-[20%]">{item.date}</td>

                  <td className="w-[20%]">
                    <span
                      className={`inline-flex items-center justify-center
                      lg:w-[6vw] 2xl:w-[6rem] py-[2%]
                      text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem]
                      font-medium rounded-md
                      ${getStatusClasses(item.status)}
                    `}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="flex items-center gap-x-2">
                      <Link href={`/tendencias/${slugify(item.title)}`} ><EyeIcon className="size-[0.8vw] 2xl:size-4 hover:text-[#F16935]" /></Link>
                      <button className=""><Pencil className="size-[0.8vw] 2xl:size-4 hover:text-[#F16935]" /></button>
                      <button className=""><Trash2 className="size-[0.8vw] 2xl:size-4 hover:text-[#F16935]" /></button>
                      <Link href={`/dashboard/trends/${slugify(item.title)}`} ><ArrowRight className="size-[0.8vw] 2xl:size-4 hover:text-[#F16935]" /></Link>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedArticles.map((item, index) => (
          <div
            key={index}
            className="bg-[#fafafa] p-4 rounded-lg shadow flex flex-col gap-2"
          >
            <SectionCardsMobile label="Title" value={item.title} />
            <SectionCardsMobile label="Category" value={item.category} />
            <SectionCardsMobile label="Author" value={item.author.name} />
            <SectionCardsMobile label="Date" value={item.date} />
            <SectionCardsMobile isStatus label="Status" value={item.status} />
            <SectionCardsMobile
              label="Actions"
              value={
                <div className="flex items-center gap-x-4 mt-[0.7rem]">
                  <Link href={`/tendencias/${slugify(item.title)}`} >  <EyeIcon size={16} /></Link>
                  <Trash2 size={16} />
                  <Pencil size={16} />
                  <Link href={`/dashboard/trends/${slugify(item.title)}`} > <ArrowRight size={16} /></Link>
                </div>
              }
            />
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-[2%] bg-[#faf5e7] p-[0.7rem] lg:p-0 z-10 select-none sticky lg:static bottom-0 ">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`size-9 lg:size-[2vw] 2xl:size-9 flex items-center justify-center rounded-full border 
        ${currentPage === 1
                ? "text-[#F16935] border-[#F16935] opacity-60 !cursor-not-allowed"
                : "text-[#F16935] border-[#F16935] hover:bg-[#F16935] hover:text-white"
              }
      `}
          >
            <ChevronLeft className="size-5 lg:size-[1vw] 2xl:size-5" />
          </button>

          {/* Pages */}
          {getPaginationRange(currentPage, totalPages).map((page, index) =>
            page === "..." ? (
              <span
                key={index}
                className="size-9 lg:size-[2vw] 2xl:size-9 flex items-center justify-center text-[#2b2f8f]"
              >
                …
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`size-9 lg:size-[2vw] 2xl:size-9 flex items-center justify-center rounded-full border text-sm font-medium
            ${page === currentPage
                    ? " border-[#F16935] bg-[#F16935] text-white"
                    : "text-[#F16935] border-[#F16935] hover:bg-[#F16935] hover:text-white"
                  }
          `}
              >
                {page}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={` size-9 lg:size-[2vw] 2xl:size-9 flex items-center justify-center rounded-full border !disabled:cursor-not-allowed
        ${currentPage === totalPages
                ? "text-[#F16935] border-[#F16935] opacity-60 !cursor-not-allowed"
                : "text-[#F16935] border-[#F16935] hover:bg-[#F16935] hover:text-white"
              }
      `}
          >
            <ChevronRight className="size-5 lg:size-[1vw] 2xl:size-5" />
          </button>
        </div>
      )}
    </>
  );
};

export default AllTrends;
