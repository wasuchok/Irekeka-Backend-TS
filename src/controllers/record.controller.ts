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

export const getBorrowedEquipments = async (req: Request, res: Response) => {
    const startTime = Date.now();

    try {
        // 🔹 รับค่า query params
        const {
            page = 1,
            limit = 10,
            status,
            equipment_name,
            user_out_name,
            user_in_name,
        } = req.query as Record<string, string>;

        const offset = (Number(page) - 1) * Number(limit);

        // 🔹 สร้าง WHERE เงื่อนไข Dynamic
        const conditions: string[] = [];

        if (status) conditions.push(`CASE WHEN r.date_in IS NULL THEN 'Not Returned' ELSE 'Returned' END = '${status}'`);
        if (equipment_name) conditions.push(`s.equipment_name LIKE N'%${equipment_name}%'`);
        if (user_out_name) conditions.push(`u_out.emp_name LIKE N'%${user_out_name}%'`);
        if (user_in_name) conditions.push(`u_in.emp_name LIKE N'%${user_in_name}%'`);

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        // 🔹 ดึงจำนวนรวมทั้งหมด
        const countQuery = `
      SELECT COUNT(*) AS total
      FROM tb_Irekeka_Record AS r
      INNER JOIN tb_Irekeka_Stock AS s ON r.code = s.equipment_code
      LEFT JOIN [ITDB].[dbo].[v_Get_Emp_Name] AS u_out ON r.user_out = u_out.emp_id
      LEFT JOIN [ITDB].[dbo].[v_Get_Emp_Name] AS u_in ON r.user_in = u_in.emp_id
      ${whereClause};
    `;

        const countResult = await sequelize.query(countQuery, { type: QueryTypes.SELECT });
        const totalItems = (countResult[0] as any).total;
        const totalPages = Math.ceil(totalItems / Number(limit));

        // 🔹 Query หลัก (มี Pagination)
        const mainQuery = `
      SELECT
          r.seq AS record_seq,
          s.equipment_name AS name,
          CONVERT(VARCHAR(10), r.date_out, 120) AS date_out,
          CASE
              WHEN r.date_in IS NULL THEN '-'
              ELSE CONVERT(VARCHAR(10), r.date_in, 120)
          END AS date_in,
          u_out.emp_name AS user_out_name,
          u_in.emp_name AS user_in_name,
          CASE
              WHEN r.date_in IS NULL THEN 'Not Returned'
              ELSE 'Returned'
          END AS status,
          DATEDIFF(DAY, r.date_out, ISNULL(r.date_in, GETDATE())) AS borrow_days,
          CASE
              WHEN r.date_in IS NULL THEN DATEDIFF(
                  DAY,
                  GETDATE(),
                  DATEADD(DAY, ISNULL(r.num_date, 60), r.date_out)
              )
              ELSE NULL
          END AS remaining_days,
          DATEADD(DAY, ISNULL(r.num_date, 60), r.date_out) AS due_date,
          s.img_1,
          s.img_2,
          s.status AS stock_status
      FROM tb_Irekeka_Record AS r
      INNER JOIN tb_Irekeka_Stock AS s ON r.code = s.equipment_code
      LEFT JOIN [ITDB].[dbo].[v_Get_Emp_Name] AS u_out ON r.user_out = u_out.emp_id
      LEFT JOIN [ITDB].[dbo].[v_Get_Emp_Name] AS u_in ON r.user_in = u_in.emp_id
      ${whereClause}
      ORDER BY
          CASE WHEN r.date_in IS NULL THEN 0 ELSE 1 END,
          DATEADD(DAY, ISNULL(r.num_date, 60), r.date_out),
          r.seq DESC
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY;
    `;

        const result = await sequelize.query(mainQuery, { type: QueryTypes.SELECT });

        const response: ApiResponse<typeof result> = {
            success: true,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            data: result,
            pagination: {
                totalItems,
                totalPages,
                currentPage: Number(page),
                pageSize: Number(limit),
            },
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("getBorrowedEquipments error:", error);

        const response: ApiResponse<null> = {
            success: false,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            error: "เกิดข้อผิดพลาดในการเรียกข้อมูล",
        };

        res.status(500).json(response);
    }
};
