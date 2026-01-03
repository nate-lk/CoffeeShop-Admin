import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { Edit, Trash2, ChevronLeft, ChevronRight, Package, Search, Filter } from "lucide-react";
import { productApi } from "../../api/product-api";
import { backendUrl } from "../App"; // Ensure this import is correct based on your file structure

const List = () => {
  const { token, currency, setLoading } = useContext(AdminContext);
  const navigate = useNavigate();
  
  // Fixed: Define API_delete properly
  // const API_delete = `${backendUrl}/api/product/delete`;
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      // Optional: setLoading(true) here if you want a loader on every page change
      const response = await productApi.getProduct(page, limit);
      if (response.data.success) {
        setList(response.data.products);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // const removeProduct = async (id) => {
  //   if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

  //   try {
  //     setLoading(true);
  //     const response = await axios.post(API_delete, { id }, { // Usually delete endpoints use POST with body or DELETE with params, kept as axios based on your snippet
  //       headers: { token }, // Note: Check if your backend expects 'token' or 'Authorization: Bearer...'
  //     });

  //     if (response.data.success) {
  //       toast.success(response.data.message);
  //       await fetchList();
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const editProduct = (id) => {
    navigate(`/edit/${id}`);
  };

  useEffect(() => {
    fetchList();
  }, [page, limit]);

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" /> Danh sách sản phẩm
          </h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý kho hàng và danh mục sản phẩm.</p>
        </div>
        
        {/* Simple Filter/Limit Controls */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm text-gray-500 pl-2">Hiển thị:</span>
          <select
            className="bg-gray-50 border-none text-sm font-medium focus:ring-0 cursor-pointer rounded-md py-1"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Hình ảnh</th>
                <th className="px-6 py-4">Tên sản phẩm</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Giá bán</th>
                <th className="px-6 py-4 text-center">Tồn kho</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.length > 0 ? (
                list.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg border border-gray-100 bg-white p-1 overflow-hidden">
                        <img
                          src={item.image[0]}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800 line-clamp-2">{item.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.price.toLocaleString()} {currency}
                    </td>
                    <td className="px-6 py-4 text-center">
                       {/* Stock Badge Logic */}
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                        item.stock > 10 
                            ? "bg-green-50 text-green-700" 
                            : item.stock > 0 
                                ? "bg-amber-50 text-amber-700" 
                                : "bg-red-50 text-red-700"
                      }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => editProduct(item._id)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        {/* <button
                          onClick={() => removeProduct(item._id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colspan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Search size={32} className="opacity-20" />
                        <p>Không tìm thấy sản phẩm nào.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {list.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm text-gray-500">
              Trang <span className="font-medium text-gray-900">{page}</span> / {totalPages}
            </span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;