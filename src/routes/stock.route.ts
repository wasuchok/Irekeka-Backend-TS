import { Router } from "express";
import { getStock, getStocks } from "../controllers/stock.controller";

const router = Router();

router.get("/", getStocks);
router.get("/:code", getStock)

export default router;