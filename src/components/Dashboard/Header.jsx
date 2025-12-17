import React from "react";

const DashboardHeader = ({ heading }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        
        {/* Heading */}
        <h2 className="text-lg font-semibold leading-none">
          {heading}
        </h2>

        {/* Logout Button */}
        <button
          className="btn-gray h-[36px] px-4 flex items-center justify-center"
          onClick={() => {
            localStorage.removeItem("isLogin");
            window.location.href = "/authentication/login";
          }}
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default DashboardHeader;
