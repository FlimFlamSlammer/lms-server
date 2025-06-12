import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(process.cwd(), "data"));
    },
    filename: (req, file, callback) => {
        const filename = `${nanoid()}-${file.originalname.replace(" ", "_")}`;
        callback(null, filename);
    },
});

const ALLOWED_EXTENTIONS = [
    ".png",
    ".pdf",
    ".docx",
    ".doc",
    ".xlsx",
    ".pptx",
    ".ppt",
    ".odt",
    ".odp",
    ".ods",
    ".txt",
    ".jpg",
    ".jpeg",
    ".webp",
];

export const uploadFile = multer({
    storage,
    limits: {
        // byte,
        // 1kb = approx 1000byte (real case its 1024byte)
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);

        if (ALLOWED_EXTENTIONS.every((e) => e !== ext)) {
            return callback(new Error("File is not supported!"));
        }

        callback(null, true);
    },
});
