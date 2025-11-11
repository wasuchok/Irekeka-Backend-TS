import { Request, Response } from "express";
import { Version } from "../models/Version";
import { ApiResponse, calculateDuration } from "../response/response";

export const getVersion = async (req: Request, res: Response) => {
    const startTime = Date.now();
    try {
        const version = await Version.findOne({ where: { sys_Name: req.params.name } });
        const response: ApiResponse<typeof version> = {
            success: true,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            data: version,
        };

        res.status(200).json(response)
    } catch (error) {
        console.error(error);

        const response: ApiResponse<null> = {
            success: false,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            error: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        };

        res.status(500).json(response);
    }
}

export const updateVersionAndInsertVersion = async (req: Request, res: Response) => {
    const startTime = Date.now();
    try {
        const { name, version, url } = req.body;


        const existing = await Version.findOne({ where: { sys_Name: name } });

        let result;
        if (existing) {

            result = await existing.update({
                sys_Version: version,
                sys_Url: url
            }, {
                where: {
                    sys_Name: name
                }
            });
        } else {

            result = await Version.create({
                sys_Name: name,
                sys_Version: version,
                sys_Url: url
            });
        }

        const response: ApiResponse<typeof result> = {
            success: true,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            data: result
        };

        res.json(response);

    } catch (error) {
        console.error(error);

        const response: ApiResponse<null> = {
            success: false,
            duration: calculateDuration(startTime),
            timestamp: new Date().toISOString(),
            error: 'เกิดข้อผิดพลาดในข้อมูล',
        };

        res.status(500).json(response);
    }
};