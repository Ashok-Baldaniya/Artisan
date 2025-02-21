import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
    }],
    subtotal: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export const Cart = mongoose.model('Cart', cartSchema);