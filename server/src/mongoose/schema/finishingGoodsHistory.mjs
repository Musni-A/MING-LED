import mongoose from 'mongoose';

const finishingGoodsHistorySchema = new mongoose.Schema({
  invoiceNumber: { type: String },      // ✅ String (not string)
  distributor: { type: String },        // ✅ String
  arithType: { type: String, required: true },          // ✅ String
  products: [
    {
      watts: { type: String, required: true },       // ✅ String
      typeName: { type: String, required: true },      // ✅ String
      quantity: { type: Number, required: true },       // ✅ Number
      price: { type: Number, required: true }           // ✅ Number
    }
  ],
  date : {
    type : Date,
    default : () => new Date().toISOString().split('T')[0]
  }
}, { timestamps: true });  // ✅ timestamps as 2nd parameter

export const FinishingGoodsHistory = mongoose.model('FinishingGoodsHistory', finishingGoodsHistorySchema);