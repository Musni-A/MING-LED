import { Router} from 'express'
import { LightType } from '../mongoose/schema/lightType.mjs';
import { isAuthenticated } from '../middleware/auth.mjs';

const router = Router();

router.post('/lightType',async (req,res)=>{
    try{
        const { body } = req;
        const lightType = new LightType(body)
        const saveLight = await lightType.save()
        res.status(200).json({Msg : "Add success", saveLight})
    }
    catch(err){
        res.status(400).json({Msg : err.name})
    }
})

router.get('/lightType', isAuthenticated, async(req, res)=>{
    try{
        const lightType = await LightType.find()
        res.status(200).json(lightType)
    }
    catch(err){
        res.status(400).json({Msg : err.name})
    }
})

router.delete('/lightType/:id', isAuthenticated, async(req, res)=>{
    try{
        const id = req.params.id;
        if(!id){
            return res.status(404).json({Message : 'Light type Not found'})
        }
        const deletedType = await LightType.findByIdAndDelete(id)
        if(!deletedType){
            return res.status(404).json({Message : 'Light type Not found'})
        }
        res.status(200).json(deletedType)
        
    }
    catch(err){
        res.status(400).json(err)
    }
})

export default router;