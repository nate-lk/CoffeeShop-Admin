import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AdminContext } from "../../context/AdminContext";
import { categoryApi } from "../../api/category-api";
import { productApi } from "../../api/product-api";
import { 
  Upload, 
  Package, 
  DollarSign, 
  Layers, 
  FileText, 
  Tag, 
  CheckCircle,
  Box,
  ShieldCheck,
  Image as ImageIcon
} from "lucide-react";

const Add = () => {
  const navigate = useNavigate();
  const { setLoading } = useContext(AdminContext);
  
  // --- STATE (UNCHANGED) ---
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [price, setPrice] = useState("100000");
  const [discount, setDiscount] = useState("0");
  const [stock, setStock] = useState("1");
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [variants, setVariants] = useState([]);
  const [brand, setBrand] = useState("");
  const [packageType, setPackageType] = useState("");
  const [packageDetail, setPackageDetail] = useState("");
  const [warranty, setWarranty] = useState("");

  // --- USE EFFECT (UNCHANGED) ---
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await categoryApi.getCategory();
        if (response.data.success) {
          const categories = response.data.category || [];
          setCategoryList(categories);
          if (categories.length > 0) setCategory(categories[0].name);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // --- SUBMIT HANDLER (UNCHANGED) ---
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("longDescription", longDescription);
      formData.append("price", Number(price));
      formData.append("discount", Number(discount));
      formData.append("stock", Number(stock));
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("variants", JSON.stringify(variants));
      formData.append("bestseller", bestseller);
      formData.append("brand", brand);
      formData.append("packageType", packageType);
      formData.append("packageDetail", packageDetail);
      formData.append("warranty", warranty);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await productApi.addProduct(formData);
      if (response.data.success) {
        toast.success(response.data.message);
        // Reset Logic
        setName("");
        setDescription("");
        setLongDescription("");
        setPrice("100000");
        setDiscount("0");
        setStock("1");
        setCategory("");
        setSubCategory("");
        setBestseller(false);
        setVariants([]);
        setBrand("");
        setPackageType("");
        setPackageDetail("");
        setWarranty("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        navigate("/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <div>
           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             <Package className="text-amber-700" /> Thêm sản phẩm mới
           </h1>
           <p className="text-gray-500 text-sm mt-1">Điền thông tin chi tiết để tạo sản phẩm.</p>
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === LEFT COLUMN (Main Content) === */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Basic Information Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={18} /> Thông tin cơ bản
            </h2>
            
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  required
                />
              </div>

              {/* Brand & Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Thương hiệu <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={(e) => setBrand(e.target.value)}
                      value={brand}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                      type="text"
                      placeholder="VD: Trung Nguyên"
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none appearance-none bg-white"
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                        required
                      >
                        {categoryList.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                 </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mô tả ngắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none min-h-[100px]"
                  placeholder="Mô tả tóm tắt về sản phẩm..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mô tả chi tiết
                </label>
                <textarea
                  onChange={(e) => setLongDescription(e.target.value)}
                  value={longDescription}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none min-h-[150px]"
                  placeholder="Thông tin chi tiết, thành phần, hướng dẫn sử dụng..."
                />
              </div>
            </div>
          </div>

          {/* 2. Media Upload Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ImageIcon size={18} /> Hình ảnh sản phẩm
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[image1, image2, image3, image4].map((img, i) => (
                <label 
                  key={i} 
                  htmlFor={`image${i + 1}`}
                  className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-amber-400 transition-all relative overflow-hidden group"
                >
                  {!img ? (
                    <>
                      <Upload className="text-gray-400 group-hover:text-amber-600 mb-2" />
                      <span className="text-xs text-gray-500 font-medium">Tải ảnh {i + 1}</span>
                    </>
                  ) : (
                    <img
                      className="w-full h-full object-cover"
                      src={URL.createObjectURL(img)}
                      alt={`Product ${i + 1}`}
                    />
                  )}
                  
                  {/* Hidden Input */}
                  <input
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (i === 0) setImage1(file);
                      if (i === 1) setImage2(file);
                      if (i === 2) setImage3(file);
                      if (i === 3) setImage4(file);
                    }}
                    type="file"
                    id={`image${i + 1}`}
                    hidden
                  />
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">* Hình ảnh đầu tiên sẽ là ảnh đại diện</p>
          </div>

          {/* 3. Shipping & Warranty Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Box size={18} /> Vận chuyển & Bảo hành
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Hình thức đóng gói <span className="text-red-500">*</span>
                  </label>
                  <input
                    onChange={(e) => setPackageType(e.target.value)}
                    value={packageType}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                    type="text"
                    placeholder="VD: Hộp giấy, Túi zip..."
                    required
                  />
                </div>
                 <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Bảo hành
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      onChange={(e) => setWarranty(e.target.value)}
                      value={warranty}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                      type="text"
                      placeholder="VD: 12 tháng"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Chi tiết đóng gói
                  </label>
                  <textarea
                    onChange={(e) => setPackageDetail(e.target.value)}
                    value={packageDetail}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none h-20"
                    placeholder="Quy cách đóng gói chi tiết..."
                  />
                </div>
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN (Sidebar) === */}
        <div className="space-y-6">
          
          {/* 4. Pricing & Inventory Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign size={18} /> Giá & Kho
            </h2>
            
            <div className="space-y-4">
               {/* Price */}
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Giá bán (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none font-medium"
                    type="number"
                    required
                  />
               </div>

               {/* Discount */}
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Giảm giá (%)
                  </label>
                  <input
                    onChange={(e) => setDiscount(e.target.value)}
                    value={discount}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                    type="number"
                    placeholder="0"
                  />
               </div>

               {/* Stock */}
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tồn kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    onChange={(e) => setStock(e.target.value)}
                    value={stock}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                    type="number"
                    required
                  />
               </div>
            </div>
          </div>

          {/* 5. Organization / Bestseller Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
               <Tag size={18} /> Trạng thái
            </h2>
            
            <div className="flex items-center gap-3 p-3 border border-amber-100 bg-amber-50/50 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors">
               <input
                type="checkbox"
                id="bestseller"
                onChange={(e) => setBestseller(e.target.checked)}
                checked={bestseller}
                className="w-5 h-5 text-amber-700 border-gray-300 rounded focus:ring-amber-500 cursor-pointer accent-amber-700"
              />
              <label htmlFor="bestseller" className="flex-1 cursor-pointer font-medium text-gray-800 text-sm select-none">
                 Sản phẩm bán chạy (Bestseller)
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            type="submit"
            className="w-full py-4 bg-[#3e2723] hover:bg-[#5d4037] text-white font-bold rounded-2xl shadow-lg shadow-amber-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
             <CheckCircle size={20} />
             XÁC NHẬN THÊM
          </button>

        </div>
      </form>
    </div>
  );
};

export default Add;