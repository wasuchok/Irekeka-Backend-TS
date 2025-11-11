import { Router } from "express";
import { getBorrowedEquipments, insertRecord, returnRecord } from "../controllers/record.controller";

const router = Router();

router.get("/", getBorrowedEquipments)
router.post("/", insertRecord);
router.put("/", returnRecord)

export default router;