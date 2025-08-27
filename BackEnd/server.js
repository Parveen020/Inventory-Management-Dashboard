import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import adminRouter from "./routes/AdminRoutes.js";
import productRouter from "./routes/ProductRoutes.js";
import inventoryRouter from "./routes/InventoryRoutes.js";
import invoiceRouter from "./routes/InvoiceRoutes.js";
import overallInvoiceRouter from "./routes/OverallInvoiceRoutes.js";
import dashboardRouter from "./routes/DashboardRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/admin", adminRouter);
app.use("/product", productRouter);
app.use("/images", express.static("uploads"));
app.use("/inventory", inventoryRouter);
app.use("/invoice", invoiceRouter);
app.use("/overall-invoice", overallInvoiceRouter);
app.use("/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
