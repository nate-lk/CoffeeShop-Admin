import { assets } from "../assets/assets";
import { LogOut } from "lucide-react";
import { adminApi } from "../../api/admin-api";
import Swal from "sweetalert2";

const Navbar = () => {
  const handleLogout = async () => {
    const confirm = await Swal.fire({
      text: "Bạn có muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
      width: "300px",
    });

    if (!confirm.isConfirmed) return;
    console.log("before block")

    try {
      console.log("in block")
      await adminApi.logout();
    } catch (_) {
      // Even if backend fails, still clear state
    }

    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-between bg-[#3e2723] py-2 px-4 sticky top-0 z-50">
      <img
        className="w-48 sm:w-52 object-contain ml-0"
        src={assets.logo}
        alt="Logo"
      />
      <button
        onClick={handleLogout}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        <LogOut className="w-5 h-5 opacity-80" />
      </button>
    </div>
  );
};

export default Navbar;
