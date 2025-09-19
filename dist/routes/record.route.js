"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const record_controller_1 = require("../controllers/record.controller");
const router = (0, express_1.Router)();
router.post("/", record_controller_1.insertRecord);
router.put("/", record_controller_1.returnRecord);
exports.default = router;
