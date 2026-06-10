import express from "express"
import { FinishingGoodsHistory } from "../mongoose/schema/finishingGoodsHistory.mjs";

const router = express.Router();

router.post( '/finishingGoodsHistory', async (req , res)=>{
    try{
        const data = req.body;
        const distributor = req.query.distributor;

        const filterDataForUpdate = data.map(({ type, invoiceNumber, ...rest }) => rest);
        
        const filterDataForInsert = data.map(({ type, parts, invoiceNumber, ...rest }) => rest);
        
        const rearrageData = (data) =>{
            const arragedData = {};

            data.forEach(product => {
                const invoice = product.invoiceNumber;
                const arithType = product.type;
                if (!arragedData[invoice]) {
                    arragedData[invoice] = {
                        invoiceNumber: invoice,
                        distributor: distributor,
                        arithType : arithType,
                        products: filterDataForInsert
                    };
                }
            })
            


            return Object.values(arragedData);
        };

        const result = rearrageData(data);

        const {invoiceNumber, arithType, products} = result[0];

        if (arithType === 'sale') {
            if (!invoiceNumber || !distributor) {
                return res.status(400).json({ message: "Invoice number and distributor are required" });
            }

            // You can completely remove the separate "findOne" check.
            // findOneAndUpdate with upsert handles existence checks automatically in 1 database call.
            const filter = { invoiceNumber: invoiceNumber };
            
            const updateData = {
                $set: {
                    date: new Date().toISOString().split('T')[0],
                    invoiceNumber,
                    distributor,
                    arithType,
                    products
                }
            };

            const insertData = await FinishingGoodsHistory.findOneAndUpdate(
                filter,
                updateData,
                { upsert: true, returnDocument: 'after' } // 'new: true' is the correct Mongoose syntax
            );

            return res.status(200).json({ 
                message: "Data processed successfully", 
                data: insertData 
            });
        }

        if( arithType === "restock"){
            const existData = await FinishingGoodsHistory.findOne({
                date : new Date().toISOString().split('T')[0],
                arithType : "restock"
            })

            if(existData){
                const filter = { 
                    date: new Date().toISOString().split('T')[0],
                    arithType : "restock"
                };

                const replacement = {
                    date: new Date().toISOString().split('T')[0],
                    invoiceNumber,
                    distributor,
                    arithType, // This will use the variable value (e.g., "restock" or whatever it holds)
                    products
                };

                // Use await and pass the options object as the third argument
                const insertData = await FinishingGoodsHistory.findOneAndReplace(
                    filter, 
                    replacement, 
                    { upsert: true, returnDocument: 'after' }
                );
                return res.status(200).json({ message: "Data inserted successfully", data: insertData });
            }
        }

        // const insertData = new FinishingGoodsHistory({
        //     invoiceNumber,
        //     distributor,
        //     arithType,
        //     products
        // });


        // const insertedData = insertData.save();

        // return res.status(200).json({ message: "Data inserted successfully", data: insertData });
    }
    catch(err){
        return res.status(400).json({ message: err.message });
    }
});

router.get('/getFinishingGoodsHistory', async(req, res)=>{
    try{
        const finishingGoodsHistory = await FinishingGoodsHistory.find();
        return res.status(200).json(finishingGoodsHistory)
    }
    catch(err){
        return res.status(400).json({ message: err.message });
    }
})

export default router;