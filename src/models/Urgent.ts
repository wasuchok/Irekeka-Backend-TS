import { DataTypes } from "sequelize";
import { sequelize } from "../db";

export const Urgent = sequelize.define(
    "urgent",
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
            type: DataTypes.STRING,
            allowNull: true,
        },
        date_in: {
            type: DataTypes.STRING,
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
        image_url: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },
    {
        tableName: "tb_Irekeka_Urgent",
        timestamps: false,
    }
)

