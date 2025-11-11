// http://10.17.2.3/IREKEKA/image_item/1743654596.jpg

import { Request, Response } from "express";
import { Op } from "sequelize";
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

export const getStocksPagination = async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    // 📦 ดึง query params
    const {
      page = 1,
      limit = 10,
      status,
      en,
      equipment_code,
      equipment_name,
      type,
    } = req.query as Record<string, string>;

    const offset = (Number(page) - 1) * Number(limit);

    // 🧠 เงื่อนไขค้นหาแบบ dynamic
    const whereClause: any = {};

    if (status) whereClause.status = status;
    if (en) whereClause.en = en;
    if (equipment_code)
      whereClause.equipment_code = { [Op.like]: `%${equipment_code}%` };
    if (equipment_name)
      whereClause.equipment_name = { [Op.like]: `%${equipment_name}%` };
    if (type) whereClause.type = { [Op.like]: `%${type}%` };

    // 🧾 ดึงข้อมูลพร้อมนับจำนวนทั้งหมด
    const { rows, count } = await Stock.findAndCountAll({
      where: whereClause,
      offset,
      limit: Number(limit),
      order: [["seq", "DESC"]],
    });

    const totalPages = Math.ceil(count / Number(limit));

    const response: ApiResponse<typeof rows> = {
      success: true,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      data: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: Number(page),
        pageSize: Number(limit),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);

    const response: ApiResponse<null> = {
      success: false,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      error: "เกิดข้อผิดพลาดในการดึงข้อมูลสต็อก",
    };

    res.status(500).json(response);
  }
};

export const updateStock = async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const { code } = req.params;
    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | Express.Multer.File[]
      | undefined;

    const allowedFields = [
      "equipment_code",
      "equipment_name",
      "type",
      "code_type",
      "code_date",
      "code_run",
      "img_1",
      "img_2",
      "status",
      "en",
      "detail",
      "create_date",
    ];

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const fileMap: Record<string, Express.Multer.File | undefined> = {};

    if (Array.isArray(files)) {
      // Multer .array fallback (shouldn't happen but keeps compatibility)
      fileMap.img_1 = files[0];
    } else if (files) {
      fileMap.img_1 = files["img_1"]?.[0];
      fileMap.img_2 = files["img_2"]?.[0];
    } else if (req.file) {
      // Multer .single fallback
      fileMap.img_1 = req.file;
    }

    if (fileMap.img_1) {
      updates.img_1 = `image_item/${fileMap.img_1.filename}`;
    }

    if (fileMap.img_2) {
      updates.img_2 = `image_item/${fileMap.img_2.filename}`;
    }

    if (!Object.keys(updates).length) {
      const response: ApiResponse<null> = {
        success: false,
        duration: calculateDuration(startTime),
        timestamp: new Date().toISOString(),
        error: "กรุณาระบุข้อมูลที่ต้องการแก้ไข",
      };

      return res.status(400).json(response);
    }

    const [updatedCount] = await Stock.update(updates, {
      where: { equipment_code: code },
    });

    if (!updatedCount) {
      const response: ApiResponse<null> = {
        success: false,
        duration: calculateDuration(startTime),
        timestamp: new Date().toISOString(),
        error: "ไม่พบสต็อกที่ต้องการแก้ไข",
      };

      return res.status(404).json(response);
    }

    const lookupCode =
      typeof updates.equipment_code === "string"
        ? (updates.equipment_code as string)
        : code;

    const updatedStock = await Stock.findOne({
      where: { equipment_code: lookupCode },
    });

    const response: ApiResponse<typeof updatedStock> = {
      success: true,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      data: updatedStock,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);

    const response: ApiResponse<null> = {
      success: false,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูลสต็อก",
    };

    res.status(500).json(response);
  }
};
