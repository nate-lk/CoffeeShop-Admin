import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AdminContext } from "../../context/AdminContext";
import { orderApi } from "../../api/order-api";

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
  }, [token]);

  if (!order) {
    return (
      <div className="text-center mt-10">
        <p className="text-[#4e342e] text-lg">
          Dữ liệu đơn hàng không khả dụng.
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 px-4 py-2 bg-[#6d4c41] text-white   hover:bg-[#5d4037]"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const formatCurrency = (v) =>
    v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const Section = ({ title, children }) => (
    <div className="mb-6 bg-[#fff8f0] border border-[#d7ccc8]   p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-[#4e342e] border-b border-[#d7ccc8] pb-2 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );

  const handleCancelOrder = async () => {
    const confirm = await Swal.fire({
      text: "Bạn có chắc muốn hủy đơn hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hủy đơn hàng",
      cancelButtonText: "Trở lại",
      width: "300px",
    });

    if (!confirm.isConfirmed) return;

    setProcessing(true);
    setLoading(true);

    try {
      const res = await orderApi.cancelOrder(order.orderId);

      // Backend returns success; update state locally
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
      text: "Xác nhận thanh toán đơn hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgba(0, 208, 14, 1)",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Trở lại",
      width: "300px",
    });

    if (!confirm.isConfirmed) return;

    setProcessing(true);
    setLoading(true);

    try {
      const res = await orderApi.confirmPayment(order.orderId);

      // Backend returns success; update state locally
      setOrder((prev) => ({ ...prev, status: "PAID" }));
      toast.info("Đơn hàng đã được xác nhận thanh toán thành công.");
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

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-[#f8f3ef] border border-[#d7ccc8]   shadow-inner p-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#d7ccc8] pb-3 mb-6">
        <h2 className="text-2xl font-bold text-[#3e2723]">
          Chi tiết đơn hàng #{order.orderId}
        </h2>
        <span
          className={`px-3 py-1 text-sm font-semibold   ${
            order.status === "PENDING_PAYMENT"
              ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
              : order.status === "PAID"
              ? "bg-green-100 text-green-700"
              : order.status === "CANCELLED"
              ? "bg-red-100 text-red-700"
              : order.status === "PROCESSING"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Sections */}
      <Section title="Thông tin chung">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-[#3e2723] text-sm">
          <p>
            <strong>Mã đơn:</strong> {order.orderId}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
          <br />
          <p>
            <strong>Phương thức thanh toán:</strong>{" "}
            {order.paymentMethod || "—"}
          </p>
        </div>
      </Section>

      <Section title="Thông tin giao hàng">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-[#3e2723] text-sm">
          <p>
            <strong>Người nhận:</strong> {order.userDetail?.receiverName || "—"}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {order.userDetail?.phone || "—"}
          </p>
          <br />
          <p>
            <strong>Địa chỉ:</strong>{" "}
            {order.userDetail
              ? `${order.userDetail.addressLine1}, ${order.userDetail.ward}, ${order.userDetail.city}`
              : "—"}
          </p>
        </div>
      </Section>

      <Section title="Sản phẩm trong đơn hàng">
        <div className="overflow-x-auto  ">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-[#fff8f0] text-[#4e342e] uppercase text-xs border-b border-[#d7ccc8]">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Sản phẩm</th>
                <th className="px-4 py-3 text-center">Hình ảnh</th>
                <th className="px-4 py-3 text-left">Thương hiệu</th>
                <th className="px-4 py-3 text-right">Giá</th>
                <th className="px-4 py-3 text-right">Số lượng</th>
                <th className="px-4 py-3 text-right">Tổng</th>
                {/* <th className="px-4 py-3 text-right">Thao tác</th> */}
              </tr>
            </thead>

            <tbody>
              {order.items.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#e0d6d1] hover:bg-[#fff8f0] transition"
                >
                  <td className="px-4 py-3 text-[#5d4037]">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-[#3e2723]">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.image && (
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-16 h-16 object-cover   border border-[#d7ccc8] mx-auto"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#5d4037]">
                    {item.brand || "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-[#3e2723]">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-4 py-3 text-right text-[#3e2723]">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-[#3e2723]">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                  {/* <td className="px-4 py-3 text-right">
                    <Link
                      to={`/product/${item.productId}`}
                      className="px-3 py-1 text-xs bg-[#3e2723] hover:bg-[#4e342e] text-white   transition"
                    >
                      Xem sản phẩm
                    </Link>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Price Summary */}
      <Section title="Tổng cộng">
        <div className="text-[#3e2723] text-sm space-y-1">
          <p>
            <strong>Tạm tính:</strong>{" "}
            {formatCurrency(order.itemsPrice || order.total)}
          </p>
          {order.shippingPrice && (
            <p>
              <strong>Phí giao hàng:</strong>{" "}
              {formatCurrency(order.shippingPrice)}
            </p>
          )}
          {order.taxPrice && (
            <p>
              <strong>Thuế:</strong> {formatCurrency(order.taxPrice)}
            </p>
          )}
          <p className="font-semibold text-lg mt-2">
            Tổng cộng: {formatCurrency(order.total)}
          </p>
        </div>
      </Section>

      {/* Action buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => navigate("/orders")}
          className="bg-[#6d4c41] text-white px-5 py-2   hover:bg-[#5d4037]"
        >
          Quay lại danh sách
        </button>

        {paymentConfirmable && (
          <button
            onClick={handleConfirmPayment}
            disabled={processing}
            className={`px-5 py-2   border transition-all font-medium shadow-sm 
      ${
        processing
          ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
          : "bg-green-100 hover:bg-green-200 text-black-800 border-green-200 hover:shadow-md"
      }`}
          >
            {processing ? "Đang xác nhận..." : "Xác nhận thanh toán"}
          </button>
        )}

        {cancellable && (
          <button
            onClick={handleCancelOrder}
            disabled={processing}
            className={`px-5 py-2   border transition-all font-medium shadow-sm 
      ${
        processing
          ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
          : "bg-red-100 hover:bg-red-200 text-red-800 border-red-200 hover:shadow-md"
      }`}
          >
            {processing ? "Đang hủy..." : "Hủy đơn hàng"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
