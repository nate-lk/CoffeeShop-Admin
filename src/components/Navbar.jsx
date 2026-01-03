import React from "react";
import { assets } from "../assets/assets";
import { LogOut, Bell, Search, User, Menu } from "lucide-react";
import { adminApi } from "../../api/admin-api";
import Swal from "sweetalert2";

const Navbar = () => {
  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Đăng xuất?",
      text: "Bạn sẽ cần đăng nhập lại để truy cập.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
      width: "350px",
      customClass: {
        title: "text-lg font-bold",
        popup: "rounded-xl p-6",
        confirmButton: "rounded-lg",
      },
    });

    if (!confirm.isConfirmed) return;

    try {
      await adminApi.logout();
    } catch (_) {
      // Even if backend fails, still clear state
    }

    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between h-16">
      
      {/* Left: Logo & Mobile Menu Toggle */}
      <div className="flex items-center gap-4">
        {/* Mobile menu icon (Visual placeholder for responsive expansion) */}
        <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
           <Menu size={20} />
        </button>
        
        <img
          className="h-8 sm:h-10 w-auto object-contain"
          src={assets.logo}
          alt="Velvet Roast Logo"
        />
      </div>

      {/* Center: Search Bar (Hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all text-sm"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        
        {/* Notification Icon */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>

        {/* Profile & Logout */}
        <div className="flex items-center gap-3">
          {/* Avatar Circle */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 border border-amber-200 shadow-sm">
             <User size={18} />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-lg transition-all text-xs sm:text-sm font-medium group"
            title="Đăng xuất"
          >
            <span className="hidden sm:inline">Đăng xuất</span>
            <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;