import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import session from "express-session";
import passport from 'passport';
import compression from 'compression';
import userRouter from './routes/users.mjs';
import lightTypeRouter from './routes/lightType.mjs';
import lightWattsRouter from './routes/light.mjs';
import finishingGoodsHistoryRouter from './routes/finishingGoodsHistory.mjs';
import PartsHistoryRouter from './routes/PartsHistory.mjs';
import cookieParser from 'cookie-parser'
import { isAuthenticated } from './middleware/auth.mjs';


const app = express();

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

// =============== MIDDLEWARE ===============
app.use(cors({
    origin: [
        'https://ming-led.onrender.com',
        'http://localhost:5173',
        'http://localhost:5000'
    ],
    credentials: true
}));

app.use(cookieParser("Musni"))
app.use(compression());
app.use(express.json());

app.use(session({
    name: 'sessionId',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI_CLOUD,
        collectionName: 'sessions',
        ttl: 100,
        crypto: { secret: process.env.SESSION_SECRET }
    }),
    cookie: {
        maxAge: 100 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));
app.use('/api', userRouter);
app.use('/api', lightTypeRouter);
app.use('/api', lightWattsRouter);
app.use('/api', finishingGoodsHistoryRouter);
app.use('/api', PartsHistoryRouter);

// =============== DATABASE CONNECTION ===============
await mongoose.connect(process.env.MONGO_URI_CLOUD)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log(`${err}`));

export default app;
