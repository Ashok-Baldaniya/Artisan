import mongoose from "mongoose";

const artisanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    specialties: [{
        type: String,
        required: true
    }],
    socialLinks: {
        website: { type: String },
        instagram: { type: String },
        facebook: { type: String }
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    bankInfo: {
        bankName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        routingNumber: { type: String, required: true },
        accountHolderName: { type: String, required: true }
    }
}, { timestamps: true });

export const Artisan = mongoose.model('Artisan', artisanSchema);