import { Router } from "express";
import { getStock, getStocks, getStocksPagination, updateStock } from "../controllers/stock.controller";
import { stockUpload } from "../middleware/upload";

const router = Router();

router.get("/", getStocks);
router.get("/pagi", getStocksPagination);
router.get("/:code", getStock);
router.put(
  "/:code",
  stockUpload.fields([
    { name: "img_1", maxCount: 1 },
    { name: "img_2", maxCount: 1 },
  ]),
  updateStock
);

export default router;
