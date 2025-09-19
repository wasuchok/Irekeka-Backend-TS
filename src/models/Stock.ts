
import { DataTypes } from "sequelize";
import { sequelize } from "../db";

export const Stock = sequelize.define(
  "stock",
  {
    seq: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    equipment_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    equipment_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code_type : {
        type : DataTypes.STRING,
        allowNull : true
    },
    code_date : {
        type : DataTypes.STRING,
        allowNull : true
    },
    code_run : {
        type : DataTypes.STRING,
        allowNull : true
    },
    img_1 : {
        type : DataTypes.STRING,
        allowNull : true
    },
    img_2 : {
        type : DataTypes.STRING,
        allowNull : true
    },
    status : {
        type : DataTypes.STRING,
        allowNull : true
    },
    create_date : {
        type : DataTypes.DATE,
        allowNull : true
    },
    en : {
        type : DataTypes.INTEGER,
        allowNull : true
    },
    detail : {
        type : DataTypes.STRING,
        allowNull : true
    }
  },
  {
    tableName: "tb_Irekeka_Stock",
    timestamps: false, 
  }
);
