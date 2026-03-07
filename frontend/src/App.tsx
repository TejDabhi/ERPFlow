import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>
        <h1>ERP System</h1>

        {/* Navigation */}
        <nav>
          <Link to="/">Home</Link> | <Link to="/customers">Customers</Link> | <Link to="/products">Products</Link> | <Link to="/orders">Orders</Link>
        </nav>

        <hr />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<h2>Dashboard</h2>} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
