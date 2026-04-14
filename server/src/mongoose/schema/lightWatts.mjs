import mongoose from "mongoose";

const lightSchema = new mongoose.Schema({
    typeName : {
        type : String,
        required : true
    },
    watts : {
        type : String,
        required : true,
    },
    parts : [{
        partsName : {
            type : String,
            required : true
        },
        quantity : {
            type : Number,
            default : 0
        }
    }],
    
})

export const LightWatts = mongoose.model('LightWatts', lightSchema)