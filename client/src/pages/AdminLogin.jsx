import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") navigate("/admin", { replace: true });
    else if (user?.role === "user") navigate("/", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) {
      if (res.role === "admin") navigate("/admin", { replace: true });
      else setError("Access denied. This portal is for administrators only.");
    } else {
      setError(res.message);
    }
  };

  const bdr = { background: "rgba(30,41,59,0.8)", border: "1px solid rgba(239,68,68,0.2)", color: "#fff", width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 13, outline: "none", boxSizing: "border-box" };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#020617" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(239,68,68,0.07) 0%, transparent 70%)" }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-md">

        <div className="text-center mb-8">
          <motion.div
            animate={{ boxShadow: ["0 0 20px rgba(239,68,68,0.3)", "0 0 50px rgba(239,68,68,0.6)", "0 0 20px rgba(239,68,68,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5 shadow-2xl"
            style={{ background: "linear-gradient(135deg,#ef4444,#be123c)" }}>
            🛡️
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-400 text-sm">SafeSphere AI — Restricted Access Only</p>
          <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-xs font-semibold"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            AUTHORIZED PERSONNEL ONLY
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-7 space-y-5"
          style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(239,68,68,0.25)", backdropFilter: "blur(20px)" }}>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Admin Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="admin@safesphere.ai" required style={bdr}
              onFocus={e => e.target.style.borderColor = "rgba(239,68,68,0.6)"}
              onBlur={e => e.target.style.borderColor = "rgba(239,68,68,0.2)"} />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••" required style={bdr}
              onFocus={e => e.target.style.borderColor = "rgba(239,68,68,0.6)"}
              onBlur={e => e.target.style.borderColor = "rgba(239,68,68,0.2)"} />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3 rounded-xl"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <span className="text-red-400 text-sm">⚠</span>
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#ef4444,#be123c)", boxShadow: "0 0 25px rgba(239,68,68,0.35)" }}>
            {loading ? "Verifying..." : "Access Admin Control Center"}
          </motion.button>

          <div className="border-t pt-5" style={{ borderColor: "rgba(239,68,68,0.15)" }}>
            <p className="text-slate-500 text-xs text-center mb-3 uppercase tracking-wider font-semibold">Demo Admin Accounts</p>
            <div className="space-y-2">
              {[
                { email: "admin1@safesphere.ai", name: "Admin Arjun" },
                { email: "admin2@safesphere.ai", name: "Admin Priya" },
                { email: "admin3@safesphere.ai", name: "Admin Rahul" },
              ].map(a => (
                <motion.button key={a.email} type="button" whileHover={{ x: 4 }}
                  onClick={() => setForm({ email: a.email, password: "Admin@123" })}
                  className="w-full px-4 py-2.5 rounded-xl text-left flex items-center gap-3 transition-all"
                  style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(239,68,68,0.1)"}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 text-xs font-bold shrink-0"
                    style={{ background: "rgba(239,68,68,0.15)" }}>A</div>
                  <div>
                    <span className="text-white text-xs font-semibold">{a.name}</span>
                    <span className="text-slate-500 text-xs ml-2">{a.email}</span>
                  </div>
                  <span className="ml-auto text-slate-600 text-xs">Click</span>
                </motion.button>
              ))}
            </div>
            <p className="text-slate-600 text-xs text-center mt-3">Password: Admin@123</p>
          </div>
        </form>

        <div className="mt-6 text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-600 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <p className="text-slate-500 text-xs mb-3">Not an administrator?</p>
          <Link to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.08)"}>
            👤 Login as User
          </Link>
        </div>

      </motion.div>
    </div>
  );
}