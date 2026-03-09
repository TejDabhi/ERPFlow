import { useEffect, useState } from "react";
import api from "../api/api";
import { Customer } from "../types/customer";

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    api.get<Customer[]>("/customers").then((res) => {
      setCustomers(res.data);
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

    await api.post("/customers", form);

    setShowModal(false);
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
    });

    fetchCustomers();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customers</h2>

        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Customer
        </button>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Phone</th>
              <th className="text-left px-4 py-2 border-b">Email</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{c.name}</td>
                <td className="px-4 py-2 border-b">{c.phone}</td>
                <td className="px-4 py-2 border-b">{c.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Customer</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                placeholder="Customer Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" />

              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" />

              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border p-2 rounded" />

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-2 border rounded">
                  Cancel
                </button>

                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
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

export default Customers;
