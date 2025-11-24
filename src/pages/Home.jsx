import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import StatCard from "../components/StatCard";
import { orderApi } from "../../api/order-api";

const Home = () => {
  const [orderList, setOrderList] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    avgOrderValue: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);

  // COLORS for Pie Chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const processData = (data) => {
    // 1. Calculate KPIs
    const totalRevenue = data.reduce(
      (acc, order) => acc + (order.status == "PAID" ? order.total : 0),
      0
    );
    const totalOrders = data.length;
    const pendingOrders = data.filter(
      (o) => o.status === "PENDING_PAYMENT" || o.status === "PROCESSING"
    ).length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    setMetrics({ totalRevenue, totalOrders, pendingOrders, avgOrderValue });

    // 2. Prepare Sales Over Time (Line Chart)
    // Grouping by Date (simplified for demo)
    const salesMap = {};
    data.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!salesMap[date]) salesMap[date] = 0;
      if (order.status == "PAID") salesMap[date] += order.total;
    });
    const salesChartData = Object.keys(salesMap)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((key) => ({
        name: key,
        sales: salesMap[key],
      }));
    setSalesData(salesChartData.slice(-30)); // Last 7 days/entries

    // 3. Best Selling Products (Bar Chart logic)
    const productMap = {};
    data.forEach((order) => {
      if (order.status == "PAID") {
        order.items.forEach((item) => {
          if (!productMap[item.name]) productMap[item.name] = 0;
          productMap[item.name] += item.quantity;
        });
      }
    });
    const bestSellingData = Object.keys(productMap)
      .map((key) => ({ name: key, quantity: productMap[key] }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    setBestSellers(bestSellingData);

    // 4. Order Status Distribution (Pie Chart)
    const statusMap = {};
    data.forEach((order) => {
      if (!statusMap[order.status]) statusMap[order.status] = 0;
      statusMap[order.status] += 1;
    });
    const statusChartData = Object.keys(statusMap).map((key, index) => ({
      name: key,
      value: statusMap[key],
    }));
    setStatusDistribution(statusChartData);
  };

  const fetchAndProcessOrders = async () => {
    const maxRetries = 3;
    const backoff = 300; // ms
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await orderApi.getAllOrder(1, 1000);
        const data = response.data;
        // const orderData = data.orders;
        // console.log("Fetched orders:", orderData);
        // Update state and process
        // setOrderList(orderData);
        // console.log("Orders prepare for process:", orderList);
        processData(data.orders);

        return; // success → exit loop
      } catch (err) {
        attempt++;
        if (attempt < maxRetries) {
          // wait before retrying
          await new Promise((res) => setTimeout(res, backoff));
          continue;
        }

        // after all retries fail → log silently
        console.error("Failed to fetch orders after retries:", err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Báo cáo kinh doanh</h1>
        <button
          onClick={fetchAndProcessOrders}
          className="px-4 py-2 bg-[#3e2723] text-white font-medium  shadow hover:bg-[#3e2723] transition-colors duration-200"
        >
          Cập nhật báo cáo
        </button>
      </header>

      {/* --- TOP STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng doanh thu"
          value={`${metrics.totalRevenue.toLocaleString()} ₫`}
          icon={DollarSign}
          colorClass="bg-green-500"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={metrics.totalOrders}
          icon={ShoppingBag}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Doanh thu trung bình"
          value={`${Math.floor(metrics.avgOrderValue).toLocaleString()} ₫`}
          icon={TrendingUp}
          colorClass="bg-purple-500"
        />

        <StatCard
          title="Đơn hàng chờ thanh toán"
          value={metrics.pendingOrders}
          icon={Clock}
          colorClass="bg-orange-400"
        />
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Trend */}
        <div className="bg-white p-6   shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Theo dõi doanh thu (30 ngày gần đây)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis prefix="₫" />
                <Tooltip formatter={(value) => `${value.toLocaleString()} ₫`} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-6   shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Tình trạng đơn hàng
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: TABLES & LISTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        {/* <div className="lg:col-span-2 bg-white   shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">
              Đơn hàng gần đây
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Thời gian</th>
                  <th className="p-4">Tổng cộng</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {orderList.slice(0, 5).map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-blue-600">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="p-4">{order.userDetail.receiverName}</td>
                    <td className="p-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold">${order.total}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold
                        ${
                          order.status === "ĐÃ THANH TOÁN"
                            ? "bg-green-100 text-green-700"
                            : order.status === "CHỜ THANH TOÁN"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "ĐÃ HỦY"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}

        {/* Best Selling Products */}
        <div className="bg-white p-6   shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Sản phẩm bán chạy nhất
          </h3>
          <div className="space-y-4">
            {bestSellers.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2  text-blue-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.quantity} sold
                    </p>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-700">
                  {/* Assuming a visual bar or just quantity here */}
                  <Package className="inline w-4 h-4 text-gray-400 mr-1" />
                  {product.quantity}
                </div>
              </div>
            ))}
            {bestSellers.length === 0 && (
              <p className="text-gray-400 text-sm">No sales yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
