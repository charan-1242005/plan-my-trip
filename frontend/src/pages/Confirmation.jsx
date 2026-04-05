import { useLocation, Link, useNavigate } from "react-router-dom";

const MODE_ICONS = { flight: "✈", train: "🚂", bus: "🚌", ferry: "⛴" };
const getIcon = (m) => MODE_ICONS[m?.toLowerCase()] || "🗺";

export default function Confirmation() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  // If someone lands here directly without booking data
  if (!state) {
    return (
      <div className="conf-page">
        <div className="conf-card">
          <div className="conf-ring">✓</div>
          <h1>No booking found</h1>
          <p className="sub" style={{ marginBottom: 24 }}>Please make a booking first.</p>
          <Link to="/search">
            <button className="btn-primary">Search Trips →</button>
          </Link>
        </div>
      </div>
    );
  }

  const b = state;

  return (
    <>
      {/* minimal navbar */}
      <nav className="navbar">
        <Link className="nav-logo" to="/dashboard">✈ MakeMyTrip</Link>
        <div className="nav-links">
          <Link className="nav-link" to="/search">Search</Link>
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/my-bookings">My Bookings</Link>
        </div>
      </nav>

      <div className="conf-page">
        <div className="conf-card">
          <div className="conf-ring">✓</div>

          <h1>Booking Confirmed!</h1>
          <p className="sub">
            Your trip is all set. A confirmation has been sent to<br />
            <strong>{b.userEmail}</strong>
          </p>

          <div className="conf-box">
            <div className="conf-row">
              <span className="conf-key">Booking ID</span>
              <span className="conf-val">{b.bookingId || "MMT" + Date.now().toString().slice(-8)}</span>
            </div>
            <div className="conf-row">
              <span className="conf-key">Route</span>
              <span className="conf-val">{b.from} → {b.to}</span>
            </div>
            <div className="conf-row">
              <span className="conf-key">Mode</span>
              <span className="conf-val">{getIcon(b.mode)} {b.mode}</span>
            </div>
            <div className="conf-row">
              <span className="conf-key">Passengers</span>
              <span className="conf-val">{b.passengers}</span>
            </div>
            {b.date && (
              <div className="conf-row">
                <span className="conf-key">Date</span>
                <span className="conf-val">{b.date}</span>
              </div>
            )}
            <div className="conf-row">
              <span className="conf-key">Amount Paid</span>
              <span className="conf-val" style={{ color: "var(--brand)", fontSize: 18 }}>
                ₹{(b.total || 0).toLocaleString()}
              </span>
            </div>
            <div className="conf-row">
              <span className="conf-key">Status</span>
              <span className="bc-status confirmed">✓ Paid & Confirmed</span>
            </div>
          </div>

          <div className="conf-actions">
            <button className="btn-outline" onClick={() => navigate("/my-bookings")}>
              My Bookings
            </button>
            <button className="btn-primary" onClick={() => navigate("/search")}>
              Book Another →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
