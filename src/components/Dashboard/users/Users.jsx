"use client";
import { Pencil, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import DashboardHeader from "../Header";

const initialUsers = [
  { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", dateJoined: "2024-11-28" },
  { name: "Sarah Smith", email: "sarah@example.com", role: "Admin", status: "Inactive", dateJoined: "2024-11-29" },
  { name: "David Lee", email: "david@example.com", role: "Admin", status: "Suspended", dateJoined: "2024-11-30" },
  { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", dateJoined: "2024-11-30" },
  { name: "David Lee", email: "david@example.com", role: "Admin", status: "Suspended", dateJoined: "2024-11-30" },
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
export default function UsersManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (email) => {
    setUsers(users.filter((user) => user.email !== email));
  };

  const handleEdit = (email) => {
    alert(`Editing user with email: ${email}`);
  };



  return (
      < >
        <DashboardHeader heading="Users Management" />

               <h4 >
         Search Users
        </h4>
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
    placeholder="Search..."
    className="w-full bg-transparent outline-none"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <Search className="text-gray-400 lg:size-[1.2vw] 2xl:size-6" />
</div>

        <div className="flex justify-between items-center mb-[0.5rem] lg:mb-[1%] ">
          <h3>All Users</h3>
          <button className="btn-pink">+ Add Users</button>
        </div>

      <div className="bg-white hidden lg:block rounded-xl shadow p-[1%] overflow-x-auto">
        {/* Desktop Table */}
<table className="w-full ">
  <thead>
    <tr className="text-left border-b border-[#D0D0D0]">
    {["Name","Email","Role","Status","Date Joined","Actions"].map((item) => (
  <th key={item} className="pb-[1%] text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem]">{item}</th>))}    
    </tr>
  </thead>

  <tbody>
    {filteredUsers?.map((item,index) => (
      <tr key={index} className="border-b border-[#D0D0D0] space-y-[1%]    lg:text-[0.6vw] 2xl:text-[0.85rem] ">
        <td className=" font-[600] py-[1%] w-[20%]">{item.name}</td>
        <td className="w-[20%]">{item.email}</td>
        <td className="w-[20%]">{item.role}</td>
        <td className="w-[20%]">{item.status}</td>
        <td className="w-[20%]">{item.dateJoined}</td>
 <td>
  <div className="flex items-center  gap-x-[1.5%] ">
    <button className="btn-gray">
      Edit
    </button>
    <button className="btn-pink">
    Delete
    </button>
  </div>
</td>

      </tr>
    ))}
  </tbody>
</table>

      </div>
        {/* Mobile Cards */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {filteredUsers.map((item, i) => (
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
      </>
  );
}