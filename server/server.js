require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");

const { notFound, errorHandler } = require("./middleware/error");

const app = express();

/* =========================
   CORS
========================= */

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

/* =========================
   Middleware
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   Static Uploads
========================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   Root Route
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CampusMart Backend is running!",
  });
});

/* =========================
   Health Check
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CampusMart API is running",
  });
});

/* =========================
   API Routes
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

/* =========================
   Error Handling
========================= */

app.use(notFound);
app.use(errorHandler);

/* =========================
   Server
========================= */

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });
