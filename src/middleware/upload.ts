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
