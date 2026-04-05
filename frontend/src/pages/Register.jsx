import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DESTINATIONS = [
  { city: "Santorini", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80" },
  { city: "New York",  img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80" },
  { city: "Kyoto",     img: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=600&q=80" },
  { city: "Goa",       img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80" },
  { city: "Amsterdam", img: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80" },
  { city: "Kerala",    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80" },
];

const calcStrength = (p) => {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
};
const LABELS = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const COLORS = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#15803d"];

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser]       = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPass, setShowPass] = useState(false);

  const register = async () => {
    setError("");
    if (!user.name || !user.email || !user.password || !user.confirm) { setError("Please fill in all fields."); return; }
    if (user.password !== user.confirm) { setError("Passwords do not match."); return; }
    if (user.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/register", {
        name: user.name, email: user.email, password: user.password,
      });
      if (res.data.message === "User Registered Successfully") {
        navigate("/");
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const s = calcStrength(user.password);

  return (
    <div className="auth-page">
      {/* ── LEFT: MOSAIC ── */}
      <div className="auth-visual">
        <div className="auth-mosaic">
          {DESTINATIONS.map((d, i) => (
            <div className="mosaic-tile" key={i}>
              <img src={d.img} alt={d.city} />
              <div className="mosaic-label">{d.city}</div>
            </div>
          ))}
        </div>
        <div className="auth-visual-overlay" />
        <div className="auth-visual-brand">
          <div className="auth-visual-logo">✈ MakeMyTrip</div>
          <p>Join millions of happy travellers</p>
        </div>
      </div>

      {/* ── RIGHT: FORM ── */}
      <div className="auth-panel">
        <div className="auth-box">
          <span className="auth-logo">✈ MakeMyTrip</span>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Start planning your dream journey today</p>

          <div className="field">
            <label>Full name</label>
            <div className="field-wrap">
              <span className="field-icon">👤</span>
              <input type="text" placeholder="Your full name"
                value={user.name}
                onChange={e => setUser({ ...user, name: e.target.value })} />
            </div>
          </div>

          <div className="field">
            <label>Email address</label>
            <div className="field-wrap">
              <span className="field-icon">✉</span>
              <input type="email" placeholder="you@example.com"
                value={user.email}
                onChange={e => setUser({ ...user, email: e.target.value })} />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="field-wrap">
              <span className="field-icon">🔒</span>
              <input type={showPass ? "text" : "password"} placeholder="Min. 6 characters"
                value={user.password}
                onChange={e => setUser({ ...user, password: e.target.value })} />
              <button className="show-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            {user.password && (
              <div className="strength-row">
                <div className="strength-bars">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="strength-bar"
                      style={{ background: n <= s ? COLORS[s] : "#e5e7eb" }} />
                  ))}
                </div>
                <span className="strength-text" style={{ color: COLORS[s] }}>{LABELS[s]}</span>
              </div>
            )}
          </div>

          <div className="field">
            <label>Confirm password</label>
            <div className="field-wrap">
              <span className="field-icon">🔒</span>
              <input type="password" placeholder="Re-enter password"
                value={user.confirm}
                onChange={e => setUser({ ...user, confirm: e.target.value })} />
              {user.confirm && (
                <span style={{ paddingRight: 12, fontSize: 16 }}>
                  {user.password === user.confirm ? "✅" : "❌"}
                </span>
              )}
            </div>
          </div>

          {error && <div className="auth-error">⚠ {error}</div>}

          <button className="btn-primary" onClick={register} disabled={loading}>
            {loading ? <span className="spinner" /> : "Create Account →"}
          </button>

          <div className="auth-divider"><span>or sign up with</span></div>

          <button className="btn-outline">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="auth-switch">
            Already have an account?
            <Link to="/">Sign in</Link>
          </p>

          <p className="auth-terms">
            By registering you agree to our <a href="#">Terms of Service</a> &amp; <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
