"use strict";
// http://10.17.2.3/IREKEKA/image_item/1743654596.jpg
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStock = exports.getStocks = void 0;
const Stock_1 = require("../models/Stock");
const response_1 = require("../response/response");
const getStocks = async (req, res) => {
    const startTime = Date.now();
    try {
        const stocks = await Stock_1.Stock.findAll({
            where: {
                en: 1
            }
        });
        const response = {
            success: true,
            duration: (0, response_1.calculateDuration)(startTime),
            timestamp: new Date().toISOString(),
            data: stocks,
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
exports.getStocks = getStocks;
const getStock = async (req, res) => {
    const startTime = Date.now();
    try {
        const stock = await Stock_1.Stock.findOne({
            where: {
                equipment_code: req.params.code,
                en: 1
            }
        });
        const response = {
            success: true,
            duration: (0, response_1.calculateDuration)(startTime),
            timestamp: new Date().toISOString(),
            data: stock,
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
exports.getStock = getStock;
