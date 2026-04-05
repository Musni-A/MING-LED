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

router.patch('/parts', async (req, res) => {
    try {
        const { body } = req;
        if (!body.data.watts || !body.data.tempColor) {
            return res.status(400).json({ 
                error: 'Insufficient stock',
                message: 'Required fields missing',
                fieldMissing : true
            });
        }
        
        // Parse quantities
        const bulbSheet = parseInt(body.data.bulbSheet) || 0;
        const driver = parseInt(body.data.driver) || 0;
        const lampCup = parseInt(body.data.lampCup) || 0;
        const bottomCup = parseInt(body.data.bottomCup) || 0;
        const colorBox = parseInt(body.data.colorBox) || 0;
        const cottonBox = parseInt(body.data.cottonBox) || 0;

        if(bulbSheet == 0 && driver == 0 && lampCup == 0 && bottomCup == 0 && colorBox == 0 && cottonBox == 0){
            return res.status(400).json({ 
                error: 'Insufficient stock',
                message: 'Required fields missing',
                fieldMissing : true
            });
        }
        
        // Find the part - use findOne instead of find
        const foundPart = await Parts.findOne({ 
            watts: body.data.watts, 
            tempColor: body.data.tempColor 
        });
        
        // Declare variables outside if blocks
        let updatedbulbSheetCount, updateddriverCount, updatedlampCupCount;
        let updatedbottomCupCount, updatedcolorBoxCount, updatedcottonBoxCount;
        
        // Calculate based on arithType
        if (body.arithType === 'add') {
            updatedbulbSheetCount = parseInt(foundPart.bulbSheet) + bulbSheet;
            updateddriverCount = parseInt(foundPart.driver) + driver;
            updatedlampCupCount = parseInt(foundPart.lampCup) + lampCup;
            updatedbottomCupCount = parseInt(foundPart.bottomCup) + bottomCup;
            updatedcolorBoxCount = parseInt(foundPart.colorBox) + colorBox;
            updatedcottonBoxCount = parseInt(foundPart.cottonBox) + cottonBox;
        } 
        else if (body.arithType === 'reduce') {
            // Check for negative values before reducing
            if (bulbSheet < 0 ||
                driver < 0 ||
                lampCup < 0) {
                return res.status(400).json({ 
                    error: 'Insufficient stock',
                    message: 'Cannot reduce below zero',
                    negativeNumber : true
                });
            }
            
            updatedbulbSheetCount = parseInt(foundPart.bulbSheet) - bulbSheet;
            updateddriverCount = parseInt(foundPart.driver) - driver;
            updatedlampCupCount = parseInt(foundPart.lampCup) - lampCup;
            updatedbottomCupCount = parseInt(foundPart.bottomCup) - bottomCup;
            updatedcolorBoxCount = parseInt(foundPart.colorBox) - colorBox;
            updatedcottonBoxCount = parseInt(foundPart.cottonBox) - cottonBox;
        }
        else {
            return res.status(400).json({ 
                error: 'Invalid arithType',
                message: 'arithType must be "add" or "reduce"'
            });
        }
        
        // Update the part - use correct field access
        const updatedParts = await Parts.findOneAndUpdate(
            { 
                watts: body.data.watts,      // Fixed: body.data.watts
                tempColor: body.data.tempColor  // Fixed: body.data.tempColor
            },
            {
                bulbSheet: updatedbulbSheetCount.toString(),
                driver: updateddriverCount.toString(),
                lampCup: updatedlampCupCount.toString(),
                bottomCup: updatedbottomCupCount.toString(),
                colorBox: updatedcolorBoxCount.toString(),
                cottonBox: updatedcottonBoxCount.toString()
            },
            { returnDocument: 'after', runValidators: true }
        );
        
        res.json({ 
            success: true,
            message: `Parts ${body.arithType}ed successfully`,
            updatedParts 
        });
        
    } catch (err) {
        console.error('Error updating parts:', err);
        res.status(500).json({ 
            error: 'Internal server error',
            message: err.message 
        });
    }
});

// router.patch('/parts', async (req, res)=>{
//     try{
//         const {body} = req;

//         const bulbSheet = parseInt(body.data.bulbSheet) || 0;
//         const driver = parseInt(body.data.driver) || 0;
//         const lampCup = parseInt(body.data.lampCup) || 0;
//         const bottomCup = parseInt(body.data.bottomCup) || 0;
//         const colorBox = parseInt(body.data.colorBox) || 0;
//         const cottonBox = parseInt(body.data.cottonBox) || 0;

//         let updatedbulbSheetCount, updateddriverCount, updatedlampCupCount;
//         let updatedbottomCupCount, updatedcolorBoxCount, updatedcottonBoxCount;

//         const foundPart = await Parts.find({watts : body.data.watts, tempColor: body.data.tempColor });
//         console.log(foundPart)
//         if(body.arithType == 'add'){
//             updatedbulbSheetCount = parseInt(foundPart[0].bulbSheet) + bulbSheet;
//             updateddriverCount = parseInt(foundPart[0].driver) + driver;
//             updatedlampCupCount = parseInt(foundPart[0].lampCup) + lampCup;
//             updatedbottomCupCount = parseInt(foundPart[0].bottomCup) + bottomCup;
//             updatedcolorBoxCount = parseInt(foundPart[0].colorBox) + colorBox;
//             updatedcottonBoxCount = parseInt(foundPart[0].cottonBox) + cottonBox;
//         }
//         if(body.arithType == 'reduce'){
//             updatedbulbSheetCount = parseInt(foundPart[0].bulbSheet) - bulbSheet;
//             updateddriverCount = parseInt(foundPart[0].driver) - driver;
//             updatedlampCupCount = parseInt(foundPart[0].lampCup) - lampCup;
//             updatedbottomCupCount = parseInt(foundPart[0].bottomCup) - bottomCup;
//             updatedcolorBoxCount = parseInt(foundPart[0].colorBox) - colorBox;
//             updatedcottonBoxCount = parseInt(foundPart[0].cottonBox) - cottonBox;
//         }




//         const updatedParts = await Parts.findOneAndUpdate(
//             {watts : body.watts, tempColor: body.tempColor },
//             {
//                 bulbSheet : updatedbulbSheetCount,
//                 driver : updateddriverCount,
//                 lampCup : updatedlampCupCount,
//                 bottomCup : updatedttomCupCount,
//                 colorBox : updatedcolorBoxCount,
//                 cottonBox : updatedcottonBoxCount
//             },
//             { returnDocument: 'after' }
//         )
//         res.json({updatedParts})
//     }
//     catch(err){
//         res.status(400).json(err)
//     }
// });
export default router;