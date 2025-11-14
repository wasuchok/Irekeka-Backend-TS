

import { Router } from "express";
import { borrowUrgent, getAllUrgent, getAllUrgentAdmin, returnUrgent } from "../controllers/urgent.controller";
import { upload } from "../middleware/upload";


const router = Router();

router.post("/", upload.single("image"), borrowUrgent);
router.get("/admin", getAllUrgentAdmin);
router.get("/", getAllUrgent)
router.put("/:seq", returnUrgent)

export default router;
