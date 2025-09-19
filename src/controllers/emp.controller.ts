import { Request, Response } from "express";
import { sequelize } from "../db";
import { ApiResponse, calculateDuration } from "../response/response";

export const getEmployee = async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {

    const [results] = await sequelize.query(
      `
    SELECT TOP (1000) [emp_id], [emp_name], [Sect]
    FROM [v_Get_Emp_Name]
    WHERE emp_id = ?
  `,
      {
        replacements: [req.params.emp_id],
      }
    );


    const response: ApiResponse<any> = {
      success: true,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      data: results,
    };

    res.status(200).json(response)
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