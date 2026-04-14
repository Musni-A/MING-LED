import {response, Router} from 'express'
import express from 'express'
import { LightType } from '../mongoose/schema/lightType.mjs';

const app = express();
const router = Router();

router.post('/lightType',async (req,res)=>{
    try{
        const { body } = req;
        console.log(body)
        const lightType = new LightType(body)
        const saveLight = await lightType.save()
        res.status(200).json({Msg : "Add success", saveLight})
    }
    catch(err){
        res.status(400).json({Msg : err.name})
    }
})

router.get('/lightType', async(req, res)=>{
    try{
        const lightType = await LightType.find()
        res.status(200).json(lightType)
    }
    catch(err){
        res.status(400).json({Msg : err.name})
    }
})

export default router;