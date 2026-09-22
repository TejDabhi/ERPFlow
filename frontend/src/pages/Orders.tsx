import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Plus,
  Trash2,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

interface Customer {
  id: number;
  name: string;
  email?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
  quantity?: number;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: number;
  customer_id: number;
  customer?: { name: string };
  customer_name?: string;
  total_amount?: number;
  total?: number;
  status?: string;
  created_at?: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { product_id: "", quantity: 1, unit_price: 0 },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, customersRes, productsRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/orders/`),
        axios.get(`${API_BASE}/customers/`),
        axios.get(`${API_BASE}/products/`),
      ]);

      if (ordersRes.status === "fulfilled") setOrders(ordersRes.value.data || []);
      if (customersRes.status === "fulfilled") setCustomers(customersRes.value.data || []);
      if (productsRes.status === "fulfilled") setProducts(productsRes.value.data || []);
    } catch {
      setError("Failed to load data. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product_id: "", quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = orderItems.filter((_, i) => i !== index);
    setOrderItems(updated.length > 0 ? updated : [{ product_id: "", quantity: 1, unit_price: 0 }]);
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string) => {
    const updated = [...orderItems];
    if (field === "product_id") {
      const prod = products.find((p) => String(p.id) === String(value));
      updated[index].product_id = value;
      updated[index].unit_price = prod ? Number(prod.price || 0) : 0;
    } else if (field === "quantity") {
      updated[index].quantity = Math.max(1, parseInt(value, 10) || 1);
    }
    setOrderItems(updated);
  };

  const calculatedTotal = orderItems.reduce((sum: number, item: OrderItem) => {
    return sum + (Number(item.unit_price) || 0) * (Number(item.quantity) || 0);
  }, 0);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert("Please select a customer.");
      return;
    }

    const validItems = orderItems.filter((item) => item.product_id);
    if (validItems.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_id: parseInt(selectedCustomerId, 10),
        total_amount: calculatedTotal,
        status: "Completed",
        items: validItems.map((item) => ({
          product_id: parseInt(item.product_id, 10),
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      await axios.post(`${API_BASE}/orders/`, payload);

      setIsModalOpen(false);
      setSelectedCustomerId("");
      setOrderItems([{ product_id: "", quantity: 1, unit_price: 0 }]);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error placing order. Check backend terminal for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">Track and manage sales orders</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <Plus size={16} /> New Order
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16 text-gray-500">
            <Clock className="animate-spin mr-2" size={20} />
            Loading orders...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Total Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        #{order.id}
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {order.customer?.name ||
                          customers.find((c) => c.id === order.customer_id)?.name ||
                          `Customer #${order.customer_id}`}
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-semibold">
                        ${Number(order.total_amount || order.total || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={12} /> {order.status || "Completed"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-xs">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      <ShoppingCart size={32} className="mx-auto mb-2 text-gray-300" />
                      No orders found. Click "New Order" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-bold text-gray-900">Create New Order</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-5">
              {/* Customer Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required
                  className="w-full rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Select a customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.email ? `(${c.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Order Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Product
                  </button>
                </div>

                {orderItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select
                      value={item.product_id}
                      onChange={(e) =>
                        handleItemChange(index, "product_id", e.target.value)
                      }
                      required
                      className="flex-1 rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="">Select Product...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ${Number(p.price || 0).toFixed(2)} (Stock: {p.stock || p.quantity || 0})
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-20 rounded-lg border border-gray-300 p-2 text-sm text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />

                    <span className="w-24 text-right text-sm font-medium text-gray-700">
                      ${((item.unit_price || 0) * (item.quantity || 0)).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-base font-medium text-gray-700">Total:</span>
                <span className="text-xl font-bold text-gray-900">
                  ${calculatedTotal.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Placing Order..." : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}