"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployee = void 0;
const db_1 = require("../db");
const response_1 = require("../response/response");
const getEmployee = async (req, res) => {
    const startTime = Date.now();
    try {
        const [results] = await db_1.sequelize.query(`
    SELECT TOP (1000) [emp_id], [emp_name], [Sect]
    FROM [v_Get_Emp_Name]
    WHERE emp_id = ?
  `, {
            replacements: [req.params.emp_id],
        });
        const response = {
            success: true,
            duration: (0, response_1.calculateDuration)(startTime),
            timestamp: new Date().toISOString(),
            data: results,
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        const response = {
            success: false,
            duration: (0, response_1.calculateDuration)(startTime),
            timestamp: new Date().toISOString(),
            error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสต็อก',
        };
        res.status(500).json(response);
    }
};
exports.getEmployee = getEmployee;
