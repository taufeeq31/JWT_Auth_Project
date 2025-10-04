import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import { connectDB } from './db/connectDB.js';

import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use('/api/auth', authRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    // Express 5 + path-to-regexp v8: avoid wildcard strings; instead use a terminal middleware.
    // Serve SPA index.html for any non-API GET route that wasn't matched above.
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            return res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
        }
        next();
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port: ', PORT);
});
