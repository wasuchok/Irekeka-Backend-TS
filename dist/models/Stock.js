"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
exports.Stock = db_1.sequelize.define("stock", {
    seq: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    equipment_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    equipment_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    code_type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    code_date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    code_run: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    img_1: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    img_2: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    create_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    en: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    detail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "tb_Irekeka_Stock",
    timestamps: false,
});
