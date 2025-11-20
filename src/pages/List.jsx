import React, { useEffect, useState, useContext } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { Edit, Trash } from "lucide-react";

const List = () => {
  const { token, currency, setLoading } = useContext(AdminContext);
  const navigate = useNavigate();
  const API_get = "http://localhost:4000/api/product/get";
  const API_delete = "http://localhost:4000/api/product/delete";

  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(API_get);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      // setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      setLoading(true);
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
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (id) => {
    navigate(`/edit/${id}`);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-4">
      <p className="mb-4 text-lg font-semibold">Danh Mục Sản Phẩm</p>

      <div className="overflow-x-auto border  shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-[100px_2fr_1fr_1fr_1fr_150px] bg-gray-100 text-gray-800 font-semibold py-2 px-4 border-b">
          <span>Hình Ảnh</span>
          <span>Tên SP</span>
          <span>Phân Loại</span>
          <span>Giá</span>
          <span>Tồn Kho</span>
          <span className="text-center">Thao Tác</span>
        </div>

        {/* Rows */}
        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[100px_2fr_1fr_1fr_1fr_150px] items-center px-4 py-2 border-b hover:bg-gray-50 transition"
          >
            <div className="flex justify-center">
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-14 h-14 object-cover rounded"
              />
            </div>
            <div>{item.name}</div>
            <div>{item.category}</div>
            <div className="text-center">
              {item.price.toLocaleString()} {currency}
            </div>
            <div className="text-center">{item.stock}</div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => editProduct(item._id)}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <Edit size={18} />
              </button>
              {/* <button
                onClick={() => removeProduct(item._id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash size={18} />
              </button> */}
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            Không tìm thấy sản phẩm nào
          </p>
        )}
      </div>
    </div>
  );
};

export default List;
