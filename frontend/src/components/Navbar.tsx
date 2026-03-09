import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-800 text-white shadow-md">
      {" "}
      <div className="max-w-7xl mx-auto px-6">
        {" "}
        <div className="flex items-center justify-between h-14">
          {/* Logo / Title */}
          <div className="text-lg font-semibold">ERP System</div>

          {/* Menu */}
          <div className="flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-blue-400 transition">
              Dashboard
            </Link>

            <Link to="/customers" className="hover:text-blue-400 transition">
              Customers
            </Link>

            <Link to="/products" className="hover:text-blue-400 transition">
              Products
            </Link>

            <Link to="/orders" className="hover:text-blue-400 transition">
              Orders
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
