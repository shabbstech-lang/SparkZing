import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mock API Routes
  app.get("/api/stats", (req, res) => {
    res.json({
      revenue: 128430.50,
      sales: 456,
      customers: 1234,
      avgOrderValue: 281.65,
      revenueChange: 12.5,
      salesChange: -3.2,
      customersChange: 8.4,
      aovChange: 5.1
    });
  });

  app.get("/api/recent-orders", (req, res) => {
    res.json([
      { id: "ORD-7321", customer: "Alice Johnson", amount: 120.50, status: "Delivered", date: "2024-05-10" },
      { id: "ORD-7322", customer: "Bob Smith", amount: 85.00, status: "Processing", date: "2024-05-11" },
      { id: "ORD-7323", customer: "Charlie Davis", amount: 450.25, status: "Shipped", date: "2024-05-11" },
      { id: "ORD-7324", customer: "Diana Prince", amount: 32.10, status: "Pending", date: "2024-05-12" },
      { id: "ORD-7325", customer: "Edward Norton", amount: 210.00, status: "Delivered", date: "2024-05-12" },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
