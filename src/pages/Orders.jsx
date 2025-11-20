import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../../api/order-api";
import { Eye } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Orders = () => {
  const { token, statusFilter, setStatusFilter, loading } =
    useContext(AdminContext);

  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const toggleStatus = (status) => {
    setStatusFilter((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const filteredOrders =
    orders && Array.isArray(orders)
      ? orders.filter((o) => statusFilter[o.status])
      : [];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getAllOrder(page, limit);
        if (res.data && Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
          setTotalPages(res.data.totalPages);
        } else {
          setOrders([]); // prevent null errors
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]); // fallback to empty list
      }
    };

    fetchOrders();
  }, [token, page, limit]);

  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  const formatDate = (date) =>
    new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusNamesVN = {
    PAID: "ĐÃ THANH TOÁN",
    PENDING_PAYMENT: "CHỜ THANH TOÁN",
    CANCELLED: "ĐÃ HỦY",
    PROCESSING: "ĐANG XỬ LÝ",
    FAILED: "THẤT BẠI",
    REFUNDED: "ĐÃ HOÀN TIỀN",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "FAILED":
        return "bg-gray-800 text-white";
      case "REFUNDED":
        return "bg-purple-200 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Danh sách đơn hàng</h2>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(statusFilter).map((status) => {
          const active = statusFilter[status];

          return (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`px-3 py-1 text-xs border transition
                ${
                  active
                    ? "bg-[#3e2723] text-white border-[#3e2723]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {statusNamesVN[status] || status.replace("_", " ")}
            </button>
          );
        })}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-gray-600">Hiển thị:</span>
        <select
          className="border px-2 py-1 text-sm"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-gray-600">mỗi trang</span>
      </div>

      <div className="overflow-x-auto shadow">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Sản phẩm</th>
              <th className="px-4 py-3">Đơn giá</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {/* ----------------- SKELETON -------------------- */}
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-3">
                    <Skeleton width={20} />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton width={120} />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton width={180} />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton width={80} />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton width={90} />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton width={120} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Skeleton width={30} />
                  </td>
                </tr>
              ))}

            {/* ----------------- REAL DATA -------------------- */}
            {!loading &&
              [...filteredOrders].reverse().map((order, index) => (
                <tr
                  key={order.orderId}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-600 font-medium">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3 font-mono text-xs">
                    {order.orderId.slice(0, 10)}...
                  </td>

                  <td className="px-4 py-3">
                    {order.items
                      .map((item) => item.name)
                      .slice(0, 2)
                      .join(", ")}
                    {order.items.length > 2 && (
                      <span className="text-gray-400">
                        {" "}
                        +{order.items.length - 2} more
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(order.total)}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {statusNamesVN[order.status] || order.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                      className="px-3 py-1 text-xs bg-[#3e2723] hover:bg-[#4e342e] text-white transition"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}

            {/* ----------------- EMPTY STATE -------------------- */}
            {!loading && orders && orders.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  Không tìm thấy đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <span className="text-sm text-gray-600">Trang:</span>

        <select
          className="border px-2 py-1 text-sm"
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <span className="text-sm text-gray-600">/ {totalPages}</span>
      </div>
    </div>
  );
};

export default Orders;
