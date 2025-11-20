import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();
  const { token, setLoading } = useContext(AdminContext);
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

      const response = await axios.post(
        `http://localhost:4000/api/category/add`,
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
        Thêm Phân Loại
      </h1>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-6 text-gray-700"
      >
        {/* Image Upload */}
        <div>
          <p className="mb-2 font-medium">
            <strong>
              Tải lên hình ảnh{" "}
              <span className="text-red-600 ml-1 font-bold text-lg">*</span>
            </strong>
          </p>
          <label
            htmlFor="image1"
            className="inline-block cursor-pointer border  overflow-hidden hover:opacity-80 transition"
          >
            <img
              className="w-24 h-24 object-cover"
              src={
                !image1
                  ? assets.upload_area
                  : typeof image1 === "string"
                  ? image1
                  : URL.createObjectURL(image1)
              }
              alt="Upload preview"
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
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
            placeholder="Nhập tên phân loại"
            required
          />
        </div>

        {/* Category Description */}
        <div>
          <p className="mb-2 font-medium">
            <strong>
              Mô tả phân loại
              <span className="text-red-600 ml-1 font-bold text-lg">*</span>
            </strong>
          </p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full border border-gray-300  px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            rows="3"
            placeholder="Nhập mô tả phân loại"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-40 py-2.5 bg-[#3e2723] text-white  hover:bg-[#4e342e] transition-colors"
        >
          Thêm Phân Loại
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
