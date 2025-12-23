import React from "react";

const DashboardHeader = ({ heading }) => {
  const handleLogout = () => {
    document.cookie = "isLogin=; Max-Age=0; path=/";

    window.location.href = "/authentication/login";
  };

  return (
    <div className="lg:sticky lg:top-0 lg:z-10 bg-[#faf5e7] pb-[1rem] lg:pb-[1%]">
      <div className="flex items-center justify-between">
        
        {/* Heading */}
        <h2>
          {heading}
        </h2>

        {/* Logout Button */}
        <button
          className="btn-gray flex items-center justify-center"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default DashboardHeader;
