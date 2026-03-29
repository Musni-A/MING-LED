import { Router } from "express";
import express from "express"
import {body, matchedData, validationResult} from "express-validator";
import { User } from "../mongoose/schema/users.mjs";
import passport from 'passport'
import { Strategy as localStrategy } from 'passport-local';
import { comparePassword, hashPassword } from "../util/helper.mjs"


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


router.post('/register', userValidation, async(req, res)=>{
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

router.get('/login',(req, res, next)=>{
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

router.get('/users', async(req,res)=>{
    const users = await User.find();
    res.status(200).json(users)
})
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

    // const userId = req.params.id;
    // res.json({userId})
})

export default router;