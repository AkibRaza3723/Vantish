import dotenv from 'dotenv';
dotenv.config();

import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import { routes } from './routes/index.js';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Trust reverse proxy (Render / AWS / Cloudflare) so Express detects HTTPS
app.set('trust proxy', 1);

const rawAllowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.BETTER_AUTH_URL,
    'https://vantish.online',
    'https://www.vantish.online',
    'http://localhost:5173',
    'http://localhost:3000',
].filter(Boolean) as string[];

const allowedOrigins = rawAllowedOrigins.map(url => url.replace(/\/$/, ''));

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, '');
        if (
            allowedOrigins.includes(cleanOrigin) ||
            cleanOrigin.endsWith('.vercel.app') ||
            cleanOrigin.includes('localhost') ||
            cleanOrigin.includes('127.0.0.1')
        ) {
            callback(null, true);
        } else {
            callback(null, true); // Allow any requesting origin while returning exact Origin header for credentials
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    exposedHeaders: ['Set-Cookie'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);


app.all('/api/auth/*splat', toNodeHandler(auth));

app.get('/health', (req: Request, res: Response) => {
    res.send('OK');
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});