import { Router } from "express";
import { insertRecord, returnRecord } from "../controllers/record.controller";

const router = Router();

router.post("/", insertRecord);
router.put("/", returnRecord)

export default router;