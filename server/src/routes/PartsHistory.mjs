import { Router } from 'express';
import { PartsHistory } from '../mongoose/schema/partsHistory.mjs';
import { isAuthenticated } from '../middleware/auth.mjs';

const router = Router();

router.post('/createPartsHistory', async (req, res) => {
    try {
        const { body } = req;
        const { watts, typeName, price } = body.data;
        const { changedQuantity, operation: arithType } = body.summary;
        
        const today = new Date().toISOString().split('T')[0];
        
        if(arithType == 'add'){
            changedQuantity.forEach(part => {
                part.quantity = part.add;
                delete part.add;
            });
        }
        else if(arithType == 'subtract'){
            changedQuantity.forEach(part => {
                part.quantity = part.subtract;
                delete part.subtract;
            });
        }
        
        // Find or create document for today
        let record = await PartsHistory.findOne({ date: today });
        
        if (!record) {
            // Create new document for today
            record = new PartsHistory({ date: today, partsOfWatts: [] });
        }
        
        // Find if watt with SAME arithType exists
        const wattIndex = record.partsOfWatts.findIndex(
            item => item.watts === watts && 
                    item.typeName === typeName && 
                    item.arithType === arithType  // ← Added arithType check
        );
        
        if (wattIndex !== -1) {
            // UPDATE existing watt (old + new) - SAME arithType
            const existingWatt = record.partsOfWatts[wattIndex];
            
            changedQuantity.forEach(newPart => {
                const existingPart = existingWatt.parts.find(p => p.partsName === newPart.partsName);
                if (existingPart) {
                    existingPart.quantity += newPart.quantity;  // OLD + NEW
                } else {
                    existingWatt.parts.push(newPart);
                }
            });
            
            existingWatt.price = price;
            
        } else {
            // ADD new watt - DIFFERENT arithType or new watt
            record.partsOfWatts.push({
                watts,
                typeName,
                price,
                arithType,  // ← Added arithType field
                parts: changedQuantity
            });
        }
        
        await record.save();
        
        res.json({
            success: true,
            message: wattIndex !== -1 ? 'Updated (old + new)' : 'Added new watt',
            action: wattIndex !== -1 ? 'updated' : 'added',
            data: record
        });
        
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

router.get('/parts-history/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const data = await PartsHistory.findOne({ date: date });
        
        res.json({
            success: true,
            data: data || { date: date, partsOfWatts: [] }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all available dates
router.get('/parts-history/dates', isAuthenticated, async (req, res) => {
    try {
        const dates = await PartsHistory.find({}, 'date').sort({ date: -1 });
        res.json({
            success: true,
            dates: dates.map(d => d.date)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;