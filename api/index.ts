import express from "express";

const app = express();

// API Routes (Migrated from server.ts)
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

export default app;
