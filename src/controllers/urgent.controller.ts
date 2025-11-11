import { Request, Response } from "express";
import { QueryTypes, Transaction } from "sequelize";
import { sequelize } from "../db";
import { Urgent } from "../models/Urgent";
import { ApiResponse, calculateDuration } from "../response/response";

function formatDateToSQL(date: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

async function generateDailyCode(t: Transaction) {

    await sequelize.query(
        "SELECT TOP 1 code FROM tb_Irekeka_Urgent WITH (TABLOCKX)",
        { transaction: t, type: QueryTypes.SELECT }
    );

    const now = new Date();
    const dateCode = String(now.getFullYear()).slice(-2) +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0");

    const [result]: any = await sequelize.query(
        `SELECT MAX(CAST(SUBSTRING(code, 8, 2) AS INT)) AS maxNumber
        FROM tb_Irekeka_Urgent
        WHERE CONVERT(date, date_out) = CONVERT(date, GETDATE())`,
        { transaction: t, type: QueryTypes.SELECT }
    );

    const nextNum = (result?.maxNumber ?? 0) + 1;
    const newCode = `${dateCode}-${String(nextNum).padStart(2, "0")}`;

    return newCode;
}



export const borrowUrgent = async (req: Request, res: Response) => {
    const startTime = Date.now();
    const t = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE });

    try {
        const { user_out, it_out, num_date } = req.body;
        const file = req.file;

        const code = await generateDailyCode(t);

        const newRecord = await Urgent.create({
            code,
            date_out: formatDateToSQL(new Date()),
            user_out,
            it_out,
            num_date,
            image_url: `image_urgent/${file?.filename}`,
        }, { transaction: t });

        await t.commit();

        res.status(200).json({
            success: true,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            data: newRecord,
        });

    } catch (error) {
        await t.rollback();
        console.error(error);

        res.status(500).json({
            success: false,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลสต็อก',
        });
    }
};



export const returnUrgent = async (req: Request, res: Response) => {
    const startTime = Date.now();
    try {

        await Urgent.update({
            date_in: formatDateToSQL(new Date()),
            user_in: req.body.user_in,
            it_in: req.body.it_in
        }, {
            where: {
                seq: req.params.seq
            }
        })
        const response: ApiResponse<null> = {
            success: true,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            data: null,
        };

        res.status(200).json(response);

    } catch (error) {
        console.error(error);
        const response: ApiResponse<null> = {
            success: false,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสต็อก',
        };
        res.status(500).json(response);
    }
};

export const getAllUrgent = async (req: Request, res: Response) => {
    const startTime = Date.now();
    try {
        const userOut = req.query.user_out || '';
        const sql = `
SELECT u.*, e.emp_name, e.Sect
FROM tb_Irekeka_Urgent u
LEFT JOIN v_Get_Emp_Name e
  ON u.user_out = e.emp_id
WHERE u.date_in IS NULL
${userOut ? 'AND u.user_out = :userOut' : ''}
ORDER BY u.date_out DESC
`;

        const data = await sequelize.query(sql, {
            replacements: { userOut },
            type: QueryTypes.SELECT,
        });

        const response: ApiResponse<typeof data> = {
            success: true,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            data: data,
        };
        res.status(200).json(response);

    } catch (error) {
        console.error(error);
        const response: ApiResponse<null> = {
            success: false,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสต็อก',
        };
        res.status(500).json(response);
    }
}
