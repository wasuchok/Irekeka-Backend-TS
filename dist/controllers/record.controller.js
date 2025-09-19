"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnRecord = exports.insertRecord = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const Stock_1 = require("../models/Stock");
const response_1 = require("../response/response");
const insertRecord = async (req, res) => {
    const startTime = Date.now();
    try {
        const { code, user_out, it_out, num_date } = req.body;
        const [result] = await db_1.sequelize.query(`EXEC [ITDB].[dbo].[sp_Irekeka_Inser_Record]
                @code = :code,
                @user_out = :user_out,
                @it_out = :it_out,
                @num_date = :num_date`, {
            replacements: { code, user_out, it_out, num_date },
            type: sequelize_1.QueryTypes.RAW,
        });
        await Stock_1.Stock.update({
            status: "borrowed"
        }, {
            where: {
                equipment_code: code
            }
        });
        const response = {
            success: true,
            duration: (0, response_1.calculateDuration)(startTime),
            timestamp: new Date().toISOString(),
            data: result,
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("insertRecord error:", error);
        const response = {
            success: false,
            duration: (0, response_1.calculateDuration)(startTime),
            timestamp: new Date().toISOString(),
            error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล",
        };
        res.status(500).json(response);
    }
};
exports.insertRecord = insertRecord;
const returnRecord = async (req, res) => {
    const startTime = Date.now();
    try {
        const { code, user_in, it_in } = req.body;
        const [result] = await db_1.sequelize.query(`EXEC [ITDB].[dbo].[sp_Irekeka_Update_Record]
        @code = :code,
        @user_in = :user_in,
        @it_in = :it_in
    `, {
            replacements: { code, user_in, it_in },
            type: sequelize_1.QueryTypes.RAW,
        });
        await Stock_1.Stock.update({
            status: "in-stock"
        }, {
            where: {
                equipment_code: code
            }
        });
        const response = {
            success: true,
            duration: (0, response_1.calculateDuration)(startTime),
            timestamp: new Date().toISOString(),
            data: result,
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("updateRecord error:", error);
        const response = {
            success: false,
            duration: (0, response_1.calculateDuration)(startTime),
            timestamp: new Date().toISOString(),
            error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล",
        };
        res.status(500).json(response);
    }
};
exports.returnRecord = returnRecord;
