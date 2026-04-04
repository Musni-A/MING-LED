import express from 'express';
import { Router } from 'express';
import { Parts } from '../mongoose/schema/parts.mjs';
import {body, matchedData, validationResult} from "express-validator";


const app = express();
const router = Router();

const partsValidation = [
    body('watts').notEmpty(),
    body('tempColor').notEmpty(),
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

router.delete('/parts/:id', async (req, res)=>{
    try{
        const id = req.params.id
        const deletedLedParts = await Parts.findByIdAndDelete(id)
        res.json({deletedLedParts})
    }
    catch(err){
        res.json({Error : err})
    }
})

router.patch('/parts', async (req, res)=>{
    try{
        const {body} = req;

        const bulbSheet = parseInt(body.bulbSheet) || 0;
        const driver = parseInt(body.driver) || 0;
        const lampCup = parseInt(body.lampCup) || 0;
        const bottomCup = parseInt(body.bottomCup) || 0;
        const colorBox = parseInt(body.colorBox) || 0;
        const cottonBox = parseInt(body.cottonBox) || 0;

        const foundPart = await Parts.find({watts : body.watts, tempColor: body.tempColor });

        const updatedbulbSheetCount = parseInt(foundPart[0].bulbSheet) - bulbSheet;
        const updateddriverCount = parseInt(foundPart[0].driver) - driver;
        const updatedlampCupCount = parseInt(foundPart[0].lampCup) - lampCup;
        const updatedbottomCupCount = parseInt(foundPart[0].bottomCup) - bottomCup;
        const updatedcolorBoxCount = parseInt(foundPart[0].colorBox) - colorBox;
        const updatedcottonBoxCount = parseInt(foundPart[0].cottonBox) - cottonBox;

        const updatedParts = await Parts.findOneAndUpdate(
            {watts : body.watts, tempColor: body.tempColor },
            {
                bulbSheet : updatedbulbSheetCount,
                driver : updateddriverCount,
                lampCup : updatedlampCupCount,
                bottomCup : updatedbottomCupCount,
                colorBox : updatedcolorBoxCount,
                cottonBox : updatedcottonBoxCount
            },
            { returnDocument: 'after' }
        )
        res.json({updatedParts})
    }
    catch(err){
        res.status(400).json(err)
    }
});
export default router;