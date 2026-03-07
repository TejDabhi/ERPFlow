import { useEffect, useState } from "react";
import api from "../api/api";
import { Customer } from "../types/customer";

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    api.get<Customer[]>("/customers").then((res) => {
      setCustomers(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Customers</h2>

      <table border={1}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
