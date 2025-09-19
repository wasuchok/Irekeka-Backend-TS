import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { sequelize } from "../db";
import { Stock } from "../models/Stock";
import { ApiResponse, calculateDuration } from "../response/response";

export const insertRecord = async (req: Request, res: Response) => {
    const startTime = Date.now();

    try {
        const { code, user_out, it_out, num_date } = req.body;

        const [result]: any = await sequelize.query(
            `EXEC [ITDB].[dbo].[sp_Irekeka_Inser_Record]
                @code = :code,
                @user_out = :user_out,
                @it_out = :it_out,
                @num_date = :num_date`,


            {
                replacements: { code, user_out, it_out, num_date },
                type: QueryTypes.RAW,
            }
        );

        await Stock.update({
            status: "borrowed"
        }, {
            where: {
                equipment_code: code
            }
        })

        const response: ApiResponse<typeof result> = {
            success: true,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            data: result,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("insertRecord error:", error);

        const response: ApiResponse<null> = {
            success: false,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล",
        };

        res.status(500).json(response);
    }
};


export const returnRecord = async (req: Request, res: Response) => {
    const startTime = Date.now();

    try {
        const { code, user_in, it_in } = req.body;

        const [result]: any = await sequelize.query(
            `EXEC [ITDB].[dbo].[sp_Irekeka_Update_Record]
        @code = :code,
        @user_in = :user_in,
        @it_in = :it_in
    `,
            {
                replacements: { code, user_in, it_in },
                type: QueryTypes.RAW,
            }
        );

        await Stock.update({
            status: "in-stock"
        }, {
            where: {
                equipment_code: code
            }
        })

        const response: ApiResponse<typeof result> = {
            success: true,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            data: result,
        };

        res.status(200).json(response);

    } catch (error) {
        console.error("updateRecord error:", error)

        const response: ApiResponse<null> = {
            success: false,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล",
        };

        res.status(500).json(response);
    }
}

