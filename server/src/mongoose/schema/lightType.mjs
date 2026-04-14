import mongoose from 'mongoose'

const lightTypeSchema = new mongoose.Schema({
    typeName : {
        type : String,
        unique : true,
        required : true,
        trim : true
    },
    parts : [{
        partsName : {
            type : String,
            require : true,
            trim : true
        }
    }]
})

export const LightType = mongoose.model('LightType', lightTypeSchema)