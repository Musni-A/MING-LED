import mongoose from "mongoose";

const ledPartsSchema = new mongoose.Schema({
    watts: {
        type: Number,
        required: true,
        unique : true
    },
    BulbSheet: {
        type: Number,
        required: true
    },
    Driver: {
        type: Number,
        required: true
    },
    LampCup: {
        type: Number,
        required: true
    },
    BottomCup: {
        type: Number,
        required: true
    },
    ColorBox: {
        type: Number,
        required: true
    },
    CottonBox: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export const LedParts = mongoose.model('LedParts', ledPartsSchema);