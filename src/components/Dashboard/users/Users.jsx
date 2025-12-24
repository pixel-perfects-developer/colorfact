"use client";
import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import DashboardHeader from "../Header";

const initialUsers = [
  { id: 1,  name: "John Doe",            email: "john@example.com",        role: "Admin",  status: "Active",     dateJoined: "2024-11-28" },
  { id: 2,  name: "Sarah Smith",         email: "sarah@example.com",       role: "Admin",  status: "Inactive",   dateJoined: "2024-11-29" },
  { id: 3,  name: "David Lee",           email: "david@example.com",       role: "Admin",  status: "Suspended",  dateJoined: "2024-11-30" },
  { id: 4,  name: "Emma Johnson",        email: "emma@example.com",        role: "Editor", status: "Active",     dateJoined: "2024-12-01" },
  { id: 5,  name: "Michael Brown",       email: "michael@example.com",     role: "Admin",  status: "Active",     dateJoined: "2024-12-02" },
  { id: 6,  name: "Olivia Davis",        email: "olivia@example.com",      role: "Editor", status: "Inactive",   dateJoined: "2024-12-03" },
  { id: 7,  name: "James Wilson",        email: "james@example.com",       role: "Admin",  status: "Active",     dateJoined: "2024-12-04" },
  { id: 8,  name: "Sophia Miller",       email: "sophia@example.com",      role: "Editor", status: "Suspended",  dateJoined: "2024-12-05" },
  { id: 9,  name: "Daniel Taylor",       email: "daniel@example.com",      role: "Admin",  status: "Active",     dateJoined: "2024-12-06" },
  { id: 10, name: "Isabella Moore",      email: "isabella@example.com",    role: "Editor", status: "Active",     dateJoined: "2024-12-07" },

  { id: 11, name: "William Anderson",    email: "william@example.com",     role: "Admin",  status: "Inactive",   dateJoined: "2024-12-08" },
  { id: 12, name: "Mia Thomas",          email: "mia@example.com",         role: "Editor", status: "Active",     dateJoined: "2024-12-09" },
  { id: 13, name: "Ethan Jackson",       email: "ethan@example.com",       role: "Admin",  status: "Suspended",  dateJoined: "2024-12-10" },
  { id: 14, name: "Charlotte White",     email: "charlotte@example.com",   role: "Editor", status: "Active",     dateJoined: "2024-12-11" },
  { id: 15, name: "Alexander Harris",    email: "alexander@example.com",   role: "Admin",  status: "Active",     dateJoined: "2024-12-12" },
  { id: 16, name: "Amelia Martin",       email: "amelia@example.com",      role: "Editor", status: "Inactive",   dateJoined: "2024-12-13" },
  { id: 17, name: "Benjamin Thompson",   email: "benjamin@example.com",    role: "Admin",  status: "Active",     dateJoined: "2024-12-14" },
  { id: 18, name: "Harper Garcia",       email: "harper@example.com",      role: "Editor", status: "Suspended",  dateJoined: "2024-12-15" },
  { id: 19, name: "Lucas Martinez",      email: "lucas@example.com",       role: "Admin",  status: "Active",     dateJoined: "2024-12-16" },
  { id: 20, name: "Evelyn Robinson",     email: "evelyn@example.com",      role: "Editor", status: "Active",     dateJoined: "2024-12-17" },

  // { id: 21, name: "Henry Clark",         email: "henry@example.com",       role: "Admin",  status: "Inactive",   dateJoined: "2024-12-18" },
  // { id: 22, name: "Abigail Lewis",       email: "abigail@example.com",     role: "Editor", status: "Active",     dateJoined: "2024-12-19" },
  // { id: 23, name: "Sebastian Walker",    email: "sebastian@example.com",   role: "Admin",  status: "Suspended",  dateJoined: "2024-12-20" },
  // { id: 24, name: "Emily Hall",          email: "emily@example.com",       role: "Editor", status: "Active",     dateJoined: "2024-12-21" },
];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-[#dbfce7] text-[#238236]";
      case "Inactive":
        return "bg-[#ffe2e2] text-[#ed270b]";
      case "Suspended":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const SectionCardsMobile=({label,value,isStatus})=>{
    return(
          <div className="flex justify-between items-center text-[0.8rem]">
              <span className="font-bold">{label}</span>
  {isStatus ? (
        <span
          className={`px-4 py-2 rounded-md text-xs font-bold  text-center
            ${getStatusColor(value)}
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
  const ITEMS_PER_PAGE = 8;

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const [selectedIds, setSelectedIds] = useState([]);

const isSelected = (id) => selectedIds.includes(id);

const toggleSelect = (id) => {
  setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  );
};

const toggleSelectAll = (checked) => {
  if (checked) {
    setSelectedIds(paginatedUsers.map((u) => u.id));
  } else {
    setSelectedIds([]);
  }
};

 
   /* ================= SEARCH ================= */
const filteredUsers = useMemo(() => {
  return initialUsers.filter((user) =>
    `${user.name} ${user.email} ${user.role} ${user.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
}, [searchTerm]);
   /* ================= PAGINATION ================= */
const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

const paginatedUsers = useMemo(() => {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
}, [filteredUsers, currentPage]);
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
 
  return (
      < >
        <DashboardHeader heading="Users Management" />
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
      placeholder="Search by name,email,role,status..."
    className="w-full bg-transparent outline-none"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="text-gray-400 size-4 lg:size-[1.2vw] 2xl:size-6" />
        </div>

        <button className="btn-pink lg:block hidden">
          + Add User
        </button>
                <button className="btn-pink block lg:hidden">
          + 
        </button>
      </div>
       <div className="xl3:min-h-[62vh]  hidden lg:block 2xl:min-h-[30rem]">

      <div className="bg-white  rounded-xl shadow p-[1%] overflow-x-auto">
        {/* Desktop Table */}
<table className="w-full ">
  <thead>
    
    <tr className="text-left border-b border-[#D0D0D0]">
     <th className="w-[3%] pb-[0.5%]">
      <input
        type="checkbox"
  checked={
    paginatedUsers.length > 0 &&
    paginatedUsers.every((u) => selectedIds.includes(u.id))
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
   {["Name","Email","Role","Status","Date Joined","Actions"].map((item) => (
  <th key={item} className="pb-[0.5%] text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem]">{item}</th>))}    
    </tr>
  </thead>

  <tbody>
    {paginatedUsers?.map((item,index) => (
      <tr key={index} className="border-b border-[#D0D0D0] space-y-[1%]    lg:text-[0.6vw] 2xl:text-[0.85rem] ">
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




</td>  <td className=" font-[600] py-[1%] w-[20%]">{item.name}</td>
        <td className="w-[20%]">{item.email}</td>
        <td className="w-[20%]">{item.role}</td>
        <td className="w-[20%]">    <span
                      className={`inline-flex items-center justify-center
                      lg:w-[6vw] 2xl:w-[6rem] py-[2%]
                      text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem]
                      font-medium rounded-md
                      ${getStatusColor(item.status)}
                    `}
                    >
                      {item.status}
                    </span></td>
        <td className="w-[20%]">{item.dateJoined}</td>
 <td>
   <div className="flex items-center gap-x-4 mt-[0.7rem]">
                  <Trash2 size={16} />
                  <Pencil size={16} />
                </div>
</td>

      </tr>
    ))}
  </tbody>
</table>

      </div>
      </div>
        {/* Mobile Cards */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {paginatedUsers.map((item, i) => (
          <div
            key={i}
            className="bg-[#fafafa] p-4 rounded-lg shadow flex flex-col gap-2"
          >
            <SectionCardsMobile label="Title" value={item.name} />
            <SectionCardsMobile label="Email" value={item.email} />
            <SectionCardsMobile label="Role" value={item.role} />
            <SectionCardsMobile isStatus label="Status" value={item.status} />
            <SectionCardsMobile  label="Date Joined" value={item.dateJoined} />
            <SectionCardsMobile  label="Actions" value={  <div className="flex items-center  gap-x-6 ">
 <button >
  <Trash2 size={16} />
</button> <button >
  <Pencil size={16} />
</button>



  </div>} />
          </div>
        ))}
      </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-[2%] bg-[#faf5e7] p-[0.7rem] lg:p-0 z-10 select-none sticky lg:static bottom-0 ">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`size-9 lg:size-[2vw] 2xl:size-9 flex items-center justify-center rounded-full border 
              ${
                currentPage === 1
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
                  ${
                    page === currentPage
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
              ${
                currentPage === totalPages
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
}