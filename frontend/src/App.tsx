import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard"; // <-- Import here
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;