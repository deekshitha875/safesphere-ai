import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const SCFG = {
  pending:      { label: "Pending",      color: "#facc15", bg: "rgba(234,179,8,0.1)",   border: "1px solid rgba(234,179,8,0.3)" },
  under_review: { label: "Under Review", color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "1px solid rgba(96,165,250,0.3)" },
  resolved:     { label: "Resolved",     color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "1px solid rgba(74,222,128,0.3)" },
  dismissed:    { label: "Dismissed",    color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "1px solid rgba(148,163,184,0.3)" },
};
const VCFG = {
  low:      { color: "#4ade80", bg: "rgba(74,222,128,0.1)",   border: "1px solid rgba(74,222,128,0.3)" },
  medium:   { color: "#facc15", bg: "rgba(234,179,8,0.1)",    border: "1px solid rgba(234,179,8,0.3)" },
  high:     { color: "#fb923c", bg: "rgba(251,146,60,0.1)",   border: "1px solid rgba(251,146,60,0.3)" },
  critical: { color: "#f87171", bg: "rgba(248,113,113,0.1)",  border: "1px solid rgba(248,113,113,0.3)" },
};
const QR = [
  "We have reviewed your complaint and taken appropriate action against the offender.",
  "Your complaint has been escalated to the platform where the incident occurred.",
  "We have issued a formal warning to the reported user.",
  "We are actively investigating this case and will update you within 48 hours.",
  "This case has been referred to law enforcement authorities for further action.",
  "The offender account has been reported to the respective platform.",
];

const box = (extra) => ({ ...{ padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }, ...extra });
const inp = { width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" };

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unread, setUnread] = useState(0);
  const [tab, setTab] = useState("overview");
  const [filter, setFilter] = useState({ status: "", severity: "" });
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(null);
  const [af, setAf] = useState({ status: "", adminNotes: "", adminAction: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [rid, setRid] = useState(null);
  const [rt, setRt] = useState("");
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (!user) { nav("/admin-login", { replace: true }); return; }
    if (user.role !== "admin") { nav("/", { replace: true }); return; }
    loadAll();
  }, [user]);

  useEffect(() => { if (user?.role === "admin") loadC(); }, [filter]);

  const loadAll = () => { loadStats(); loadC(); loadM(); };
  const loadStats = async () => { try { const { data } = await axios.get("/api/admin/stats"); setStats(data); setUnread(data.unreadMessages || 0); } catch {} };
  const loadC = async () => {
    try {
      const p = new URLSearchParams();
      if (filter.status) p.append("status", filter.status);
      if (filter.severity) p.append("severity", filter.severity);
      const { data } = await axios.get("/api/admin/complaints?" + p);
      setComplaints(data.complaints || []);
    } catch {}
  };
  const loadM = async () => { try { const { data } = await axios.get("/api/contact/admin/all"); setMessages(data.messages || []); setUnread(data.unread || 0); } catch {} };
  const toast_ = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };
  const addLog = (a) => setLog(p => [{ t: new Date().toLocaleTimeString(), a, n: user.name }, ...p.slice(0, 49)]);
  const doLogout = () => { logout(); nav("/admin-login", { replace: true }); };
  const openSel = (c) => { setSel(c); setAf({ status: c.status, adminNotes: c.adminNotes || "", adminAction: c.adminAction || "" }); };
  const saveAct = async () => {
    if (!sel) return; setSaving(true);
    try { await axios.patch("/api/admin/complaints/" + sel._id, af); addLog("Updated to " + af.status); toast_("Response sent"); setSel(null); loadC(); loadStats(); }
    catch { toast_("Failed"); } finally { setSaving(false); }
  };
  const markRead = async (id) => { try { await axios.patch("/api/contact/admin/" + id + "/read"); loadM(); } catch {} };
  const sendReply = async (id) => {
    if (!rt.trim()) return; setSaving(true);
    try { await axios.patch("/api/contact/admin/" + id + "/reply", { reply: rt }); toast_("Reply sent"); addLog("Replied to message"); setRid(null); setRt(""); loadM(); }
    catch { toast_("Failed"); } finally { setSaving(false); }
  };

  const filtered = complaints.filter(c => {
    if (tab === "critical" && c.severity !== "critical") return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return c.offenderName?.toLowerCase().includes(s) || c.incidentDescription?.toLowerCase().includes(s) || c.reportedBy?.name?.toLowerCase().includes(s);
  });

  if (!user || user.role !== "admin") return null;

  const navItems = [
    { id: "overview",   e: "📊", label: "Overview" },
    { id: "complaints", e: "📋", label: "Complaints",  badge: stats?.pending,  bc: "#eab308" },
    { id: "critical",   e: "🚨", label: "Critical",    badge: stats?.critical, bc: "#ef4444" },
    { id: "messages",   e: "💬", label: "Messages",    badge: unread,          bc: "#6366f1" },
    { id: "team",       e: "👥", label: "Admin Team" },
    { id: "resources",  e: "🔗", label: "Resources" },
    { id: "log",        e: "📝", label: "Activity Log" },
  ];

  const S = { display: "flex", height: "100vh", overflow: "hidden", background: "#020617", fontFamily: "Inter,sans-serif", color: "#fff" };
  const sidebar = { width: 240, flexShrink: 0, display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto", background: "rgba(8,12,25,1)", borderRight: "1px solid rgba(239,68,68,0.2)" };
  const main = { flex: 1, overflowY: "auto", background: "#020617" };

  return (
    <div style={S}>
      <div style={sidebar}>
        <div style={{ padding: "18px 14px 14px", borderBottom: "1px solid rgba(239,68,68,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#ef4444,#be123c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛡️</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>SafeSphere AI</div>
              <div style={{ color: "#f87171", fontSize: 11, fontWeight: 600 }}>Admin Center</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171" }} />
            <span style={{ color: "#f87171", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>RESTRICTED ACCESS</span>
          </div>
        </div>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {user.name?.charAt(0) || "A"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
              <div style={{ color: "#64748b", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
            <span style={{ color: "#4ade80", fontSize: 11 }}>Active Session</span>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: tab === item.id ? "rgba(239,68,68,0.12)" : "transparent", border: tab === item.id ? "1px solid rgba(239,68,68,0.3)" : "1px solid transparent", color: tab === item.id ? "#fff" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 500, textAlign: "left", width: "100%" }}>
              <span style={{ fontSize: 15 }}>{item.e}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && <span style={{ padding: "1px 6px", borderRadius: 10, fontSize: 10, fontWeight: 700, color: "#fff", background: item.bc || "#eab308" }}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: 8, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button onClick={doLogout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", cursor: "pointer", fontSize: 13, fontWeight: 500, width: "100%" }}>
            🚪 Logout
          </button>
        </div>
      </div>
      <div style={main}>
        <div style={{ position: "sticky", top: 0, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(2,6,23,0.98)", backdropFilter: "blur(10px)" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>
              {tab === "overview" ? "Overview" : tab === "complaints" ? "All Complaints" : tab === "critical" ? "Critical Cases" : tab === "messages" ? "User Messages" : tab === "team" ? "Admin Team" : tab === "resources" ? "Resources" : "Activity Log"}
            </div>
            <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>SafeSphere AI Admin Control Center</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => { loadAll(); toast_("Refreshed"); }} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", cursor: "pointer", fontSize: 12 }}>Refresh</button>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171" }} />
              <span style={{ color: "#f87171", fontSize: 12, fontWeight: 600 }}>{user.name}</span>
            </div>
          </div>
        </div>
        <div style={{ padding: 24 }}>
          <AnimatePresence>
            {toast && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ position: "fixed", top: 16, right: 16, zIndex: 50, padding: "12px 20px", borderRadius: 12, background: "rgba(15,23,42,0.97)", border: "1px solid rgba(99,102,241,0.4)", color: "#fff", fontSize: 13, boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
                {toast}
              </motion.div>
            )}
          </AnimatePresence>

          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {[
                  { label: "Total Complaints", value: stats?.total || 0, e: "📋", c: "#fff" },
                  { label: "Pending Review",   value: stats?.pending || 0, e: "⏳", c: "#facc15" },
                  { label: "Under Review",     value: stats?.under_review || 0, e: "🔍", c: "#60a5fa" },
                  { label: "Resolved",         value: stats?.resolved || 0, e: "✅", c: "#4ade80" },
                  { label: "Critical",         value: stats?.critical || 0, e: "🚨", c: "#f87171" },
                  { label: "Unread Messages",  value: unread, e: "💬", c: "#818cf8" },
                ].map((c, i) => (
                  <div key={i} style={{ padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{c.e}</div>
                    <div style={{ color: c.c, fontSize: 32, fontWeight: 800 }}>{c.value}</div>
                    <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{c.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 20, borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Recent Complaints</span>
                  <button onClick={() => setTab("complaints")} style={{ color: "#818cf8", fontSize: 12, background: "none", border: "none", cursor: "pointer" }}>View All</button>
                </div>
                {!stats?.recent?.length && <p style={{ color: "#475569", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No complaints yet.</p>}
                {stats?.recent?.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", marginBottom: 6 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{c.reportedBy?.name || "Anonymous"} to {c.offenderName}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginLeft: 12 }}>
                      <span style={{ color: VCFG[c.severity]?.color || "#fff", fontSize: 11, fontWeight: 700 }}>{c.severity}</span>
                      <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, color: SCFG[c.status]?.color, background: SCFG[c.status]?.bg, border: SCFG[c.status]?.border }}>{SCFG[c.status]?.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { label: "Review Pending", e: "⏳", g: "linear-gradient(135deg,#eab308,#f97316)", t: "complaints" },
                  { label: "Critical Cases", e: "🚨", g: "linear-gradient(135deg,#ef4444,#be123c)", t: "critical" },
                  { label: "View Messages", e: "💬", g: "linear-gradient(135deg,#6366f1,#8b5cf6)", t: "messages" },
                ].map(a => (
                  <button key={a.label} onClick={() => setTab(a.t)} style={{ padding: "16px 12px", borderRadius: 14, background: a.g, border: "none", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{a.e}</span> {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(tab === "complaints" || tab === "critical") && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search complaints..." style={{ ...inp, flex: 1, minWidth: 200 }} />
                <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })} style={{ ...inp, width: "auto" }}>
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
                <select value={filter.severity} onChange={e => setFilter({ ...filter, severity: e.target.value })} style={{ ...inp, width: "auto" }}>
                  <option value="">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <button onClick={() => { setFilter({ status: "", severity: "" }); setSearch(""); }} style={{ ...inp, width: "auto", cursor: "pointer" }}>Clear</button>
              </div>
              <p style={{ color: "#475569", fontSize: 12 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
              {filtered.length === 0 && <div style={{ padding: 60, textAlign: "center", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}><div style={{ fontSize: 48, marginBottom: 12 }}>📭</div><p style={{ color: "#475569" }}>No complaints found.</p></div>}
              {filtered.map((c, i) => (
                <div key={c._id} onClick={() => openSel(c)}
                  style={{ padding: 16, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: c.severity === "critical" ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = c.severity === "critical" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, color: SCFG[c.status]?.color, background: SCFG[c.status]?.bg, border: SCFG[c.status]?.border }}>{SCFG[c.status]?.label}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: VCFG[c.severity]?.color, background: VCFG[c.severity]?.bg, border: VCFG[c.severity]?.border }}>{c.severity?.toUpperCase()}</span>
                    <span style={{ color: "#475569", fontSize: 11 }}>{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: "#64748b" }}>From: </span><span style={{ color: "#818cf8" }}>{c.reportedBy?.name || c.reportedByName || "Anonymous"}</span>
                    <span style={{ color: "#64748b", margin: "0 6px" }}>Against:</span><span style={{ color: "#f87171", fontWeight: 600 }}>{c.offenderName}</span>
                    <span style={{ color: "#64748b", margin: "0 6px" }}>on</span><span style={{ color: "#cbd5e1" }}>{c.offenderPlatform}</span>
                  </p>
                  <p style={{ color: "#475569", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.incidentDescription}</p>
                  {c.detectedWords?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                      {c.detectedWords.slice(0, 5).map(w => <span key={w} style={{ padding: "1px 6px", borderRadius: 6, background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", fontSize: 11 }}>{w}</span>)}
                      {c.detectedWords.length > 5 && <span style={{ color: "#475569", fontSize: 11 }}>+{c.detectedWords.length - 5} more</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "messages" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ color: "#fff", fontWeight: 600, fontSize: 16, margin: 0 }}>Contact Messages from Users</h3>
                  <p style={{ color: "#475569", fontSize: 12, marginTop: 4 }}>Messages sent via the Get In Touch form on the main website</p>
                </div>
                <button onClick={loadM} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", cursor: "pointer", fontSize: 12 }}>Refresh</button>
              </div>
              {messages.length === 0 && (
                <div style={{ padding: 60, textAlign: "center", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                  <p style={{ color: "#fff", fontWeight: 600, marginBottom: 6 }}>No messages yet</p>
                  <p style={{ color: "#475569", fontSize: 13 }}>Messages from the website contact form will appear here.</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={m._id} style={{ padding: 20, borderRadius: 14, background: m.isRead ? "rgba(255,255,255,0.02)" : "rgba(99,102,241,0.06)", border: m.isRead ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(99,102,241,0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {m.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, margin: 0 }}>{m.name}</p>
                        <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>{m.email}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {!m.isRead && <span style={{ padding: "2px 8px", borderRadius: 20, background: "#6366f1", color: "#fff", fontSize: 10, fontWeight: 700 }}>NEW</span>}
                      {m.adminReply && <span style={{ padding: "2px 8px", borderRadius: 20, background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)", fontSize: 10, fontWeight: 700 }}>REPLIED</span>}
                      <span style={{ color: "#475569", fontSize: 11 }}>{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", marginBottom: 12 }}>
                    <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{m.message}</p>
                  </div>
                  {m.adminReply && (
                    <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", marginBottom: 12 }}>
                      <p style={{ color: "#818cf8", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Admin Reply:</p>
                      <p style={{ color: "#cbd5e1", fontSize: 13, margin: 0 }}>{m.adminReply}</p>
                    </div>
                  )}
                  {rid === m._id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <textarea value={rt} onChange={e => setRt(e.target.value)} placeholder="Type your reply..." rows={3}
                        style={{ ...inp, resize: "none", border: "1px solid rgba(99,102,241,0.3)" }} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => { setRid(null); setRt(""); }} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", cursor: "pointer", fontSize: 12 }}>Cancel</button>
                        <button onClick={() => sendReply(m._id)} disabled={saving || !rt.trim()} style={{ flex: 1, padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, opacity: saving || !rt.trim() ? 0.5 : 1 }}>
                          {saving ? "Sending..." : "Send Reply"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                      {!m.isRead && <button onClick={() => markRead(m._id)} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", cursor: "pointer", fontSize: 12 }}>Mark Read</button>}
                      <button onClick={() => { setRid(m._id); setRt(""); markRead(m._id); }} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        {m.adminReply ? "Edit Reply" : "Reply"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "team" && (
            <div style={{ padding: 24, borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 24 }}>Certified Administrator Team (3)</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                {stats?.admins?.map((a, i) => (
                  <div key={a._id} style={{ padding: 24, borderRadius: 14, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)", textAlign: "center" }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 24, margin: "0 auto 12px" }}>{a.name.charAt(0)}</div>
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: 15, margin: "0 0 4px" }}>{a.name}</p>
                    <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 12px" }}>{a.email}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
                      <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>Active</span>
                    </div>
                    <div style={{ marginTop: 12, padding: "6px 12px", borderRadius: 8, background: "rgba(99,102,241,0.1)", color: "#818cf8", fontSize: 12, fontWeight: 600 }}>Certified Admin</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "resources" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { cat: "India Official Portals", links: [
                  { title: "National Cyber Crime Portal", url: "https://cybercrime.gov.in", desc: "File cybercrime complaints with Indian government" },
                  { title: "iCall Helpline TISS", url: "https://icallhelpline.org", desc: "Free psychosocial support - 9152987821" },
                  { title: "NCPCR Child Protection", url: "https://ncpcr.gov.in", desc: "National Commission for Protection of Child Rights" },
                ]},
                { cat: "Platform Reporting", links: [
                  { title: "Report on Instagram", url: "https://help.instagram.com/527320407282978", desc: "Report harassment on Instagram" },
                  { title: "Report on Facebook", url: "https://www.facebook.com/safety/bullying", desc: "Facebook bullying prevention hub" },
                  { title: "Report on Twitter X", url: "https://help.twitter.com/en/safety-and-security/report-abusive-behavior", desc: "Report abusive behavior on X" },
                  { title: "Report on WhatsApp", url: "https://faq.whatsapp.com/1142481766359885", desc: "Block and report harmful contacts" },
                ]},
                { cat: "Legal and Mental Health", links: [
                  { title: "IT Act Cybercrime India", url: "https://cybercrime.gov.in/Webform/Crime_AboutCyberCrime.aspx", desc: "IT Act 2000 legal provisions" },
                  { title: "Vandrevala Foundation", url: "https://www.vandrevalafoundation.com", desc: "24/7 helpline - 1860-2662-345" },
                  { title: "Crisis Text Line", url: "https://crisistextline.org", desc: "Text HOME to 741741" },
                ]},
              ].map((s, si) => (
                <div key={si} style={{ padding: 20, borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <h3 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 14 }}>{s.cat}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {s.links.map((l, li) => (
                      <a key={li} href={l.url} target="_blank" rel="noopener noreferrer"
                        style={{ padding: 14, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none", display: "block" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>
                        <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>{l.title}</p>
                        <p style={{ color: "#64748b", fontSize: 11, margin: 0 }}>{l.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "log" && (
            <div style={{ padding: 20, borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ color: "#fff", fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Activity Log (this session)</h3>
              {log.length === 0 ? <p style={{ color: "#475569", textAlign: "center", padding: "40px 0" }}>No activity yet this session.</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {log.map((l, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
                      <span style={{ color: "#475569", fontSize: 11, flexShrink: 0 }}>{l.t}</span>
                      <span style={{ color: "#cbd5e1", fontSize: 13, flex: 1 }}>{l.a}</span>
                      <span style={{ color: "#818cf8", fontSize: 11, flexShrink: 0 }}>{l.n}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {sel && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
          onClick={e => e.target === e.currentTarget && setSel(null)}>
          <motion.div initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }}
            style={{ width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", borderRadius: 16, background: "rgba(10,15,30,0.99)", border: "1px solid rgba(99,102,241,0.3)" }}>
            <div style={{ position: "sticky", top: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,15,30,0.99)" }}>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Review and Respond</div>
                <div style={{ color: "#475569", fontSize: 11 }}>ID: {sel._id?.slice(-8)}</div>
              </div>
              <button onClick={() => setSel(null)} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16 }}>X</button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={box()}>
                  <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>Reported By</div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{sel.reportedBy?.name || sel.reportedByName || "Anonymous"}</div>
                  <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>{sel.reportedBy?.email || sel.reportedByEmail}</div>
                </div>
                <div style={{ ...box(), background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>Offender</div>
                  <div style={{ color: "#f87171", fontWeight: 600, fontSize: 13 }}>{sel.offenderName}</div>
                  <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>on {sel.offenderPlatform}</div>
                </div>
              </div>
              <div style={box()}>
                <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>Incident</div>
                <div style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.6 }}>{sel.incidentDescription}</div>
              </div>
              <div style={{ ...box(), background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <div style={{ color: "#f87171", fontSize: 10, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>Harmful Content</div>
                <div style={{ color: "#cbd5e1", fontSize: 13, fontStyle: "italic" }}>"{sel.harmfulContent}"</div>
                {sel.detectedWords?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                    {sel.detectedWords.map(w => <span key={w} style={{ padding: "2px 8px", borderRadius: 20, background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", fontSize: 11, fontWeight: 600 }}>{w}</span>)}
                  </div>
                )}
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Admin Response</div>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Update Status</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                    {Object.entries(SCFG).map(([key, val]) => (
                      <button key={key} onClick={() => setAf({ ...af, status: key })}
                        style={{ padding: "8px 4px", borderRadius: 10, border: af.status === key ? "1px solid " + val.color : "1px solid rgba(255,255,255,0.08)", background: af.status === key ? val.bg : "rgba(255,255,255,0.03)", color: af.status === key ? val.color : "#64748b", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                        {val.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Quick Templates</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 120, overflowY: "auto" }}>
                    {QR.map((r, i) => (
                      <button key={i} onClick={() => setAf({ ...af, adminNotes: r })}
                        style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#94a3b8", cursor: "pointer", fontSize: 11, textAlign: "left" }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Response to Reporter</div>
                  <textarea value={af.adminNotes} onChange={e => setAf({ ...af, adminNotes: e.target.value })} placeholder="Write your response..." rows={3}
                    style={{ ...inp, resize: "none" }} />
                </div>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Internal Action Taken</div>
                  <textarea value={af.adminAction} onChange={e => setAf({ ...af, adminAction: e.target.value })} placeholder="e.g. Warned user, reported to platform..." rows={2}
                    style={{ ...inp, resize: "none" }} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setSel(null)} style={{ padding: "12px 20px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Cancel</button>
                  <button onClick={saveAct} disabled={saving || !af.status}
                    style={{ flex: 1, padding: "12px 20px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", cursor: saving || !af.status ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700, opacity: saving || !af.status ? 0.5 : 1 }}>
                    {saving ? "Saving..." : "Submit Response and Update"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
