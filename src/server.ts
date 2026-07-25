import "dotenv/config";
import app from "@/app";
import cors from "cors";

const PORT = process.env.PORT || 5000;

// 1. Set up CORS here (before app.listen)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// 2. Start the server and listen for requests
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
