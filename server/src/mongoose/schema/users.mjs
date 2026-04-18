import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username : {
        type : String,
        required : true,
        trim : true,
        unique: true
    },
    age: {
        type: Number,
        default: null
    },
    address: {
        type: String,
        trim: true,
        default: "Yet not set your address"
    },
    phoneNumber: {
        type: String,
        minlength: [10, 'Phone must be 10 digits'],
        maxlength: [10, 'Phone must be 10 digits'],
    },
    password: {
        type: String,
        required: true,
    },
    department : {
        type : String,
        required : true
    },
    jobRole : {
        type : String,
        required : true
    },
    imageUrl: {
        type: String,
        default: null,
        trim: true
    }
}, { timestamps: true });

export const User = mongoose.model('User', usersSchema);