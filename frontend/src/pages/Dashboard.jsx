import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  PlusCircle, 
  ArrowRight 
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [stats, setStats] = useState({
    customersCount: 0,
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch customers, products, and orders in parallel
      const [customersRes, productsRes, ordersRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/customers/`),
        axios.get(`${API_BASE}/products/`),
        axios.get(`${API_BASE}/orders/`),
      ]);

      const customers = customersRes.status === "fulfilled" ? customersRes.value.data : [];
      const products = productsRes.status === "fulfilled" ? productsRes.value.data : [];
      const orders = ordersRes.status === "fulfilled" ? ordersRes.value.data : [];

      // Calculate revenue (adjust field names to match your schema, e.g., total_amount or price * quantity)
      const revenue = orders.reduce((sum, order) => {
        return sum + Number(order.total_amount || order.total || 0);
      }, 0);

      // Filter low stock items (e.g., stock < 10)
      const lowStock = products.filter((p) => Number(p.stock || p.quantity || 0) <= 5);

      setStats({
        customersCount: customers.length,
        productsCount: products.length,
        ordersCount: orders.length,
        totalRevenue: revenue,
      });

      // Get latest 5 orders
      setRecentOrders(orders.slice(-5).reverse());
      setLowStockProducts(lowStock.slice(0, 5));
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
        Loading dashboard metrics...
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Customers",
      value: stats.customersCount,
      icon: Users,
      color: "bg-blue-500",
      link: "/customers",
    },
    {
      title: "Active Products",
      value: stats.productsCount,
      icon: Package,
      color: "bg-emerald-500",
      link: "/products",
    },
    {
      title: "Total Orders",
      value: stats.ordersCount,
      icon: ShoppingCart,
      color: "bg-purple-500",
      link: "/orders",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "bg-amber-500",
      link: "/orders",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ERP Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time overview of inventory, customers, and operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
          >
            <PlusCircle size={16} /> Create Order
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-lg text-white ${card.color}`}>
                <Icon size={24} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/orders"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, i) => (
                    <tr key={order.id || i} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        #{order.id}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {order.customer_name || `Customer #${order.customer_id}`}
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        ${Number(order.total_amount || order.total || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                          {order.status || "Completed"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">
                      No orders placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert Sidebar */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500" /> Low Stock Items
            </h2>
            <Link
              to="/products"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Inventory
            </Link>
          </div>

          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((prod, i) => (
                <div
                  key={prod.id || i}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{prod.name}</p>
                    <p className="text-xs text-gray-500">
                      SKU: {prod.sku || `PRD-${prod.id}`}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-rose-100 text-rose-700">
                    {prod.stock || prod.quantity || 0} left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                All products are sufficiently stocked.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}