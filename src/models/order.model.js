import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
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
        }
    }],
    subtotal: {
        type: Number,
        required: true
    },
    shippingCost: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true }
    },
    trackingNumber: {
        type: String,
        required: false
    },
    paymentInfo: {
        paymentMethod: { type: String, required: true },
        transactionId: { type: String, required: true },
        status: { type: String, required: true }
    },
    notes: {
        type: String,
        required: false
    }
}, { timestamps: true });

orderSchema.virtual('totalAmount').get(function () {
    return this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
})

export const Order = mongoose.model('Order', orderSchema);