import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import session from 'express-session';
import compression from 'compression';
import userRouter from './routes/users.mjs';
import lightTypeRouter from './routes/lightType.mjs';
import lightWattsRouter from './routes/light.mjs';
import finishingGoodsHistoryRouter from './routes/finishingGoodsHistory.mjs';
import PartsHistoryRouter from './routes/PartsHistory.mjs';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://ming-led.onrender.com'
        : 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(compression());
app.use(express.json());
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("SESSION_SECRET exists:", !!process.env.SESSION_SECRET);
app.use(session({
    name: 'sessionId',

    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,
    rolling: true,

    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI_CLOUD,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60
    }),

    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

app.use('/api', userRouter);
app.use('/api', lightTypeRouter);
app.use('/api', lightWattsRouter);
app.use('/api', finishingGoodsHistoryRouter);
app.use('/api', PartsHistoryRouter);

await mongoose.connect(process.env.MONGO_URI_CLOUD)
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.log(err));

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

export default app;