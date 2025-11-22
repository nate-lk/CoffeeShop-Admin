import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx";

import {
  Add,
  List,
  Edit,
  AddCategory,
  EditCategory,
  ListCategory,
  Orders,
  OrderDetail,
  Utilities,
  NotFound,
  Home,
} from "./pages";

import { AdminContext } from "../context/AdminContext.jsx";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const { token } = useContext(AdminContext);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-left" autoClose={1200} />
      {token === "" ? (
        <Login />
      ) : (
        <>
          <Navbar />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<Add />} />
                <Route path="/edit/:id" element={<Edit />} />
                <Route path="/list" element={<List />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:orderid" element={<OrderDetail />} />
                <Route path="/add-category" element={<AddCategory />} />
                <Route path="/list-category" element={<ListCategory />} />
                <Route path="/utilities" element={<Utilities />} />
                <Route
                  path="/edit-category/:categoryId"
                  element={<EditCategory />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
