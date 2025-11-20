import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  const baseLinkStyle =
    "flex items-center gap-3 px-4 py-2  border border-[#d7ccc8] bg-[#fffaf7] text-[#3e2723] font-medium transition-all duration-300 hover:bg-[#f3e5ab] hover:shadow-md";
  const activeLinkStyle =
    "bg-[#d7ccc8] text-[#3e2723] shadow-inner border-[#a1887f]";

  return (
    <div className="w-[18%] min-h-screen border-r border-[#a1887f] bg-[#f8f3ef] shadow-inner flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-[#d7ccc8]">
        <h2 className="text-xl font-semibold tracking-wide text-[#4e342e] hidden md:block">
          Dashboard
        </h2>
      </div>

      {/* Nav Section */}
      <div className="flex flex-col gap-3 px-4 pt-6 text-sm">
        <NavLink
          to="/list"
          className={({ isActive }) =>
            `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
          }
        >
          <img className="w-5 h-5 opacity-80" src={assets.order_icon} alt="" />
          <span className="hidden md:block">Sản phẩm</span>
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
          }
        >
          <img className="w-5 h-5 opacity-80" src={assets.add_icon} alt="" />
          <span className="hidden md:block">Thêm SP</span>
        </NavLink>

        <NavLink
          to="/list-category"
          className={({ isActive }) =>
            `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
          }
        >
          <img className="w-5 h-5 opacity-80" src={assets.order_icon} alt="" />
          <span className="hidden md:block">
            Phân loại
          </span>
        </NavLink>

        <NavLink
          to="/add-category"
          className={({ isActive }) =>
            `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
          }
        >
          <img className="w-5 h-5 opacity-80" src={assets.add_icon} alt="" />
          <span className="hidden md:block">Thêm phân loại</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
          }
        >
          <img className="w-5 h-5 opacity-80" src={assets.order_icon} alt="" />
          <span className="hidden md:block">Đơn hàng</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
