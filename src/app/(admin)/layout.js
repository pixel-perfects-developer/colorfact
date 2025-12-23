import Sidebar from "@/components/Dashboard/SideBar";

export default function AdminLayout({ children }) {
  return (
    <>
    {/* <main> */}
    <Sidebar />
    <div className="w-full lg:w-[84%] ml-auto min-h-screen p-[1rem] lg:p-[2%] bg-[#faf5e7] font-sans">
          {children}
    </div>
    {/* </main> */}

    </>
  );
}
