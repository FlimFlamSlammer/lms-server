import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import { createErrorWithMessage } from "./error";

const UPLOAD_PATH = path.resolve("uploads");

if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + "-" + nanoid());
    },
});

const upload = multer({ storage });

const uploadHandler: Handler = (req, res) => {
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

const getFileHandler: Handler = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(UPLOAD_PATH, filename);

    if (!fs.existsSync(filePath)) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: "File not found!",
        });
    }

    res.status(StatusCodes.OK).sendFile(filePath);
};
