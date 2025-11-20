import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, setLoading } = useContext(AdminContext);
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [price, setPrice] = useState("100000");
  const [discount, setDiscount] = useState("0");
  const [stock, setStock] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [variants, setVariants] = useState([]);
  const [brand, setBrand] = useState("");
  const [packageType, setPackageType] = useState("");
  const [packageDetail, setPackageDetail] = useState("");
  const [warranty, setWarranty] = useState("");

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/product/fetch/${id}`
      );
      if (response.data.success) {
        const product = response.data.product;

        setName(product.name || "");
        setDescription(product.description || "");
        setLongDescription(product.longDescription || "");
        setPrice(product.price || "");
        setDiscount(product.discount || "");
        setStock(product.stock || "");
        setCategory(product.category || "");
        setSubCategory(product.subCategory || "");
        setBestseller(product.bestseller || false);
        setBrand(product.brand || "");
        setPackageType(product.packageType || "");
        setPackageDetail(product.packageDetail || "");
        setWarranty(product.warranty || "");
        setVariants(product.variant || []);

        if (Array.isArray(product.image)) {
          setImage1(product.image[0] || false);
          setImage2(product.image[1] || false);
          setImage3(product.image[2] || false);
          setImage4(product.image[3] || false);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/category/get`
        );
        if (response.data.success) {
          const categories = response.data.category || [];
          setCategoryList(categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

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

      const response = await axios.put(
        "http://localhost:4000/api/product/edit/" + id,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
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
    <div className="w-full max-w-3xl mx-auto bg-white shadow-md   p-6 mt-6">
      <h1 className="text-2xl font-semibold mb-6 text-[#3e2723]">
        Chỉnh Sửa Sản Phẩm<menu type="toolbar"></menu>
      </h1>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-5"
      >
        {/* Upload Image */}
        <div className="w-full">
          <p className="mb-2 font-medium">
            <strong>Tải lên hình ảnh</strong>{" "}
            <span className="text-red-500 ml-1">*</span>
          </p>
          <div className="flex gap-3 flex-wrap">
            {[image1, image2, image3, image4].map((img, i) => (
              <label key={i} htmlFor={`image${i + 1}`}>
                <img
                  className="w-24 h-24 object-cover   border border-gray-300 cursor-pointer hover:opacity-80"
                  src={
                    !img
                      ? assets.upload_area
                      : typeof img === "string"
                      ? img
                      : URL.createObjectURL(img)
                  }
                  alt=""
                />
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
        </div>

        {/* Product Info */}
        <div className="w-full">
          <p className="mb-1 font-medium">
            <strong>Tên sản phẩm </strong>
            <span className="text-red-600 ml-1 font-bold text-lg">*</span>
          </p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full border   px-3 py-2"
            type="text"
            placeholder="Tên sản phẩm"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-1 font-medium">
            <strong>Thương hiệu</strong>{" "}
            <span className="text-red-600 ml-1 font-bold text-lg">*</span>
          </p>
          <input
            onChange={(e) => setBrand(e.target.value)}
            value={brand}
            className="w-full border   px-3 py-2"
            type="text"
            placeholder="Thương hiệu"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-1 font-medium">
            <strong>Hình thức đóng gói</strong>{" "}
            <span className="text-red-600 ml-1 font-bold text-lg">*</span>
          </p>
          <input
            onChange={(e) => setPackageType(e.target.value)}
            value={packageType}
            className="w-full border   px-3 py-2"
            type="text"
            placeholder="Hình thức đóng gói"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-1 font-medium">
            <strong>Hình thức đóng gói chi tiết</strong>
          </p>
          <textarea
            onChange={(e) => setPackageDetail(e.target.value)}
            value={packageDetail}
            className="w-full border   px-3 py-2 h-24"
            placeholder="Mô tả chi tiết hình thức đóng gói"
          />
        </div>

        <div className="w-full">
          <p className="mb-1 font-medium">
            <strong>Mô tả</strong>{" "}
            <span className="text-red-600 ml-1 font-bold text-lg">*</span>
          </p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full border   px-3 py-2 h-40"
            placeholder="Mô tả ngắn sản phẩm"
            required
          />
        </div>
        <div className="w-full">
          <p className="mb-1 font-medium">
            <strong>Mô tả chi tiết</strong>
          </p>
          <textarea
            onChange={(e) => setLongDescription(e.target.value)}
            value={longDescription}
            className="w-full border   px-3 py-2 h-40"
            placeholder="Mô tả chi tiết sản phẩm"
          />
        </div>

        {/* Category & Subcategory */}
        <div className="flex flex-col sm:flex-row gap-5 w-full">
          <div className="flex-1">
            <p className="mb-1 font-medium">
              <strong>Phân loại</strong>
              <span className="text-red-600 ml-1 font-bold text-lg">*</span>
            </p>
            <select
              className="w-full border   px-3 py-2"
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

          {/* <div className="flex-1">
            <p className="mb-1 font-medium">Subcategory</p>
            <select
              className="w-full border   px-3 py-2"
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
            >
              {categoryList.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div> */}
        </div>

        {/* Numeric Fields */}
        <div className="flex flex-col sm:flex-row gap-5 w-full">
          <div className="flex-1">
            <p className="mb-1 font-medium">
              <strong>Giá</strong>{" "}
              <span className="text-red-600 ml-1 font-bold text-lg">*</span>
            </p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full border   px-3 py-2"
              type="number"
              placeholder="0"
              required
            />
          </div>

          <div className="flex-1">
            <p className="mb-1 font-medium">
              <strong>Tồn kho</strong>{" "}
              <span className="text-red-600 ml-1 font-bold text-lg">*</span>
            </p>
            <input
              onChange={(e) => setStock(e.target.value)}
              value={stock}
              className="w-full border   px-3 py-2"
              type="number"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 w-full">
          <div className="flex-1">
            <p className="mb-1 font-medium">
              <strong>Giảm giá</strong>
            </p>
            <input
              onChange={(e) => setDiscount(e.target.value)}
              value={discount}
              className="w-full border   px-3 py-2"
              type="number"
              placeholder="0"
            />
          </div>

          <div className="flex-1">
            <p className="mb-1 font-medium">
              <strong>Bảo hành</strong>{" "}
            </p>
            <input
              onChange={(e) => setWarranty(e.target.value)}
              value={warranty}
              className="w-full border   px-3 py-2"
              type="text"
              placeholder="Nhập bảo hành. VD: 18 tháng"
            />
          </div>
        </div>

        {/* Variants */}
        {/* <div className="w-full">
          <p className="mb-2 font-medium">Variants</p>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <p
                key={i}
                className="bg-slate-200 px-3 py-1 rounded cursor-pointer select-none"
              >
                ?
              </p>
            ))}
          </div>
        </div> */}

        {/* Bestseller */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="bestseller"
            onChange={(e) => setBestseller(e.target.checked)}
            checked={bestseller}
          />
          <label className="cursor-pointer" htmlFor="bestseller">
            Hàng Bán Chạy
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-32 py-3 mt-4 bg-[#3e2723] text-white   hover:bg-[#4e342e] transition"
        >
          CHỈNH SỬA
        </button>
      </form>
    </div>
  );
};

export default Edit;
