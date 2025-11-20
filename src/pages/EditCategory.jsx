import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { token, setLoading } = useContext(AdminContext);

  const [image1, setImage1] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/category/fetch/${categoryId}`
      );
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
      toast.error(error.message);
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

      const response = await axios.put(
        `http://localhost:4000/api/category/edit/` + categoryId,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

  return (
    <div className="bg-white p-6   shadow-md w-full max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
        Chỉnh Sửa Phân Loại
      </h1>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-6 text-gray-700"
      >
        {/* Upload Image */}
        <div className="w-full">
          <p className="mb-2 font-medium">
            <strong>
              Tải lên hình ảnh{" "}
              <span className="text-red-600 ml-1 font-bold text-lg">*</span>
            </strong>
          </p>
          <div className="flex gap-3 flex-wrap">
            {(Array.isArray([image1]) ? [image1] : []).map((img, i) => (
              <label key={i} htmlFor={`image${i + 1}`}>
                <img
                  className="w-24 h-24 object-cover   border border-gray-300 cursor-pointer hover:opacity-80"
                  src={
                    !img
                      ? assets.upload_area
                      : img instanceof File
                      ? URL.createObjectURL(img)
                      : typeof img === "string"
                      ? img
                      : assets.upload_area
                  }
                  alt="Upload preview"
                />
                <input
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (i === 0) setImage1(file);
                  }}
                  type="file"
                  id={`image${i + 1}`}
                  hidden
                />
              </label>
            ))}
          </div>
        </div>

        {/* Category Name */}
        <div>
          <p className="mb-2 font-medium">
            <strong>
              Tên phân loại{" "}
              <span className="text-red-600 ml-1 font-bold text-lg">*</span>
            </strong>
          </p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full border border-gray-300  px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            type="text"
            placeholder="Enter category name"
            required
          />
        </div>

        {/* Category Description */}
        <div>
          <p className="mb-2 font-medium">
            <strong>
              Mô tả phân loại{" "}
              <span className="text-red-600 ml-1 font-bold text-lg">*</span>
            </strong>
          </p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full border border-gray-300  px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            rows="3"
            placeholder="Enter category description"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-32 py-2.5 bg-[#3e2723] text-white  hover:bg-[#4e342e] transition-colors"
        >
          CHỈNH SỬA
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
