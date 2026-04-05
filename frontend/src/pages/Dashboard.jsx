import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const MODE_ICONS = { flight: "✈", train: "🚂", bus: "🚌", ferry: "⛴" };
const getIcon = (m) => MODE_ICONS[m?.toLowerCase()] || "🗺";

export default function Dashboard() {
  const navigate  = useNavigate();
  const userName  = localStorage.getItem("userName") || "Traveller";
  const userEmail = localStorage.getItem("userEmail") || "";
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(stored);
  }, []);

  const logout = () => { localStorage.clear(); navigate("/"); };

  const totalSpent = bookings.reduce((s, b) => s + (b.total || 0), 0);

  return (
    <div className="dash-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <Link className="nav-logo" to="/dashboard">✈ MakeMyTrip</Link>
        <div className="nav-links">
          <Link className="nav-link" to="/search">Search</Link>
          <Link className="nav-link active" to="/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/my-bookings">My Bookings</Link>
          <button className="nav-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div className="dash-hero">
        <div className="dash-hero-inner">
          <div className="dash-greeting">Welcome back</div>
          <div className="dash-name">Hello, {userName} 👋</div>
          <div className="dash-sub">{userEmail}</div>

          <div className="dash-stats">
            <div className="dstat">
              <div className="dstat-n">{bookings.length}</div>
              <div className="dstat-l">Total Trips</div>
            </div>
            <div className="dstat">
              <div className="dstat-n">₹{totalSpent.toLocaleString()}</div>
              <div className="dstat-l">Total Spent</div>
            </div>
            <div className="dstat">
              <div className="dstat-n">{bookings.length > 0 ? "Gold" : "Silver"}</div>
              <div className="dstat-l">Member Tier</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-body">
        {/* QUICK ACTIONS */}
        <div className="dash-section-title" style={{ marginBottom: 16 }}>Quick Actions</div>
        <div className="quick-grid">
          <Link className="quick-card" to="/search">
            <div className="qc-icon">✈</div>
            <div className="qc-label">Book a Trip</div>
            <div className="qc-sub">Search flights, trains & buses</div>
          </Link>
          <Link className="quick-card" to="/my-bookings">
            <div className="qc-icon">🗂</div>
            <div className="qc-label">My Bookings</div>
            <div className="qc-sub">View all your past trips</div>
          </Link>
          <div className="quick-card" onClick={() => alert("Offers coming soon!")}>
            <div className="qc-icon">🏷</div>
            <div className="qc-label">Deals & Offers</div>
            <div className="qc-sub">Exclusive discounts for you</div>
          </div>
        </div>

        {/* RECENT BOOKINGS */}
        <div className="dash-section-title">
          Recent Bookings
          {bookings.length > 0 && <Link to="/my-bookings">View all →</Link>}
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✈</div>
            <h3>No trips yet!</h3>
            <p>Start exploring and book your first trip.</p>
            <Link to="/search">
              <button className="btn-primary" style={{ width: "auto", padding: "12px 32px" }}>
                Search Trips →
              </button>
            </Link>
          </div>
        ) : (
          <div className="booking-list">
            {bookings.slice(0, 5).map((b, i) => (
              <div className="booking-card" key={i}>
                <div className="bc-icon">{getIcon(b.mode)}</div>
                <div className="bc-info">
                  <div className="bc-route">{b.from} → {b.to}</div>
                  <div className="bc-meta">
                    {b.mode} · {b.passengers} pax
                    {b.date ? ` · ${b.date}` : ""}
                    {b.bookingId ? ` · ${b.bookingId}` : ""}
                  </div>
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
