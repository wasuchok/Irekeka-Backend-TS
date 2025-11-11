import { Router } from "express";
import { createStock, deleteStock, getStock, getStocks, getStocksPagination, updateStock, updateStockStatus } from "../controllers/stock.controller";
import { optionalStockUpload } from "../middleware/upload";

const router = Router();

router.post("/", optionalStockUpload, createStock);

router.get("/", getStocks);
router.get("/pagi", getStocksPagination);
router.get("/:code", getStock);
router.put("/:code", optionalStockUpload, updateStock);
router.patch("/:code/status", updateStockStatus);
router.delete("/:code", deleteStock);

export default router;
