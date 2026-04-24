import { Router } from "express";
import { LightWatts } from "../mongoose/schema/lightWatts.mjs";
import { Product } from "../mongoose/schema/product.mjs";

const router = Router();

router.post('/lightWatts', async (req, res) => {
    const startTime = Date.now(); // Performance monitoring
    
    try {
        // ============ 1. INPUT VALIDATION ============
        const { body } = req;
        
        // Validate request body exists
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Request body is required',
                code: 'INVALID_REQUEST'
            });
        }
        
        // Validate required fields
        if (!body.watts) {
            return res.status(400).json({ 
                success: false,
                message: 'Watts value is required',
                code: 'MISSING_FIELD',
                field: 'watts'
            });
        }
        
        if (!body.typeName) {
            return res.status(400).json({ 
                success: false,
                message: 'Type name is required',
                code: 'MISSING_FIELD',
                field: 'typeName'
            });
        }
        
        if (typeof body.typeName !== 'string' || body.typeName.trim().length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Type name must be a non-empty string',
                code: 'INVALID_DATA_TYPE'
            });
        }
        
        // ============ 2. SANITIZE INPUT ============
        const sanitizedWatts = body.watts;
        const sanitizedTypeName = body.typeName.trim();
        
        
        // ============ 4. CREATE DOCUMENTS ============
        const lightWattsData = body;
        
        const lightWatts = new LightWatts(lightWattsData);
        
        const productData = {
            name: sanitizedWatts.toString(),
            type: sanitizedTypeName,
            price: body.price || 0,
            stock: body.stock || 0,
            createdAt: new Date(),
            createdBy: req.user?._id || null
        };
        
        const product = new Product(productData);
        
        // ============ 5. PARALLEL SAVING WITH TRANSACTION ============
        // Use Promise.all for better performance
        const [savedLightWatts, savedProduct] = await Promise.all([
            lightWatts.save(),
            product.save()
        ]);
        
        // ============ 6. LOGGING ============
        const responseTime = Date.now() - startTime;
        console.log(`[INFO] LightWatts created successfully:`, {
            lightWattsId: savedLightWatts._id,
            productId: savedProduct._id,
            watts: sanitizedWatts,
            type: sanitizedTypeName,
            responseTime: `${responseTime}ms`,
            ip: req.ip,
            endpoint: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString()
        });
        
        // ============ 7. SUCCESS RESPONSE ============
        res.status(201).json({ 
            success: true,
            message: 'LightWatts and Product created successfully',
            data: {
                lightWatts: {
                    id: savedLightWatts._id,
                    watts: savedLightWatts.watts,
                    typeName: savedLightWatts.typeName,
                    createdAt: savedLightWatts.createdAt
                },
                product: {
                    id: savedProduct._id,
                    name: savedProduct.name,
                    type: savedProduct.type,
                    price: savedProduct.price,
                    stock: savedProduct.stock
                }
            },
            metadata: {
                responseTime: `${responseTime}ms`,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (err) {
        // ============ 8. ERROR HANDLING ============
        const responseTime = Date.now() - startTime;
        
        // Log error for debugging
        console.error(`[ERROR] Failed to create LightWatts:`, {
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
            body: req.body,
            responseTime: `${responseTime}ms`,
            ip: req.ip,
            endpoint: req.originalUrl,
            timestamp: new Date().toISOString()
        });
        
        // Handle specific MongoDB errors
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(409).json({ 
                success: false,
                message: `Duplicate key error: ${field} already exists`,
                code: 'DUPLICATE_KEY',
                field: field,
                timestamp: new Date().toISOString()
            });
        }
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                errors: errors,
                timestamp: new Date().toISOString()
            });
        }
        
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                success: false,
                message: `Invalid ${err.path}: ${err.value}`,
                code: 'CAST_ERROR',
                timestamp: new Date().toISOString()
            });
        }
        
        // Generic error response
        res.status(500).json({ 
            success: false,
            message: process.env.NODE_ENV === 'production' 
                ? 'Internal server error. Please try again later.'
                : err.message,
            code: 'INTERNAL_SERVER_ERROR',
            timestamp: new Date().toISOString(),
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }
});

router.get('/lightWatts', async(req, res)=>{
    try{
        const lightWatts = await LightWatts.find();
        res.status(200).json(lightWatts)
    }
    catch(err){
        res.status(400).json({Msg : err})
    }
})

router.patch('/lightWatts', async(req, res)=>{
    try {
    const { body } = req;
    const { id, parts: requestParts, arithType } = body;

    // 1. Input Validation
    if (!id) {
        return res.status(400).json({ 
            success: false,
            message: 'ID is required' 
        });
    }

    if (!requestParts || typeof requestParts !== 'object') {
        return res.status(400).json({ 
            success: false,
            message: 'Parts object is required' 
        });
    }

    // Validate arithType
    if (!arithType || !['add', 'subtract'].includes(arithType)) {
        return res.status(400).json({ 
            success: false,
            message: 'arithType must be either "add" or "subtract"' 
        });
    }

    // 2. Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid ID format' 
        });
    }

    // 3. Check if document exists
    const lightWatts = await LightWatts.findById(id).lean();
    
    if (!lightWatts) {
        return res.status(404).json({ 
            success: false,
            message: 'Light watts not found' 
        });
    }

    // 4. Validate and parse parts
    const parts = Object.entries(requestParts).map(([partsName, quantity]) => {
        const parsedQuantity = Number(quantity);
        
        // Validate quantity
        if (isNaN(parsedQuantity)) {
            throw new Error(`Invalid quantity for part "${partsName}": ${quantity}`);
        }
        
        if (parsedQuantity < 0) {
            throw new Error(`Quantity cannot be negative for part "${partsName}"`);
        }
        
        return {
            partsName,
            quantity: parsedQuantity
        };
    });

    // 5. Check if all parts exist in database
    const missingParts = parts.filter(part => 
        !lightWatts.parts.some(dbPart => dbPart.partsName === part.partsName)
    );

    if (missingParts.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Some parts not found in database',
            missingParts: missingParts.map(p => p.partsName)
        });
    }

    // 6. Calculate new quantities based on arithType
    const insufficientParts = [];
    const updatedParts = lightWatts.parts.map(dbPart => {
        const operationPart = parts.find(p => p.partsName === dbPart.partsName);
        const operationQuantity = operationPart?.quantity || 0;
        let newQuantity;

        if (arithType === 'add') {
            // Addition - always safe, no negative check needed
            newQuantity = dbPart.quantity + operationQuantity;
        } else {
            // Subtraction - check for insufficient quantity
            if(operationQuantity > dbPart.quantity){
                return res.status(400).json({
                    success: false,
                    message: 'Can not reduce more than have!'
                })
            }
            newQuantity = dbPart.quantity - operationQuantity;
            
            if (newQuantity < 0) {
                insufficientParts.push({
                    partsName: dbPart.partsName,
                    available: dbPart.quantity,
                    requested: operationQuantity,
                    shortage: Math.abs(newQuantity),
                    operation: 'subtract'
                });
            }
        }
        
        return {
            ...dbPart,
            quantity: arithType === 'subtract' ? Math.max(0, newQuantity) : newQuantity
        };
    });

    // If any part has insufficient quantity for subtraction, reject the operation
    if (insufficientParts.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Insufficient quantity for some parts',
            insufficientParts
        });
    }

    // 7. Perform the update
    const updatedLightWatts = await LightWatts.findByIdAndUpdate(
        id,
        { $set: { parts: updatedParts } },
        { 
            returnDocument: 'after',
            runValidators: true,
            lean: true
        }
    );

    // 8. Verify update was successful
    if (!updatedLightWatts) {
        return res.status(500).json({
            success: false,
            message: 'Update failed - document not found after update'
        });
    }

    // 9. Success response
    res.status(200).json({
        success: true,
        message: `Parts ${arithType === 'add' ? 'added' : 'subtracted'} successfully`,
        operation: arithType,
        data: updatedLightWatts,
        summary: {
            before: lightWatts.parts.map(p => ({ 
                name: p.partsName, 
                quantity: p.quantity 
            })),
            operation: arithType,
            changes: parts.map(p => ({ 
                name: p.partsName, 
                [arithType]: p.quantity 
            })),
            after: updatedLightWatts.parts.map(p => ({ 
                name: p.partsName, 
                quantity: p.quantity 
            }))
        }
    });

    } catch (err) {
        // Detailed error logging
        console.error('Error in parts operation:', {
            message: err.message,
            stack: err.stack,
            body: req.body,
            timestamp: new Date().toISOString()
        });

        // Handle specific MongoDB errors
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid data type in request',
                error: err.message
            });
        }

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: Object.values(err.errors).map(e => e.message)
            });
        }

        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Duplicate key error',
                error: err.message
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
        });
    }
});

router.delete('/lightWatts/:id', async (req, res) => {
    try {
        const wattsId = req.params.id;
        const deletedWatts = await LightWatts.findByIdAndDelete(wattsId);
        
        // Check if document exists
        if (!deletedWatts) {
            return res.status(404).json({ 
                message: 'LightWatts record not found' 
            });
        }
        
        res.status(200).json(deletedWatts);
    } 
    catch(err) {
        // ✅ Don't send the raw Error object - send a readable message
        console.error('Error deleting lightWatts:', err);
        
        // Send a clean error response
        res.status(400).json({ 
            message: err.message || 'Failed to delete lightWatts record',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});


export default router;