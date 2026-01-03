import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../../api/order-api";
import { Eye, ShoppingBag, Filter, Calendar, ListFilter } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Orders = () => {
  const { token, statusFilter, setStatusFilter } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // --- 1. RESET FILTERS ON MOUNT ---
  // This ensures all buttons start as "OFF" every time you visit the page
  useEffect(() => {
    setStatusFilter({
      PAID: false,
      PENDING_PAYMENT: false,
      CANCELLED: false,
      PROCESSING: false,
      FAILED: false,
      REFUNDED: false,
    });
  }, [setStatusFilter]);

  // --- CONFIGURATION ---
  const statusConfig = {
    PAID: { label: "Đã thanh toán", activeClass: "bg-green-100 text-green-800 border-green-300 ring-2 ring-green-500/20" },
    PENDING_PAYMENT: { label: "Chờ thanh toán", activeClass: "bg-amber-100 text-amber-800 border-amber-300 ring-2 ring-amber-500/20" },
    CANCELLED: { label: "Đã hủy", activeClass: "bg-red-100 text-red-800 border-red-300 ring-2 ring-red-500/20" },
    PROCESSING: { label: "Đang xử lý", activeClass: "bg-blue-100 text-blue-800 border-blue-300 ring-2 ring-blue-500/20" },
    FAILED: { label: "Thất bại", activeClass: "bg-gray-200 text-gray-800 border-gray-400 ring-2 ring-gray-500/20" },
    REFUNDED: { label: "Đã hoàn tiền", activeClass: "bg-purple-100 text-purple-800 border-purple-300 ring-2 ring-purple-500/20" },
  };

  // --- LOGIC ---
  const toggleStatus = (status) => {
    setStatusFilter((prev) => ({ ...prev, [status]: !prev[status] }));
    setPage(1); // Reset to page 1 when filtering
  };

  // Check if ANY filter is currently active
  const isAnyFilterActive = Object.values(statusFilter).some((isActive) => isActive);

  // IF any button is active -> Show only those. 
  // IF no buttons active -> Show ALL.
  const filteredOrders = isAnyFilterActive
    ? orders.filter((o) => statusFilter[o.status])
    : orders;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await orderApi.getAllOrder(page, limit);
        if (res.data && Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
          setTotalPages(res.data.totalPages);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token, page, limit]);

  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const formatDate = (date) =>
    new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag className="text-amber-700" /> Quản lý đơn hàng
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAnyFilterActive 
              ? `Đang hiển thị ${filteredOrders.length} đơn hàng theo bộ lọc.` 
              : "Đang hiển thị tất cả đơn hàng."}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-3 min-w-max">
          <div className="flex items-center gap-2 px-3 py-1.5 text-gray-500 text-sm font-bold uppercase tracking-wide">
             <ListFilter size={16} /> Bộ lọc:
          </div>
          
          {Object.keys(statusConfig).map((status) => {
            const isActive = statusFilter[status];
            const config = statusConfig[status];

            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`
                  relative px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 border
                  ${isActive 
                    ? `${config.activeClass} shadow-sm z-10 scale-105` 
                    : "bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600"
                  }
                `}
              >
                {config.label}
                {isActive && (
                   <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-current rounded-full border-2 border-white"></span>
                )}
              </button>
            );
          })}

          {/* Clear Filters Button */}
          {isAnyFilterActive && (
            <button 
              onClick={() => setStatusFilter({})}
              className="text-xs text-red-500 hover:text-red-700 font-medium underline ml-2 transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Controls */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-end">
           <div className="flex items-center gap-2 text-sm text-gray-500">
              Hiển thị:
              <select
                className="bg-gray-50 border-none text-sm font-medium focus:ring-0 cursor-pointer rounded-md py-1"
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
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-[50px]">#</th>
                <th className="px-6 py-4">Mã đơn hàng</th>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ngày đặt</th>
                <th className="px-6 py-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton width={20} /></td>
                      <td className="px-6 py-4"><Skeleton width={100} /></td>
                      <td className="px-6 py-4"><Skeleton width={150} /></td>
                      <td className="px-6 py-4"><Skeleton width={80} /></td>
                      <td className="px-6 py-4"><Skeleton width={90} /></td>
                      <td className="px-6 py-4"><Skeleton width={120} /></td>
                      <td className="px-6 py-4 text-right"><Skeleton width={30} /></td>
                    </tr>
                  ))
                : filteredOrders.map((order, index) => {
                    const isActive = statusFilter[order.status];
                    // If filter is active, use the config color. If not, use generic grey/default style or the colored badge anyway.
                    // Usually in table rows, we ALWAYS want the badge colored for readability.
                    const statusStyle = statusConfig[order.status] || statusConfig.FAILED;
                    
                    return (
                      <tr key={order.orderId} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4 text-gray-400 font-mono">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            #{order.orderId.slice(-8).toUpperCase()}...
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                             <span className="font-medium text-gray-900 line-clamp-1">{order.items[0]?.name}</span>
                             {order.items.length > 1 && (
                                <span className="text-xs text-gray-500">
                                   + {order.items.length - 1} sản phẩm khác
                                </span>
                             )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4">
                          {/* Use the activeClass logic but stripped of rings for the table badge for cleaner look */}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusStyle.activeClass.split(" ring")[0]}`}>
                            {statusStyle.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                           <Calendar size={14} className="text-gray-400" />
                           {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/orders/${order.orderId}`)}
                            className="p-2 text-gray-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <ShoppingBag size={32} className="opacity-20" />
                        <p>Không tìm thấy đơn hàng nào phù hợp.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50/50">
             <span className="text-sm text-gray-500">
                Trang <span className="font-medium text-gray-900">{page}</span> / {totalPages}
             </span>
             <div className="flex gap-2">
                <select
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2"
                  value={page}
                  onChange={(e) => setPage(Number(e.target.value))}
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Trang {i + 1}
                    </option>
                  ))}
                </select>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;