"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emp_controller_1 = require("../controllers/emp.controller");
const router = (0, express_1.Router)();
router.get("/:emp_id", emp_controller_1.getEmployee);
exports.default = router;
