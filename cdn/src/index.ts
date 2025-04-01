import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
// --- Express Setup ---
const app = express();
const PORT = process.env.PORT || 4001;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const CDN_BASE_URL = process.env.CDN_BASE_URL || `http://localhost:${PORT}`;
// --- Cors Setup ---
const corsOptions = {
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// --- Storage setup with Multer ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-";
        cb(
            null,
            file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
        );
    },
});

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) => {
    // Accept only JSON and BPLIST files
    if (file.mimetype === 'application/json' || file.mimetype === 'application/bplist') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only BPLIST or JSON are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // upload limit of 1MB
    limits: { fileSize: 1024 * 1024 * 1 }
});


// static file serving for uploads
app.use("/uploads", express.static(UPLOAD_DIR));
console.log(
    `Serving static files from ${path.resolve(UPLOAD_DIR)} at /uploads`,
);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.post(
    "/upload/pool",
    upload.single("poolFile"),
    (req: Request, res: Response): void => {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded." });
            return;
        }
        const fileUrl = `${CDN_BASE_URL.replace(/\/$/, "")}/uploads/${req.file.filename}`;
        console.log(`File succesfully uploaded: ${req.file.filename}, URL: ${fileUrl}`);
        // Respond with the URL of the uploaded file
        res.status(201).json({
            message: "File uploaded successfully!",
            url: fileUrl,
            filename: req.file.filename,
        });
    },
);
// I have currently forgorten how to program so this doesn't work yet :)
/*
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Multer error: ${err.message}` });
    }
    res
        .status(500)
        .json({ message: "Something went wrong!", error: err.message });
});
*/

app.listen(PORT, () => {
    console.info(`CDN Server listening on ${CDN_BASE_URL}`);
    console.info(`Uploads will be stored in: ${path.resolve(UPLOAD_DIR)}`);
});
