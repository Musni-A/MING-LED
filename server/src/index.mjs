import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import session from "express-session";
import passport from 'passport';
import userRouter from './routes/users.mjs';
import lightTypeRouter from './routes/lightType.mjs'
import lightWatts from './routes/light.mjs'

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://ming-led.onrender.com' // ← add your network IP
    ]
}))
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 * 60 }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', userRouter);
app.use('/api', lightTypeRouter)
app.use('/api', lightWatts)



mongoose.connect(process.env.MONGO_URI_CLOUD)
    .then(() => console.log("Data base connect successfully"))
    .catch((err) => console.log(`Database error ${err}`))

// ✅ Must be PORT not MONGO_URI
app.listen(process.env.PORT || 5000, () => {
    console.log(`App running in port ${process.env.PORT || 5000}`)
})