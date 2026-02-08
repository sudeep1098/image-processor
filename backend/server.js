import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import healthRoute from "./routes/health.routes.js";
import uploadRoute from "./routes/upload.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Routes
app.use("/health", healthRoute);
app.use("/api/upload", uploadRoute);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Image Processor API',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
