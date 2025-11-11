import { Router } from "express";
import { getVersion, updateVersionAndInsertVersion } from "../controllers/version.controller";

const router = Router();


router.get("/:name", getVersion)
router.post("/", updateVersionAndInsertVersion)

export default router;