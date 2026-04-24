// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        index: true
    },
    
    type: {
        type: String,
        required: [true, 'Product type is required'],
        index: true
    },
    
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
        default: 0
    },
    
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
        index: true
    }
}, {
    timestamps: true
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
    if (this.stock === 0) return 'Out of Stock';
    if (this.stock < 10) return 'Low Stock';
    return 'In Stock';
});

// Virtual for total value
productSchema.virtual('totalValue').get(function() {
    return this.stock * this.price;
});

// Index for text search
productSchema.index({ name: 'text', type: 'text' });

export const Product =  mongoose.model('Product', productSchema);