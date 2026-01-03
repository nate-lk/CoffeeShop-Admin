import React, { useState, useContext } from "react";
import { toast } from "sonner";
import { AdminContext } from "../../context/AdminContext";
import { adminApi } from "../../api/admin-api";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setLoading, setToken } = useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await adminApi.login(email, password);

      if (response.data.success) {
        setToken(response.data.token);
        setEmail("");
        setPassword("");
        // toast.success("Đăng nhập Admin thành công");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Thông tin đăng nhập không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header / Brand Area */}
        <div className="bg-[#3e2723] p-8 text-center relative">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
             <ShieldCheck className="text-amber-100" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Admin Portal
          </h2>
          <p className="text-amber-100/70 text-sm mt-2">
            Vui lòng đăng nhập để tiếp tục
          </p>
        </div>

        {/* Form Area */}
        <div className="p-8 pt-10">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-700 transition-colors" 
                  size={18} 
                />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Mật khẩu
              </label>
              <div className="relative group">
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-700 transition-colors" 
                  size={18} 
                />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#3e2723] hover:bg-[#5d4037] text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2"
            >
              Đăng nhập
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <div className="px-8 pb-6 text-center">
           <p className="text-xs text-gray-400">
             &copy; {new Date().getFullYear()} Velvet Roast Admin System
           </p>
        </div>

      </div>
    </div>
  );
};

export default Login;