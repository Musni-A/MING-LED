import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from "express-session";
import passport from 'passport';
import compression from 'compression';
import userRouter from './routes/users.mjs';
import lightTypeRouter from './routes/lightType.mjs';
import lightWattsRouter from './routes/light.mjs';
import finishingGoodsHistoryRouter from './routes/finishingGoodsHistory.mjs';
import PartsHistoryRouter from './routes/PartsHistory.mjs';


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

app.use(compression());
app.use(express.json());
app.use(session({
    secret: process.env.JWT_SECRET || "fallback_secret",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: (60000 * 60) * 24 }
}));

app.use(passport.initialize());
app.use(passport.session());

// =============== ROUTES ===============
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