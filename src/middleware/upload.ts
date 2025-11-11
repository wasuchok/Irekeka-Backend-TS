import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";

const buildFilename = (file: Express.Multer.File) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    return uniqueSuffix + path.extname(file.originalname);
};

const urgentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "\\\\10.17.2.3\\d$\\phpweb\\IREKEKA\\image_urgent");
    },
    filename: (req, file, cb) => {
        cb(null, buildFilename(file));
    },
});

const stockStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "\\\\10.17.2.3\\d$\\phpweb\\IREKEKA\\image_item");
    },
    filename: (req, file, cb) => {
        cb(null, buildFilename(file));
    },
});

export const upload = multer({ storage: urgentStorage }); // backward compatibility for urgent routes
export const stockUpload = multer({ storage: stockStorage });

const stockFields = [
    { name: "img_1", maxCount: 1 },
    { name: "img_2", maxCount: 1 },
] as const;

const stockFieldsMiddleware = stockUpload.fields(stockFields);

const isMultipartForm = (contentType?: string) =>
    !!contentType && contentType.toLowerCase().includes("multipart/form-data");

export const optionalStockUpload = (req: Request, res: Response, next: NextFunction) => {
    if (isMultipartForm(req.headers["content-type"])) {
        return stockFieldsMiddleware(req, res, next);
    }
    return next();
};

export const stockUploadFields = stockFieldsMiddleware;
