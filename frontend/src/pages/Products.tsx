import { useEffect, useState } from "react";
import api from "../api/api";
import { Product } from "../types/product";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    unit_id: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api.get<Product[]>("/products").then((res) => {
      setProducts(res.data);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/products", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        unit_id: Number(form.unit_id),
      });

      setShowModal(false);
      setForm({ name: "", description: "", price: "", unit_id: "" });
      fetchProducts();
    } catch (err) {
      console.error("Failed to create product:", err);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete product "${name}"?`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. It may be part of an existing order.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border-b">Name</th>
              <th className="px-4 py-2 text-left border-b">Description</th>
              <th className="px-4 py-2 text-left border-b">Price</th>
              <th className="px-4 py-2 text-left border-b">Unit ID</th>
              <th className="px-4 py-2 text-left border-b">Created</th>
              <th className="px-4 py-2 text-center border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{p.name}</td>
                  <td className="px-4 py-2 border-b">{p.description || "—"}</td>
                  <td className="px-4 py-2 border-b font-medium">${Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-2 border-b">{p.unit_id}</td>
                  <td className="px-4 py-2 border-b text-gray-500 text-sm">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Product</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="unit_id"
                type="number"
                placeholder="Unit ID"
                value={form.unit_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;