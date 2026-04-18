import { Router } from "express";
import express from "express"
import {body, matchedData, validationResult} from "express-validator";
import { User } from "../mongoose/schema/users.mjs";
import passport from 'passport'
import { Strategy as localStrategy } from 'passport-local';
import { comparePassword, hashPassword } from "../util/helper.mjs"
import uploadParser, { uploadToCloudinary } from "../config/cloudinary.mjs";
import fs from 'fs';
import path from 'path';

const app = express();
const router = Router();

const userValidation = [
    body('name').notEmpty().withMessage('Pls type your name'),
    body('username').notEmpty().withMessage("Cannot register with username empty"),
    body('age').isInt({min : 16}).withMessage('Invalid age'),
    body('address').notEmpty().withMessage('Invalid address'),
    body('phoneNumber').notEmpty().withMessage('Invalid Phone Number'),
    body('password').notEmpty().withMessage('Invalid password'),
    body('department').notEmpty().withMessage('Invalid department'),
    body('jobRole').default("Not yet assign job role"),
    body('imageUrl').optional().isString(),
]

passport.use(new localStrategy(
    {usernameField:"username", passwordField:"password"},
    async (username, password, done)=>{
        try{
            const user = await User.findOne({username : username})
            if( !user ){
                return done(null, false, {message : "Invalid user name or password"})
            };
            if( !(comparePassword(password, user.password)) ){
                return done(null, false, {message : "Invalid user name or password"})
            };
            return done( null, user );
        }
        catch(err){
            return done(err, false)
        }
    
}))

passport.serializeUser((user, done)=>{
    done(null, user.id);
})
passport.deserializeUser(async(id, done)=>{
    try{
        const user = await User.findById(id);
        done(null, user);
    }catch(err){
        return done(err, false)
    }
})

// Updated upload endpoint
router.post('/upload', uploadParser.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.path);
        
        // Delete temp file
        fs.unlinkSync(req.file.path);
        
        res.status(200).json({
            message: 'File uploaded successfully!',
            imageUrl: result.secure_url
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error during upload.' });
    }
});

router.post('/register', userValidation, async(req, res)=>{
    console.log("Received registration data:", req.body);
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({Error : error.array()})
    }
    try{
        const body = matchedData(req);
        body.password = hashPassword(body.password);
        const user = new User(body);
        const savedUser = await user.save();
        res.status(200).json(savedUser)
    }
    catch(err){
        res.status(500).json({Message : 'Server error', error : err.message})
    }
});

router.post('/login',(req, res, next)=>{
    passport.authenticate('local', (err, user, info)=>{
        let loggedIn;
        if(err) return next(err);
        if(!user){
            return res.status(401).json({Message : info?.message || "Login failed"})
        }
        req.logIn(user, (err)=>{
            if(err) return next(err);
            return res.json({message : "Login successful",user, loggedIn : true});
        });
    })(req, res, next);
})

router.get('/users', async(req, res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users)
    }
    catch(err){
        res.json({Error : err})
    }
})

router.get('/users/:id', async(req, res)=>{
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user){
            return res.json({msg : "User not found" })
        }
        res.status(200).json(user);
    }
    catch(err){
        res.json({Error : err})
    }
})

router.patch('/users/:id', async(req, res)=>{
    try{
        const userId = req.params.id;
        const updates = req.body;
        const user = await User.findById(userId);
        if(!user){
            return res.json({msg : "User not found" })
        }
        if(updates.upType === 'updatePassword'){
            const compareResult = comparePassword(updates.data.currentPassword, user.password);
            console.log(compareResult)
            if (!compareResult) {
                return res.json({ msg: "Current password is incorrect" });
            }
            const hashedPassword = hashPassword(updates.data.newPassword);
            const updateUser = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { returnDocument : 'after' });
            return res.status(200).json(updateUser);
        }
        if(updates.upType === 'updateDetails'){
            const user = await User.findByIdAndUpdate(userId, updates.data, { returnDocument : 'after' });
            return res.status(200).json(user);
        }
    }
    catch(err){
        res.json({Error : err})
    }
});


router.delete('/users/:id', async(req ,res)=>{
    try{
        const userId = req.params.id;
        const deleteUser = await User.findByIdAndDelete(userId)
        if(!deleteUser){
            return res.json({msg : "User not found" })
        }
        return res.json({msg : "Deleted successfully", deleteUser })
    }
    catch(err){
        res.json({msg : err})
    }
})

export default router;