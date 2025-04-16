import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import { setupSocketIO } from './socket/index';
import dotenv from 'dotenv';
dotenv.config();

const DOCS_TOKEN = '1234567890';

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    path: '/ws',
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.json());

// Dynamically load routes from '/api' folder
const apiDir = path.join(__dirname, 'api');
fs.readdirSync(apiDir).forEach(file => {
    if (file.endsWith('.ts')) {
        const routeName = '/' + file.replace(/\.ts$/, '');
        const routeModule = require(path.join(apiDir, file));
        const router = routeModule.default;

        if (router) {
            app.use(`/api${routeName}`, router);
            console.log(`[Express] Loaded route: /api${routeName}`);
        } else {
            console.warn(`[Express] No default export in ${file}`);
        }
    }
});
// This is all the CDN handling we need
app.use('/cdn', express.static(path.join(__dirname, '../public')));

// API docs page
function protectDocs(req: Request, res: Response, next: NextFunction) {
    const env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : '';

    if (['development', 'dev'].includes(env)) {
        next();
        return;
    }
    
    if (['production', 'prod'].includes(env)) {
        const token = req.query.token || req.headers['x-docs-token'];

        if (token === DOCS_TOKEN) {
            next();
            return;
        } else {
            res.status(401).send('Unauthorised: Invalid token to access documentation.');
            return;
        }
    }

    res.status(403).send(`Forbidden: Unknown environment configuration. ${env}`);
    return;
}

const swaggerUiDist = require('swagger-ui-dist');
const swaggerUiDocs = require('./docs/swagger.json');
const swaggerUiAssetPath = swaggerUiDist.getAbsoluteFSPath();

app.get('/docs', protectDocs, (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'docs.html'));
});

app.use('/docs', express.static(swaggerUiAssetPath));

app.use('/docs/swagger.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'swagger.json'));
})
// API Docs logic above this line

setupSocketIO(io);

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});