import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Layers, 
  FolderPlus, 
  ShoppingBag, 
  Wrench, 
  Settings
} from "lucide-react";

const Sidebar = () => {
  // Define menu structure for cleaner rendering
  const menuGroups = [
    {
      title: "Tổng quan",
      items: [
        { path: "/", label: "Báo cáo", icon: LayoutDashboard },
      ],
    },
    {
      title: "Sản phẩm & Kho",
      items: [
        { path: "/list", label: "Danh sách SP", icon: Package },
        { path: "/add", label: "Thêm sản phẩm", icon: PlusCircle },
        { path: "/list-category", label: "Danh mục", icon: Layers },
        { path: "/add-category", label: "Thêm danh mục", icon: FolderPlus },
      ],
    },
    {
      title: "Bán hàng",
      items: [
        { path: "/orders", label: "Đơn hàng", icon: ShoppingBag },
      ],
    },
    // {
    //   title: "Hệ thống",
    //   items: [
    //     { path: "/utilities", label: "Tiện ích", icon: Wrench },
    //   ],
    // },
  ];

  return (
    <div className="w-[20%] min-h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen overflow-y-auto">
      
      {/* Optional: Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-100 mb-4">
         <h1 className="text-xl font-bold text-amber-800 hidden md:block">ADMIN</h1>
         <span className="md:hidden font-bold text-amber-800">A</span>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-6 px-3 py-4">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            
            {/* Section Title (Hidden on small screens) */}
            <h3 className="hidden md:block px-3 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              {group.title}
            </h3>

            <div className="flex flex-col gap-1">
              {group.items.map((item, itemIndex) => (
                <NavLink
                  key={itemIndex}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm
                    ${
                      isActive
                        ? "bg-amber-50 text-amber-900 shadow-sm" // Active State
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900" // Idle State
                    }`
                  }
                >
                  <item.icon 
                    size={20} 
                    className={`flex-shrink-0 transition-colors ${
                       // Use NavLink's active checking via CSS class if needed, 
                       // but mostly relies on the parent color class.
                       "group-hover:text-amber-700"
                    }`} 
                  />
                  
                  <span className="hidden md:block">
                    {item.label}
                  </span>

                  {/* Tooltip for mobile (optional visual indicator) */}
                  <div className="md:hidden absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.label}
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Settings (Optional) */}
      <div className="mt-auto p-4 border-t border-gray-100">
         <div className="flex items-center gap-3 text-gray-500 text-xs justify-center md:justify-start">
            <Settings size={16} />
            <span className="hidden md:block">v1.0.2 Dashboard</span>
         </div>
      </div>
    </div>
  );
};

export default Sidebar;