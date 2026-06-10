import express from "express"

const router = express.Router();

router.post( '/deliverHistory', (req , res)=>{
    console.log('Musni')
    const {body} = req;
    console.log(body)

    res.json({msg : 'Musni'})
})

export default router;