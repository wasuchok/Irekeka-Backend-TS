// http://10.17.2.3/IREKEKA/image_item/1743654596.jpg

import { Request, Response } from "express";
import { Stock } from "../models/Stock";
import { ApiResponse, calculateDuration } from "../response/response";

export const getStocks = async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const stocks = await Stock.findAll({
      where: {
        en: 1
      }
    });

    const response: ApiResponse<typeof stocks> = {
      success: true,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      data: stocks,
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

export const getStock = async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {

    const stock = await Stock.findOne({
      where: {
        equipment_code: req.params.code,
        en: 1,
      },
      order: [
        ['create_date', 'DESC'],
      ],
    });


    const response: ApiResponse<typeof stock> = {
      success: true,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      data: stock,
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