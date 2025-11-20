import { useContext } from "react";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Orders from "./pages/Orders.jsx";
import List from "./pages/List.jsx";
import ListCategory from "./pages/ListCategory.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Add from "./pages/Add.jsx";
import Edit from "./pages/Edit.jsx";
import AddCategory from "./pages/AddCategory.jsx";
import EditCategory from "./pages/EditCategory.jsx";
import Home from "./pages/Home.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
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
                <Route
                  path="/edit-category/:categoryId"
                  element={<EditCategory />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
