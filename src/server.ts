import "dotenv/config";
import app from "./app";
import cors from "cors";

const PORT = process.env.PORT || 5000;

// 1. Pasang CORS di sini (di atas app.listen)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// 2. Server baru mendengarkan request
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});