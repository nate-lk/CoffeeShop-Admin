import { Wrench } from "lucide-react";
import { categoryApi } from "../../api/category-api";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

export default function Utilities() {
  const { loading, setLoading } = useContext(AdminContext);

  const handleRecount = async () => {
    try {
      setLoading(true);
      await categoryApi.recountCategory();
      toast.success("Đã cập nhật thống kê.");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <Wrench className="w-6 h-6" />
        Tiện ích
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="rounded-2xl border shadow-sm p-5 space-y-3 bg-white">
          <h2 className="text-lg font-medium">Cập nhật thống kê</h2>
          <p className="text-sm text-gray-600">
            Chạy lại toàn bộ product count theo danh mục.
          </p>

          <button
            onClick={handleRecount}
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-[#3e2723] text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
}
