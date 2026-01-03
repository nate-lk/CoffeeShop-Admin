import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { categoryApi } from "../../api/category-api";
import { Edit, Upload, Type, FileText, CheckCircle, Image as ImageIcon } from "lucide-react";

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { setLoading } = useContext(AdminContext);

  const [image1, setImage1] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // --- LOGIC (UNCHANGED) ---
  const fetchCategory = async () => {
    try {
      const res = await categoryApi.getOneCategory(categoryId);
      if (res.data.success) {
        const cat = res.data.category;

        setName(cat.name);
        setDescription(cat.description);

        if (Array.isArray(cat.image)) {
          setImage1(cat.image[0] || false);
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (categoryId) fetchCategory();
  }, [categoryId]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      image1 && formData.append("image1", image1);

      const response = await categoryApi.updateCategory(categoryId, formData);

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

  // Helper for safe image preview (Handles URL string vs File object)
  const renderPreview = () => {
    if (!image1) return assets.upload_area;
    if (typeof image1 === "string") return image1; // Existing image URL from DB
    return URL.createObjectURL(image1); // New file upload
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-2xl mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Edit className="text-amber-700" /> Chỉnh sửa phân loại
        </h1>
        <p className="text-gray-500 text-sm mt-1">Cập nhật thông tin và hình ảnh cho danh mục này.</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-2xl">
        <form onSubmit={onSubmitHandler} className="space-y-8">
          
          {/* Image Upload Section */}
          <div className="space-y-3">
             <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                <ImageIcon size={16} className="text-gray-400" /> Hình ảnh đại diện <span className="text-red-500">*</span>
             </label>
             
             <label
              htmlFor="image1"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-amber-400 transition-all relative overflow-hidden group"
            >
              {/* Image Preview */}
              <img
                className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
                src={renderPreview()}
                alt="Category Preview"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                 <div className="bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 shadow-sm transition-opacity">
                    <Upload size={20} className="text-amber-700" />
                 </div>
              </div>
              
              <input
                onChange={(e) => setImage1(e.target.files[0])}
                type="file"
                id="image1"
                hidden
              />
            </label>
            <p className="text-xs text-center text-gray-400">Nhấn vào ảnh để thay đổi</p>
          </div>

          <div className="grid gap-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                 <Type size={16} className="text-gray-400" /> Tên phân loại <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                type="text"
                placeholder="Nhập tên phân loại"
                required
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                 <FileText size={16} className="text-gray-400" /> Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none min-h-[120px]"
                rows="3"
                placeholder="Nhập mô tả phân loại"
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
            LƯU THAY ĐỔI
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditCategory;