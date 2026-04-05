import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MODE_ICONS = { flight: "✈", train: "🚂", bus: "🚌", ferry: "⛴" };
const DURATIONS  = { flight: "~1h 45m", train: "~4h 20m", bus: "~6h 10m", ferry: "~3h 00m" };
const getIcon = (m) => MODE_ICONS[m?.toLowerCase()] || "🗺";
const getDur  = (m) => DURATIONS[m?.toLowerCase()] || "~2h 30m";

const DESTINATIONS = [
  { city: "Goa",     img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=700&q=80", tag: "Beach" },
  { city: "Manali",  img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=700&q=80", tag: "Mountains" },
  { city: "Jaipur",  img: "https://images.unsplash.com/photo-1599661046219-e389c5c17eb9?w=700&q=80", tag: "Heritage" },
  { city: "Kerala",  img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&q=80", tag: "Backwaters" },
];

const fmtCard = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
const fmtExp  = (v) => { const d = v.replace(/\D/g,"").slice(0,4); return d.length > 2 ? d.slice(0,2)+"/"+d.slice(2) : d; };

export default function Search() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "guest@example.com";
  const userName  = localStorage.getItem("userName") || "Traveller";

  const [data, setData]       = useState({ from: "", to: "", date: "", passengers: 1 });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState({ name: "", card: "", expiry: "", cvv: "" });
  const [paying, setPaying]   = useState(false);
  const [payStep, setPayStep] = useState(1);
  const [toast, setToast]     = useState(null);

  const search = async () => {
    if (!data.from || !data.to) return;
    setLoading(true); setResults([]);
    try {
axios.post("https://plan-my-trip-a0dz.onrender.com/search", data);
      setResults(res.data.trips || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  const openBooking = (trip) => {
    setBooking(trip); setPayStep(1);
    setPayment({ name: "", card: "", expiry: "", cvv: "" });
  };

  const confirmPayment = async () => {
    if (!payment.name || !payment.card || !payment.expiry || !payment.cvv) return;
    setPaying(true);
    const bookingData = {
      userEmail,
      ...booking,
      passengers: data.passengers,
      date: data.date,
      total: Math.round(booking.price * data.passengers * 1.12),
      paymentStatus: "Paid",
      bookingId: "MMT" + Date.now().toString().slice(-8),
    };
    try {
      await axios.post("http://127.0.0.1:5000/book", bookingData);
    } catch { /* continue for demo */ }
    finally {
      setPaying(false);
      // Save to localStorage for dashboard
      const prev = JSON.parse(localStorage.getItem("bookings") || "[]");
      localStorage.setItem("bookings", JSON.stringify([bookingData, ...prev]));
      setBooking(null);
      navigate("/confirmation", { state: bookingData });
    }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const logout = () => { localStorage.clear(); navigate("/"); };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <Link className="nav-logo" to="/dashboard">✈ MakeMyTrip</Link>
        <div className="nav-links">
          <Link className="nav-link active" to="/search">Search</Link>
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/my-bookings">My Bookings</Link>
          <button className="nav-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">✦ Trusted by 5 Crore+ Travellers</div>
          <h1 className="hero-title">Discover India &amp;<br /><em>Beyond</em></h1>
          <p className="hero-sub">Flights · Trains · Buses — Find and book in seconds.</p>

          <div className="search-box">
            <div className="sf">
              <label>From</label>
              <input placeholder="Delhi, Mumbai…" value={data.from}
                onChange={e => setData({ ...data, from: e.target.value })} />
            </div>
            <button className="swap-btn" onClick={() => setData({ ...data, from: data.to, to: data.from })}>⇄</button>
            <div className="sf">
              <label>To</label>
              <input placeholder="Goa, Jaipur…" value={data.to}
                onChange={e => setData({ ...data, to: e.target.value })} />
            </div>
            <div className="sf-divider" />
            <div className="sf" style={{ minWidth: 130 }}>
              <label>Date</label>
              <input type="date" value={data.date}
                onChange={e => setData({ ...data, date: e.target.value })} />
            </div>
            <div className="sf" style={{ minWidth: 90 }}>
              <label>Passengers</label>
              <input type="number" min="1" max="9" value={data.passengers}
                onChange={e => setData({ ...data, passengers: +e.target.value })} />
            </div>
            <button className="search-go" onClick={search} disabled={loading}>
              {loading ? "…" : "Search"}
            </button>
          </div>

          <div className="hero-stats">
            <div><div className="hstat-n">5Cr+</div><div className="hstat-l">Travellers</div></div>
            <div><div className="hstat-n">500+</div><div className="hstat-l">Routes</div></div>
            <div><div className="hstat-n">24/7</div><div className="hstat-l">Support</div></div>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <div className="section">
        <div className="section-head">
          <h2>Trending Destinations</h2>
          <p>Handpicked getaways for every traveller</p>
        </div>
        <div className="dest-row">
          {DESTINATIONS.map((d, i) => (
            <div className="dest-card" key={i}
              onClick={() => setData({ ...data, to: d.city })}>
              <img src={d.img} alt={d.city} />
              <div className="dest-overlay">
                <div className="dest-tag">{d.tag}</div>
                <div className="dest-city">{d.city}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      {(loading || results.length > 0) && (
        <div className="results-wrap">
          {loading && <div className="load-bar"><div className="load-fill" /></div>}
          {!loading && results.length > 0 && (
            <>
              <div className="results-head">
                <span className="results-title">Available Trips</span>
                <span className="results-count">{results.length} options</span>
              </div>
              <div className="trips-grid">
                {results.map((trip, i) => (
                  <div className="trip-card" key={i}>
                    <div className="tc-top">
                      <div className="tc-badge">{getIcon(trip.mode)} {trip.mode}</div>
                      <div className="tc-route">{trip.from}<span className="tc-arrow">→</span>{trip.to}</div>
                      <div className="tc-meta">
                        <div className="tc-dot" />
                        <span>{getDur(trip.mode)} · {data.passengers} pax</span>
                      </div>
                    </div>
                    <div className="tc-bot">
                      <div>
                        <div className="tc-label">Per person</div>
                        <div className="tc-price"><sup>₹</sup>{trip.price.toLocaleString()}</div>
                      </div>
                      <button className="book-btn" onClick={() => openBooking(trip)}>Book Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* BOOKING MODAL */}
      {booking && (
        <div className="backdrop" onClick={e => { if (e.target.className === "backdrop") setBooking(null); }}>
          <div className="modal">

            {payStep === 1 && (
              <>
                <div className="modal-hdr">
                  <h2>Booking Summary</h2>
                  <button className="modal-close" onClick={() => setBooking(null)}>✕</button>
                </div>
                <div className="bsummary">
                  <div className="bs-route">{booking.from} → {booking.to}</div>
                  <div className="bs-meta">
                    <span>{getIcon(booking.mode)} {booking.mode}</span>
                    <span>·</span><span>{getDur(booking.mode)}</span>
                    <span>·</span><span>{data.passengers} passenger{data.passengers > 1 ? "s" : ""}</span>
                  </div>
                  <div className="bs-grid">
                    <div>
                      <div className="bs-lbl">Base fare</div>
                      <div className="bs-val">₹{booking.price.toLocaleString()} × {data.passengers}</div>
                    </div>
                    <div>
                      <div className="bs-lbl">Taxes & fees (12%)</div>
                      <div className="bs-val">₹{Math.round(booking.price * data.passengers * 0.12).toLocaleString()}</div>
                    </div>
                    <div className="bs-total">
                      <div className="bs-lbl">Total payable</div>
                      <div className="bs-total-val">₹{Math.round(booking.price * data.passengers * 1.12).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <button className="btn-primary" onClick={() => setPayStep(2)}>Proceed to Payment →</button>
              </>
            )}

            {payStep === 2 && (
              <>
                <div className="modal-hdr">
                  <button className="modal-back" onClick={() => setPayStep(1)}>← Back</button>
                  <h2>Payment</h2>
                  <button className="modal-close" onClick={() => setBooking(null)}>✕</button>
                </div>
                <div className="pay-secure">🔒 256-bit SSL Secured</div>
                <div className="pay-amount">Total: <strong>₹{Math.round(booking.price * data.passengers * 1.12).toLocaleString()}</strong></div>

                <div className="pay-tabs">
                  <button className="ptab act">💳 Card</button>
                  <button className="ptab">📱 UPI</button>
                  <button className="ptab">🏦 Net Banking</button>
                </div>

                <div className="field">
                  <label>Cardholder name</label>
                  <div className="field-wrap">
                    <input type="text" placeholder="Name on card"
                      value={payment.name}
                      onChange={e => setPayment({ ...payment, name: e.target.value })} />
                  </div>
                </div>
                <div className="field">
                  <label>Card number</label>
                  <div className="field-wrap">
                    <span className="field-icon">💳</span>
                    <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                      value={payment.card}
                      onChange={e => setPayment({ ...payment, card: fmtCard(e.target.value) })} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div className="field" style={{ flex: 1 }}>
                    <label>Expiry</label>
                    <div className="field-wrap">
                      <input type="text" placeholder="MM/YY" maxLength={5}
                        value={payment.expiry}
                        onChange={e => setPayment({ ...payment, expiry: fmtExp(e.target.value) })} />
                    </div>
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label>CVV</label>
                    <div className="field-wrap">
                      <input type="password" placeholder="•••" maxLength={3}
                        value={payment.cvv}
                        onChange={e => setPayment({ ...payment, cvv: e.target.value.replace(/\D/,"").slice(0,3) })} />
                    </div>
                  </div>
                </div>

                {(payment.name || payment.card) && (
                  <div className="card-preview">
                    <div className="cp-chip">▊▊</div>
                    <div className="cp-num">{payment.card || "•••• •••• •••• ••••"}</div>
                    <div className="cp-bot">
                      <span>{payment.name || "YOUR NAME"}</span>
                      <span>{payment.expiry || "MM/YY"}</span>
                    </div>
                  </div>
                )}

                <button className="btn-primary" onClick={confirmPayment} disabled={paying}>
                  {paying ? <span className="spinner" /> : `Pay ₹${Math.round(booking.price * data.passengers * 1.12).toLocaleString()} →`}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast ? "show" : ""}`}>
          <div className="toast-icon">✓</div>
          <div className="toast-text"><strong>Success!</strong><p>{toast}</p></div>
        </div>
      )}
    </>
  );
}
