import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users.mjs';
import cors from 'cors'
import session from "express-session";
import passport from 'passport';
const app = express();

const PORT = 5000;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://192.168.1.4:5173'  // ← add your network IP
    ]
}))
app.use(express.json());
app.use(session({
    secret : "I'm in ramadan",
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : 60000 * 60
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', userRouter);


mongoose.connect('mongodb://localhost/mingledmanagmentDB')
.then(()=>{
    console.log("Data base connect successfully")
    app.listen(PORT, (err)=>{
        console.log(`App running in port ${PORT}`)
    })
}).catch((err) => {
    console.log(`Database error ${err}`)
})