import { Router } from "express";
import { getEmployee } from "../controllers/emp.controller";

const router = Router();

router.get("/:emp_id", getEmployee);

export default router;