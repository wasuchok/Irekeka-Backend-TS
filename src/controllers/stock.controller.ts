// http://10.17.2.3/IREKEKA/image_item/1743654596.jpg

import { Request, Response } from "express";
import { Op, QueryTypes, Transaction } from "sequelize";
import { sequelize } from "../db";
import { Stock } from "../models/Stock";
import { ApiResponse, calculateDuration } from "../response/response";

const STOCK_IMAGE_DIR = "image_item";

const buildImagePath = (file?: Express.Multer.File) =>
  file ? `${STOCK_IMAGE_DIR}/${file.filename}` : undefined;

const formatDateToSQL = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const toDbDateLiteral = (date: Date) =>
  sequelize.literal(`CONVERT(datetime,'${formatDateToSQL(date)}',120)`);

const extractStockImageFiles = (req: Request) => {
  const files = req.files as
    | Record<string, Express.Multer.File[]>
    | Express.Multer.File[]
    | undefined;

  if (Array.isArray(files)) {
    return {
      img_1: files[0],
      img_2: files[1],
    };
  }

  return {
    img_1: files?.["img_1"]?.[0] ?? (req.file as Express.Multer.File | undefined),
    img_2: files?.["img_2"]?.[0],
  };
};

const resolveCodeDate = (codeDate?: string, createDate?: string | Date) => {
  if (codeDate && /^\d{6}$/.test(codeDate)) {
    return codeDate;
  }

  const baseDate =
    createDate instanceof Date
      ? createDate
      : createDate
        ? new Date(createDate)
        : new Date();

  const isValid = !Number.isNaN(baseDate.getTime());
  const target = isValid ? baseDate : new Date();

  return `${target.getFullYear()}${String(target.getMonth() + 1).padStart(2, "0")}`;
};

const padRunForCode = (value: number) => String(value).padStart(3, "0");

const generateEquipmentMeta = async (
  codeType: string,
  codeDate: string,
  t: Transaction
) => {
  const [result]: Array<{ maxRun: number }> = await sequelize.query(
    `SELECT ISNULL(MAX(CAST(code_run AS INT)), 0) AS maxRun
     FROM tb_Irekeka_Stock
     WHERE code_type = :codeType AND code_date = :codeDate`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
      replacements: { codeType, codeDate },
    }
  );

  const lastRun = Number(result?.maxRun ?? 0);
  const nextRun = lastRun + 1;

  return {
    equipmentCode: `${codeType}-${codeDate}-${padRunForCode(nextRun)}`,
    codeRun: String(nextRun),
  };
};

const TYPE_CODE_MAP: Record<string, string> = {
  accessory: "ASR",
  computer: "COM",
  "phone/camera": "PCM",
  equipment: "EQM",
  audio: "ADO",
  other: "OH",
};

const rollbackIfNeeded = async (transaction: Transaction) => {
  const tx = transaction as Transaction & { finished?: "commit" | "rollback" };
  if (tx.finished) return;

  try {
    await transaction.rollback();
  } catch (rollbackError) {
    console.error("Rollback failed:", rollbackError);
  }
};

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


    const whereClause: any = {};

    if (status) whereClause.status = status;
    if (en) whereClause.en = en;
    if (equipment_code)
      whereClause.equipment_code = { [Op.like]: `%${equipment_code}%` };
    if (equipment_name)
      whereClause.equipment_name = { [Op.like]: `%${equipment_name}%` };
    if (type) whereClause.type = { [Op.like]: `%${type}%` };


    const { rows, count } = await Stock.findAndCountAll({
      where: whereClause,
      offset,
      limit: Number(limit),
      order: [["seq", "ASC"]],
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

export const createStock = async (req: Request, res: Response) => {
  const startTime = Date.now();

  const { equipment_name, type, status = "in-stock", en = 1, detail = "" } =
    req.body;

  if (!equipment_name || !type) {
    const response: ApiResponse<null> = {
      success: false,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      error: "กรุณาระบุข้อมูล equipment_name และ type",
    };

    return res.status(400).json(response);
  }

  const normalizedTypeValue = String(type).trim();
  const typeKey = normalizedTypeValue.toLowerCase();
  const normalizedCodeType = TYPE_CODE_MAP[typeKey];

  if (!normalizedCodeType) {
    const response: ApiResponse<null> = {
      success: false,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      error: "ไม่พบ CODE TYPE ที่สอดคล้องกับประเภทอุปกรณ์",
    };

    return res.status(400).json(response);
  }

  const createDateValue = new Date();
  const resolvedCodeDate = resolveCodeDate(undefined, createDateValue);
  const enValue = Number.isNaN(Number(en)) ? 1 : Number(en);

  const transaction = await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });

  try {
    const { equipmentCode, codeRun } = await generateEquipmentMeta(
      normalizedCodeType,
      resolvedCodeDate,
      transaction
    );

    const payload: Record<string, unknown> = {
      equipment_code: equipmentCode,
      equipment_name,
      type: normalizedTypeValue,
      code_type: normalizedCodeType,
      code_date: resolvedCodeDate,
      code_run: codeRun,
      status,
      en: enValue,
      detail,
      create_date: toDbDateLiteral(createDateValue),
    };

    const { img_1, img_2 } = extractStockImageFiles(req);
    const img1Path = buildImagePath(img_1);
    const img2Path = buildImagePath(img_2);

    if (img1Path) payload.img_1 = img1Path;
    if (img2Path) payload.img_2 = img2Path;

    const newStock = await Stock.create(payload, { transaction });

    await transaction.commit();

    const response: ApiResponse<typeof newStock> = {
      success: true,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      data: newStock,
    };

    res.status(201).json(response);
  } catch (error) {
    await rollbackIfNeeded(transaction);
    console.error(error);

    const response: ApiResponse<null> = {
      success: false,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      error: "เกิดข้อผิดพลาดในการบันทึกข้อมูลสต็อก",
    };

    res.status(500).json(response);
  }
};

export const updateStock = async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const { code } = req.params;

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

    let invalidDate = false;

    for (const field of allowedFields) {
      if (req.body[field] === undefined) continue;

      if (field === "create_date") {
        if (!req.body[field]) {
          updates.create_date = null;
          continue;
        }

        const parsedDate = new Date(req.body[field]);

        if (Number.isNaN(parsedDate.getTime())) {
          invalidDate = true;
          break;
        }

        updates.create_date = toDbDateLiteral(parsedDate);
        continue;
      }

      updates[field] = req.body[field];
    }

    if (invalidDate) {
      const response: ApiResponse<null> = {
        success: false,
        duration: calculateDuration(startTime),
        timestamp: new Date().toISOString(),
        error: "รูปแบบวันที่ไม่ถูกต้อง",
      };

      return res.status(400).json(response);
    }

    const { img_1, img_2 } = extractStockImageFiles(req);

    if (img_1) {
      updates.img_1 = buildImagePath(img_1);
    }

    if (img_2) {
      updates.img_2 = buildImagePath(img_2);
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

export const updateStockStatus = async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const { code } = req.params;
    const { status, en } = req.body;

    if (!code) {
      const response: ApiResponse<null> = {
        success: false,
        duration: calculateDuration(startTime),
        timestamp: new Date().toISOString(),
        error: "กรุณาระบุรหัสอุปกรณ์",
      };
      return res.status(400).json(response);
    }

    if (status === undefined && en === undefined) {
      const response: ApiResponse<null> = {
        success: false,
        duration: calculateDuration(startTime),
        timestamp: new Date().toISOString(),
        error: "กรุณาระบุสถานะหรือค่า en ที่ต้องการปรับปรุง",
      };
      return res.status(400).json(response);
    }

    const updates: Record<string, unknown> = {};

    if (status !== undefined) {
      updates.status = status;
    }

    if (en !== undefined) {
      const parsedEn = Number(en);

      if (Number.isNaN(parsedEn)) {
        const response: ApiResponse<null> = {
          success: false,
          duration: calculateDuration(startTime),
          timestamp: new Date().toISOString(),
          error: "ค่า en ต้องเป็นตัวเลข",
        };
        return res.status(400).json(response);
      }

      updates.en = parsedEn;
    }

    const [updatedCount] = await Stock.update(updates, {
      where: { equipment_code: code },
    });

    if (!updatedCount) {
      const response: ApiResponse<null> = {
        success: false,
        duration: calculateDuration(startTime),
        timestamp: new Date().toISOString(),
        error: "ไม่พบข้อมูลสต็อกที่ต้องการปรับปรุง",
      };
      return res.status(404).json(response);
    }

    const latest = await Stock.findOne({
      where: { equipment_code: code },
    });

    const response: ApiResponse<typeof latest> = {
      success: true,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      message: "ปรับปรุงสถานะสต็อกเรียบร้อยแล้ว",
      data: latest,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);

    const response: ApiResponse<null> = {
      success: false,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      error: "เกิดข้อผิดพลาดในการปรับปรุงสถานะสต็อก",
    };

    res.status(500).json(response);
  }
};

export const deleteStock = async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const { code } = req.params;

    if (!code) {
      const response: ApiResponse<null> = {
        success: false,
        duration: calculateDuration(startTime),
        timestamp: new Date().toISOString(),
        error: "กรุณาระบุรหัสอุปกรณ์ที่ต้องการลบ",
      };

      return res.status(400).json(response);
    }

    const deletedCount = await Stock.destroy({
      where: { equipment_code: code },
    });

    if (!deletedCount) {
      const response: ApiResponse<null> = {
        success: false,
        duration: calculateDuration(startTime),
        timestamp: new Date().toISOString(),
        error: "ไม่พบข้อมูลสต็อกที่ต้องการลบ",
      };

      return res.status(404).json(response);
    }

    const response: ApiResponse<null> = {
      success: true,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      message: "ลบข้อมูลสต็อกเรียบร้อยแล้ว",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);

    const response: ApiResponse<null> = {
      success: false,
      duration: calculateDuration(startTime),
      timestamp: new Date().toISOString(),
      error: "เกิดข้อผิดพลาดในการลบข้อมูลสต็อก",
    };

    res.status(500).json(response);
  }
};
