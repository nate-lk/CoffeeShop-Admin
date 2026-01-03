import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Layers, Search } from "lucide-react";
import { categoryApi } from "../../api/category-api";

const ListCategory = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      const response = await categoryApi.getCategory();
      if (response.data.success) {
        setList(response.data.category);
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

  // const removeCategory = async (id) => {
  //   if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

  //   try {
  //     const response = await categoryApi.deleteCategory(id);

  //     if (response.data.success) {
  //       toast.success(response.data.message);
  //       await fetchList();
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };

  const editCategory = (id) => {
    navigate(`/edit-category/${id}`);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Layers className="text-amber-700" /> Quản lý danh mục
        </h1>
        <p className="text-gray-500 text-sm mt-1">Danh sách các phân loại sản phẩm trong hệ thống.</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-[120px]">Hình ảnh</th>
                <th className="px-6 py-4">Tên phân loại</th>
                <th className="px-6 py-4">Mô tả</th>
                <th className="px-6 py-4 text-center w-[150px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.length > 0 ? (
                list.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/80 transition-colors group">
                    {/* Image Column */}
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg border border-gray-100 bg-white p-1 overflow-hidden shadow-sm">
                        <img
                          src={item.image?.[0]}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    </td>

                    {/* Name Column */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800 text-base">{item.name}</p>
                    </td>

                    {/* Description Column */}
                    <td className="px-6 py-4">
                      <p className="text-gray-500 line-clamp-2">{item.description || "—"}</p>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => editCategory(item._id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        {/* <button
                          onClick={() => removeCategory(item._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty State */
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-gray-500">
                    {!loading && (
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                           <Search size={24} />
                        </div>
                        <p className="font-medium">Chưa có danh mục nào.</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListCategory;