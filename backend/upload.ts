import multer from "multer";
import type { Request, Response } from "express";
import { connectDB } from "./db.ts";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const okMime = file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg";
        const okExt = /\.(jpe?g|png)$/i.test(file.originalname);

        if (!okMime || !okExt) {
            return cb(new Error("Only JPG, JPEG, or PNG files are allowed."));
        }
        cb(null, true);
    },
});

export const uploadMiddleware = upload.single("photo");

export async function uploadPhoto(req: Request, res: Response) {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const db = await connectDB();

        const doc = {
            image: req.file.buffer,
            filename: req.file.originalname,
            uploadDate: new Date(),
            contentType: req.file.mimetype,
        };

        const result = await db.collection("photos").insertOne(doc);

        return res.status(201).json({ message: "Uploaded", id: result.insertedId });
    } catch (err: any) {
        return res.status(500).json({ message: err.message ?? "Upload failed" });
    }
}