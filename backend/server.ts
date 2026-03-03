import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.ts";
import { ObjectId } from "mongodb";
import multer from "multer";
import {uploadMiddleware, uploadPhoto} from "./upload.ts";

const PORT = Number(process.env.PORT) || 5000;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/upload", (req, res) => {
    uploadMiddleware(req, res, async (err: any) => {
        if (err) {
            if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({ message: "File too large. Max size is 5 MB." });
            }

            return res.status(400).json({ message: err.message ?? "Invalid upload" });
        }

        return uploadPhoto(req, res);
    });
});

app.get("/photos", async (_req, res) => {
    try {
        const db = await connectDB();

        const docs = await db.collection("photos").find({}).sort({ uploadDate: -1 }).toArray();

        const photos = docs.map((d: any) => ({
            _id: d._id.toString(),
            filename: d.filename,
            uploadDate: d.uploadDate,
            contentType: d.contentType ?? "image/jpeg",
            imageBase64: d.image?.toString("base64") ?? "",
        }));

        res.json(photos);
    } catch (err: any) {
        res.status(500).json({ message: err.message ?? "Failed to fetch photos" });
    }
});

app.delete("/photos/:id", async (req, res) => {
    try {
        const db = await connectDB();

        const result = await db
            .collection("photos")
            .deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Photo not found" });
        }

        return res.json({ message: "Photo deleted" });
    } catch (err: any) {
        return res.status(500).json({ message: err.message ?? "Delete failed" });
    }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

async function start() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});