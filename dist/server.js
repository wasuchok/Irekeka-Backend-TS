"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const stock_route_1 = __importDefault(require("./routes/stock.route"));
const emp_route_1 = __importDefault(require("./routes/emp.route"));
const record_route_1 = __importDefault(require("./routes/record.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1/stock", stock_route_1.default);
app.use("/api/v1/emp", emp_route_1.default);
app.use("/api/v1/record", record_route_1.default);
db_1.sequelize.authenticate()
    .then(() => console.log("✅ Connected"))
    .catch(err => console.error("❌ Connection error:", err));
app.listen(3000, () => console.log("Server running on port 3000"));
