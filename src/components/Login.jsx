import React, { useState } from "react";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";
import { useContext } from "react";
import { adminApi } from "../../api/admin-api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setLoading, setToken } = useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      const response = await adminApi.login(email, password);

      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Đăng nhập Admin thành công");
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
     <div className="min-h-screen flex items-center justify-center bg-[#f8f3ef] px-4">
      <div className="bg-[#fff8f0] border border-[#d7ccc8]   shadow-inner w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-[#3e2723] mb-6 border-b border-[#a1887f] pb-2">
          ĐĂNG NHẬP ADMIN
        </h1>

        <form onSubmit={onSubmitHandler} className="space-y-5">
          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full border border-[#a1887f]  p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-[#4e342e] font-semibold mb-1">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full border border-[#a1887f]  p-2 bg-[#fff8f0] text-[#3e2723] focus:outline-none focus:border-[#5d4037]"
              type="password"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button
            className="w-full py-2   bg-[#3e2723] hover:bg-[#4e342e] text-white font-medium transition-all"
            type="submit"
          >
            Đăng nhập
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
