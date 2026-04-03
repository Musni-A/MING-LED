import express from 'express';
import { Router } from 'express';
import { Parts } from '../mongoose/schema/parts.mjs';
import {body, matchedData, validationResult} from "express-validator";


const app = express();
const router = Router();

const partsValidation = [
    body('watts').notEmpty(),
    body('bulbSheet').notEmpty(),
    body('driver').notEmpty(),
    body('lampCup').notEmpty(),
    body('bottomCup').notEmpty(),
    body('colorBox').notEmpty(),
    body('cottonBox').notEmpty()
]

router.post('ledParts', (req, res)=>{
    res.send('Musni')
})

router.post('/test',(req, res)=>{
    const testData = req.body;
    res.json({msg : "success", testData})
})

router.post('/parts', partsValidation, async(req, res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({Error : error.array()})
    }
    try{
        const body = matchedData(req);
        const parts = new Parts(body);
        const saveParts = await parts.save();
        res.json({msg : "success", saveParts});
    }
    catch(err){
        res.status(500).json({Message : 'Server error', error : err.message})
    }
})

router.get('/parts', async(req, res)=>{
    try{
        const getPart = await Parts.find()
        res.status(200).json(getPart)
    }
    catch(err){
        res.json({Error : err})
    }
})
export default router;