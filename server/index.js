require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const analyzeRoutes = require("./routes/analyze");
const dashboardRoutes = require("./routes/dashboard");
const complaintRoutes = require("./routes/complaints");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors({ origin: "*", credentials: false }));
app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => res.json({ status: "SafeSphere AI running", time: new Date() }));
app.get("/", (req, res) => res.json({ status: "SafeSphere AI API" }));

const PORT = process.env.PORT || 10000;

// Start server FIRST, then connect MongoDB
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
  mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/safesphere")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err.message));
});