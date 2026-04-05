
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const MODE_ICONS = { flight: "✈", train: "🚂", bus: "🚌", ferry: "⛴" };
const getIcon = (m) => MODE_ICONS[m?.toLowerCase()] || "🗺";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(stored);
  }, []);

  const logout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div className="dash-page">
      <nav className="navbar">
        <Link className="nav-logo" to="/dashboard">✈ MakeMyTrip</Link>
        <div className="nav-links">
          <Link className="nav-link" to="/search">Search</Link>
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
          <Link className="nav-link active" to="/my-bookings">My Bookings</Link>
          <button className="nav-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dash-hero" style={{ paddingBottom: 40 }}>
        <div className="dash-hero-inner">
          <div className="dash-greeting">Your travel history</div>
          <div className="dash-name">My Bookings</div>
          <div className="dash-sub">{bookings.length} trip{bookings.length !== 1 ? "s" : ""} booked</div>
        </div>
      </div>

      <div className="dash-body">
        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗂</div>
            <h3>No bookings yet</h3>
            <p>Your confirmed trips will appear here.</p>
            <Link to="/search">
              <button className="btn-primary" style={{ width: "auto", padding: "12px 32px", marginTop: 8 }}>
                Book a Trip →
              </button>
            </Link>
          </div>
        ) : (
          <div className="booking-list">
            {bookings.map((b, i) => (
              <div className="booking-card" key={i}>
                <div className="bc-icon">{getIcon(b.mode)}</div>
                <div className="bc-info">
                  <div className="bc-route">{b.from} → {b.to}</div>
                  <div className="bc-meta">
                    {b.mode} · {b.passengers} passenger{b.passengers > 1 ? "s" : ""}
                    {b.date ? ` · ${b.date}` : ""}
                  </div>
                  {b.bookingId && (
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
                      ID: {b.bookingId}
                    </div>
                  )}
                </div>
                <span className="bc-status confirmed">Confirmed</span>
                <div className="bc-price">₹{(b.total || 0).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
