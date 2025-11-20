import React, { useEffect, useState, useContext } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { Edit, Trash } from "lucide-react";

const ListCategory = () => {
  const { token } = useContext(AdminContext);
  const navigate = useNavigate();
  const API_get = `http://localhost:4000/api/category/get`;
  const API_delete = `http://localhost:4000/api/category/delete`;
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(API_get);
      if (response.data.success) {
        setList(response.data.category);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeCategory = async (id) => {
    try {
      const response = await axios.delete(API_delete, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const editCategory = (id) => {
    navigate(`/edit-category/${id}`);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-4">
      <p className="mb-3 text-lg font-semibold text-gray-800">
        Danh Mục Phân Loại
      </p>

      <div className="w-full border  overflow-hidden shadow-sm">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[120px_2fr_3fr_150px] bg-gray-100 text-gray-800 font-semibold px-4 py-2">
          <span>Hình Ảnh</span>
          <span>Tên Phân Loại</span>
          <span>Mô Tả</span>
          <span className="text-center">Thao Tác</span>
        </div>

        {/* Rows */}
        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[120px_2fr_3fr_150px] items-center border-t"
          >
            <div className="flex justify-center p-2">
              <img
                src={item.image?.[0]}
                alt={item.name}
                className="w-14 h-14 object-cover rounded"
              />
            </div>

            <div className="p-2 font-medium">{item.name}</div>
            <div className="p-2 text-gray-700 text-sm">{item.description}</div>

            <div className="flex justify-center gap-2 p-2">
              <button
                onClick={() => editCategory(item._id)}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <Edit size={18} />
              </button>
              {/* <button
                onClick={() => removeCategory(item._id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash size={18} />
              </button> */}
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <p className="text-center text-gray-500 py-4">No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default ListCategory;
