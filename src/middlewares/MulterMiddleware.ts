import { Request } from "express";
import multer, { FileFilterCallback, MulterError } from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: any, destination: string) => void) => {
        cb(null, './public/userimages');
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: any, filename: string) => void) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {

    const allowedExt: RegExp = /png|jpg|jpeg|pdf/;
    const allowedMimeTypes: string[] = ["image/jpeg", "image/jpg", "image/png", 'video/mp4', 'video/webm', 'video/avi','application/pdf'];
    const isFileExtAllowed: boolean = allowedExt.test(file.originalname.toLowerCase());
    const fileType: boolean = allowedMimeTypes.includes(file.mimetype);

    if (isFileExtAllowed && fileType) {
        cb(null, true);
    }
    else {
        cb(new MulterError("LIMIT_UNEXPECTED_FILE", "Only image (jpg, jpeg, png, gif) and video (mp4, webm, avi) formats are allowed!"));
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1000 * 1000,
    },
});