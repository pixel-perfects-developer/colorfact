"use client";
import { Search } from "lucide-react";
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

  return (
    <div className="w-full min-h-screen flex font-sans p-[4%]  lg:p-[2%]">
      <div className="w-full max-w-[1800px] min-h-screen m-auto bg-[#faf5e7]  font-sans">
        <DashboardHeader heading="Users Management" />
        <h3 className="text-md font-medium">
          Add Trend Article
        </h3>
        <div className="mb-4">
          <h4 className="my-2">Search Users</h4>
          <div className="flex px-[1%] py-[0.5%] items-center bg-white border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#EEA9AB]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="text-gray-300" />
          </div>
        </div>

        <div className="bg-[#faf5e7] flex justify-between items-center mb-[2%]">
          <h3>All Users</h3>
          <button className="btn-pink">+ Add Users</button>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-2xl shadow px-[2%] overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-[#D0D0D0] text-left">
                <th className="px-6 py-4 w-1/6"><h5>Name</h5></th>
                <th className="px-6 py-4 w-1/6"><h5>Email</h5></th>
                <th className="px-6 py-4 w-1/6"><h5>Role</h5></th>
                <th className="px-6 py-4 w-1/6"><h5>Status</h5></th>
                <th className="px-6 py-4 w-1/6"><h5>Date Joined</h5></th>
                <th className="px-6 py-4 w-1/6"><h5>Actions</h5></th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index} className="border-b border-[#D0D0D0]">
                  <td className="px-6 py-4 font-medium text-gray-900"><h6>{user.name}</h6></td>
                  <td className="px-6 py-4 text-gray-600"><h6>{user.email}</h6></td>
                  <td className="px-6 py-4 text-gray-600"><h6>{user.role}</h6></td>
                  <td className="px-6 py-4">
                    <div className={`px-3 py-1 inline-block rounded-full ${getStatusColor(user.status)}`}>
                      <h6>{user.status}</h6>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600"><h6>{user.dateJoined}</h6></td>
                  <td className="px-6 py-4 flex gap-3">
                    <button className="btn-gray px-3 py-1 rounded-lg"><h6>Edit</h6></button>
                    <button className="btn-pink px-3 py-1 rounded-lg"><h6>Delete</h6></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden grid gap-4">
          {filteredUsers.map((user, index) => (
            <div key={index} className="bg-white p-4 rounded-2xl shadow-md flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h5 className="font-medium text-gray-900">{user.name}</h5>
                <h5 className={`px-3 py-1 rounded-full ${getStatusColor(user.status)}`}>
                  {user.status}
                </h5>
              </div>
              <p>{user.email}</p>
              <p>Role: {user.role}</p>
              <p>Joined: {user.dateJoined}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(user.email)} className="btn-gray">Edit</button>
                <button onClick={() => handleDelete(user.email)} className="btn-pink">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}