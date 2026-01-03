import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { AdminContext } from "../../context/AdminContext";
import { orderApi } from "../../api/order-api";
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  CreditCard,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const OrderDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order);
  const [processing, setProcessing] = useState(false);
  const { token, setLoading } = useContext(AdminContext);

  const { orderid } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getOneOrder(orderid);
        if (res.data) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    if (token) fetchOrders();
  }, [token, orderid]);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Đang tải dữ liệu đơn hàng...</p>
        <button
          onClick={() => navigate("/orders")}
          className="text-amber-700 font-medium hover:underline"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const formatCurrency = (v) =>
    v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleCancelOrder = async () => {
    const confirm = await Swal.fire({
      title: "Hủy đơn hàng?",
      text: "Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xác nhận hủy",
      cancelButtonText: "Quay lại",
    });

    if (!confirm.isConfirmed) return;

    setProcessing(true);
    setLoading(true);

    try {
      await orderApi.cancelOrder(order.orderId);
      setOrder((prev) => ({ ...prev, status: "CANCELLED" }));
      toast.info("Đơn hàng đã được hủy thành công.");
    } catch (err) {
      toast.error("Lỗi khi hủy đơn hàng");
    } finally {
      setProcessing(false);
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    const confirm = await Swal.fire({
      title: "Xác nhận thanh toán?",
      text: "Đánh dấu đơn hàng này là đã thanh toán.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981", // Green
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Quay lại",
    });

    if (!confirm.isConfirmed) return;

    setProcessing(true);
    setLoading(true);

    try {
      await orderApi.confirmPayment(order.orderId);
      setOrder((prev) => ({ ...prev, status: "PAID" }));
      toast.success("Đã xác nhận thanh toán.");
    } catch (err) {
      toast.error("Lỗi khi xác nhận thanh toán");
    } finally {
      setProcessing(false);
      setLoading(false);
    }
  };

  const cancellable = !(
    order.status === "PAID" ||
    order.status === "FAILED" ||
    order.status === "CANCELLED" ||
    order.status === "PROCESSING" ||
    order.status === "ABANDONED" ||
    order.status === "REFUNDED" ||
    order.status === "COMPLETED" ||
    order.isPaid
  );

  const paymentConfirmable = !(
    order.status === "PAID" ||
    order.status === "FAILED" ||
    order.status === "CANCELLED" ||
    order.status === "PROCESSING" ||
    order.status === "ABANDONED" ||
    order.status === "REFUNDED" ||
    order.status === "COMPLETED" ||
    order.isPaid
  );

  const statusConfig = {
    PAID: {
      label: "Đã thanh toán",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    PENDING_PAYMENT: {
      label: "Chờ thanh toán",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    CANCELLED: {
      label: "Đã hủy",
      color: "bg-red-50 text-red-600 border-red-100",
    },
    PROCESSING: {
      label: "Đang xử lý",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    FAILED: {
      label: "Thất bại",
      color: "bg-gray-100 text-gray-600 border-gray-200",
    },
    REFUNDED: {
      label: "Đã hoàn tiền",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
  };

  const statusStyle = statusConfig[order.status] || {
    label: order.status,
    color: "bg-gray-100",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* --- Top Bar --- */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              #{order.orderId.slice(-8).toUpperCase()}...
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusStyle.color}`}
              >
                {statusStyle.label}
              </span>
            </h1>
            <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
              <Calendar size={14} />
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === LEFT COLUMN: Details === */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
              <Package size={18} className="text-gray-500" />
              <h3 className="font-bold text-gray-800">
                Sản phẩm ({order.items.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                    {item.image && (
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.brand || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(item.price)}
                    </p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Subtotal in Items Card */}
            <div className="bg-gray-50 p-4 text-right border-t border-gray-100">
              <span className="text-sm text-gray-500 mr-2">
                Tổng giá trị sản phẩm:
              </span>
              <span className="font-bold text-gray-900">
                {formatCurrency(
                  order.itemsPrice || order.total - (order.shippingPrice || 0)
                )}
              </span>
            </div>
          </div>

          {/* 2. Customer & Shipping Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User size={18} className="text-gray-400" /> Thông tin khách
                hàng
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 min-w-[80px]">Tên:</span>
                  <span className="font-medium text-gray-900">
                    {order.userDetail?.receiverName || "—"}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 min-w-[80px]">SĐT:</span>
                  <span className="font-medium text-gray-900">
                    {order.userDetail?.phone || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-gray-400" /> Địa chỉ giao hàng
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.userDetail
                  ? `${order.userDetail.addressLine1}, ${order.userDetail.ward}, ${order.userDetail.city}`
                  : "Chưa có thông tin địa chỉ"}
              </p>
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: Actions & Summary === */}
        <div className="space-y-6">
          {/* 3. Action Buttons Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Hành động</h3>
            <div className="flex flex-col gap-3">
              {paymentConfirmable && (
                <button
                  onClick={handleConfirmPayment}
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  <CheckCircle size={18} />
                  {processing ? "Đang xử lý..." : "Xác nhận thanh toán"}
                </button>
              )}

              {cancellable && (
                <button
                  onClick={handleCancelOrder}
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-200 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  <XCircle size={18} />
                  {processing ? "Đang xử lý..." : "Hủy đơn hàng"}
                </button>
              )}

              {!paymentConfirmable && !cancellable && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start gap-2 text-sm text-gray-500">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  Không có hành động khả dụng cho trạng thái này.
                </div>
              )}
            </div>
          </div>

          {/* 4. Payment & Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-gray-400" /> Thanh toán
              </h3>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-500">Phương thức</span>
                <span className="font-medium">
                  {order.paymentMethod || "COD"}
                </span>
              </div>
            </div>

            <div className="p-6 bg-gray-50">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(order.itemsPrice || order.total)}</span>
                </div>
                {order.shippingPrice > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>{formatCurrency(order.shippingPrice)}</span>
                  </div>
                )}
                {order.taxPrice > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Thuế</span>
                    <span>{formatCurrency(order.taxPrice)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-lg">
                    Tổng cộng
                  </span>
                  <span className="font-bold text-gray-900 text-xl">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
