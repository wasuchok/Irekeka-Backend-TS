import { DataTypes } from "sequelize";
import { sequelize } from "../db";

export const Record = sequelize.define(
    "record",
    {
        seq: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date_out: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        date_in: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        user_out: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_in: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        it_out: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        it_in: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        num_date: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: "tb_Irekeka_Record",
        timestamps: false,
    }
)