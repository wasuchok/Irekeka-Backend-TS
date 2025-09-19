"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Record = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
exports.Record = db_1.sequelize.define("record", {
    seq: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    date_out: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    date_in: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    user_out: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    user_in: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    it_out: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    it_in: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    num_date: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: "tb_Irekeka_Record",
    timestamps: false,
});
