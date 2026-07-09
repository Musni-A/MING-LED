import mongoose from 'mongoose';

const partsHistorySchema = new mongoose.Schema({
    date : {
        type : Date,
        default : () => new Date().toISOString().split('T')[0]
    },
    partsOfWatts : [{
        arithType : {type : String, required : true},
        watts: { type: String, required: true },
        typeName: { type: String, required: true },
        price: { type: Number, required: true },
        parts : [{
            partsName: { type: String, required: true },
            quantity: { type: Number, required: true },
        }]
    }]
});

export const PartsHistory = mongoose.model('partsHistory', partsHistorySchema);