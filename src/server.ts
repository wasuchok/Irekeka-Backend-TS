import cors from 'cors';
import dotenv from "dotenv";
import express from "express";

import swaggerStats from "swagger-stats";
import { sequelize } from "./db";
import EmpRoutes from './routes/emp.route';
import RecordRoutes from './routes/record.route';
import StockRoutes from './routes/stock.route';
import UrgentRoutes from './routes/urgent.route';
import VersionRoutes from './routes/version.route';

dotenv.config();

const app = express();


app.use(swaggerStats.getMiddleware({
  uriPath: '/swagger-stats',
  swaggerSpec: {
    swagger: "2.0",
    info: {
      title: "API Stats Example",
      version: "1.0.0"
    },
    paths: {}
  }
}));



app.use(express.json())

app.use(cors())

app.use("/api/v1/stock", StockRoutes);
app.use("/api/v1/emp", EmpRoutes)
app.use("/api/v1/record", RecordRoutes)
app.use("/api/v1/borrow-urgent", UrgentRoutes)
app.use("/api/v1/version", VersionRoutes)




sequelize.authenticate()
  .then(() => console.log("✅ Connected"))
  .catch(err => console.error("❌ Connection error:", err));


app.listen(3000, () => console.log("Server running on port 3000"));
