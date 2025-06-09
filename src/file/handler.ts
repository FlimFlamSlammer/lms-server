import path from "path";
import fs from "fs";
import { createErrorWithMessage } from "~/error";
import { StatusCodes } from "http-status-codes";
import { Handler } from "express";
import { z } from "zod";
import { withValidation } from "~/validation";

const UPLOAD_PATH = path.resolve("data");

export const uploadHandler: Handler = (req, res) => {
    console.log(req.body);

    if (!req.file) {
        throw createErrorWithMessage(
            StatusCodes.BAD_REQUEST,
            "No file was uploaded."
        );
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: {
            filename: req.file.filename,
        },
    });
};

const getFileHandlerParamsSchema = z.object({
    fileName: z.string({ required_error: "File name is required." }),
});

export const getFileHandler = withValidation(
    {
        paramsSchema: getFileHandlerParamsSchema,
    },
    (req, res) => {
        const { fileName } = req.params;
        const filePath = path.join(UPLOAD_PATH, fileName);

        if (!fs.existsSync(filePath)) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: "File not found!",
            });
            return;
        }

        res.status(StatusCodes.OK).sendFile(filePath);
    }
);

export const fileExists = (fileName: string): boolean => {
    const filePath = path.join(UPLOAD_PATH, fileName);
    return fs.existsSync(filePath);
};
