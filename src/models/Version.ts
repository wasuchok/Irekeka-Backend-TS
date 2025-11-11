import { DataTypes } from "sequelize";
import { sequelize } from "../db";

export const Version = sequelize.define(
    "version",
    {
        seq: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        sys_Name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sys_Version: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sys_Url: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        tableName: "tb_sys_Version",
        timestamps: false,
    }
);