import express from 'express';
import { Router } from 'express';
import { Product } from '../mongoose/schema/product.mjs';

const router = Router();

router.get('/getProduct', async (req, res) => {
    try {
        
        const products = await Product.find();

        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });

    }
});

export default router;