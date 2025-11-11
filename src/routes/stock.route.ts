import { Router } from "express";
import { getStock, getStocks, getStocksPagination } from "../controllers/stock.controller";

const router = Router();

router.get("/", getStocks);
router.get("/pagi", getStocksPagination)
router.get("/:code", getStock)

export default router;