import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { toast } from "sonner";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { categoryApi } from "../../api/category-api";
import {
  FolderPlus,
  Upload,
  Type,
  FileText,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";

const AddCategory = () => {
  const navigate = useNavigate();
  const { setLoading } = useContext(AdminContext);
  const [image1, setImage1] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      image1 && formData.append("image1", image1);

      const response = await categoryApi.addCategory(formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        navigate("/list-category");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render preview
  const renderPreview = () => {
    if (!image1) return null;
    return typeof image1 === "string" ? image1 : URL.createObjectURL(image1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-2xl mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FolderPlus className="text-amber-700" /> Thêm phân loại mới
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Tạo danh mục mới để tổ chức sản phẩm hiệu quả hơn.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-2xl">
        <form onSubmit={onSubmitHandler} className="space-y-8">
          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">
              Hình ảnh đại diện <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl hover:bg-gray-50 hover:border-amber-400 transition-all relative overflow-hidden group">
              {/* Visual Content - Added 'pointer-events-none' so clicks pass through */}
              {image1 ? (
                <img
                  className="w-full h-full object-contain p-2 pointer-events-none"
                  src={renderPreview()}
                  alt="Preview"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400 group-hover:text-amber-600 transition-colors pointer-events-none">
                  <div className="p-3 bg-gray-100 rounded-full mb-2 group-hover:bg-amber-50 transition-colors">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-medium">Nhấn để tải ảnh lên</p>
                  <p className="text-xs opacity-70 mt-1">
                    PNG, JPG (Tối đa 5MB)
                  </p>
                </div>
              )}

              {/* The Fix: Invisible Input Overlay */}
              <input
                onChange={(e) => setImage1(e.target.files[0])}
                type="file"
                id="image1"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>

          <div className="grid gap-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Type size={16} className="text-gray-400" /> Tên phân loại{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                type="text"
                placeholder="Ví dụ: Cà phê hạt, Dụng cụ pha chế..."
                required
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FileText size={16} className="text-gray-400" /> Mô tả{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none min-h-[100px]"
                placeholder="Mô tả ngắn gọn về danh mục này..."
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#3e2723] hover:bg-[#5d4037] text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            THÊM PHÂN LOẠI
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
