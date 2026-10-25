import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import session from 'express-session';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import userRouter from './routes/users.mjs';
import lightTypeRouter from './routes/lightType.mjs';
import lightWattsRouter from './routes/light.mjs';
import finishingGoodsHistoryRouter from './routes/finishingGoodsHistory.mjs';
import PartsHistoryRouter from './routes/PartsHistory.mjs';

const app = express();

// 🔑 CRITICAL for Render / Heroku / any proxy
app.set('trust proxy', 1);

// 1. Connect DB first
await mongoose.connect(process.env.MONGO_URI_CLOUD)
    .then(() => console.log('Database connected successfully'))
    .catch((err) => {
        console.error('DB connection error:', err);
        process.exit(1);
    });

// 2. CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://ming-led.onrender.com', 'https://ming-led.vercel.app']
        : ['http://localhost:5173'],
    credentials: true,
}));

// 3. Body parsers
app.use(express.json());
app.use(compression());
app.use(cookieParser());

// 4. Session (reuse Mongoose connection)
app.use(session({
    name: 'sessionId',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,

    store: MongoStore.create({
        client: mongoose.connection.getClient(),   // reuse Mongoose connection
        collectionName: 'sessions',
        ttl: 24 * 60 * 60,
        touchAfter: 24 * 3600,
    }),

    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
}));
// app.use(session({
//     name: 'sessionId',

//     secret: process.env.SESSION_SECRET,

//     resave: false,
//     saveUninitialized: false,
//     rolling: true,

//     store: MongoStore.create({
//         mongoUrl: process.env.MONGO_URI_CLOUD,
//         collectionName: 'sessions',
//         ttl: 24 * 60 * 60
//     }),

//     cookie: {
//         maxAge: 24 * 60 * 60 * 1000,
//         httpOnly: process.env.NODE_ENV === 'production',
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
//     }
// }));

// 5. Routes
app.use('/api', userRouter);
app.use('/api', lightTypeRouter);
app.use('/api', lightWattsRouter);
app.use('/api', finishingGoodsHistoryRouter);
app.use('/api', PartsHistoryRouter);

// 6. Listen
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});

export default app;