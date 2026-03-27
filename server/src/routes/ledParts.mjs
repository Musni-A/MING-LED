import express from 'express';
import { Router } from 'express';

const app = express();
const router = Router();

router.post('ledParts', (req, res)=>{
    res.send('Musni')
})

router.post('/test',(req, res)=>{
    const testData = req.body;
    res.json({msg : "success", testData})
})

export default router;