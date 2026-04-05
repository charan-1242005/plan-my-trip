import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Search       from "./pages/Search";
import Dashboard    from "./pages/Dashboard";
import MyBookings   from "./pages/MyBookings";
import Confirmation from "./pages/Confirmation";
import "./index.css";

// Simple auth guard
function Protected({ children }) {
  const email = localStorage.getItem("userEmail");
  return email ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/search"      element={<Protected><Search /></Protected>} />
        <Route path="/dashboard"   element={<Protected><Dashboard /></Protected>} />
        <Route path="/my-bookings" element={<Protected><MyBookings /></Protected>} />
        <Route path="/confirmation" element={<Protected><Confirmation /></Protected>} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
