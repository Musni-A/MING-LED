import mongoose from "mongoose";

const ledPartsSchema = new mongoose.Schema({
    watts: {
        type: String,
        required: true,
        unique : true
    },
    tempColor: {
        type : String,
        required : true
    },
    bulbSheet: {
        type: String,
        required: true
    },
    driver: {
        type: String,
        required: true
    },
    lampCup: {
        type: String,
        required: true
    },
    bottomCup: {
        type: String,
        required: true
    },
    colorBox: {
        type: String,
        required: true
    },
    cottonBox: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const Parts = mongoose.model('LedParts', ledPartsSchema);