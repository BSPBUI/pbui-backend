import express, { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../../public/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

const router: Router = express.Router();

router.post('/', upload.single('file'), (req, res): void => {
    if (!req.file) {
        res.status(400).send({ status: 'error', error: 'No file uploaded' });
        return;
    }

    const fileUrl = `/cdn/uploads/${req.file.filename}`;
    res.status(200).send({ status: 'success', message: 'File uploaded', url: fileUrl });
});

export default router;