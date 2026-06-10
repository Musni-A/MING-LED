import mongoose from "mongoose";

const deliverHistory = new mongoose.Schema({
    invoiceNo : {
        type : String,
        unique : true,
        required : true,
        trim : true
    },
    product : [{
        productName : {
            type : String,
            required : true,
            trim : true
        }
    }]
},{ timestamps: true })