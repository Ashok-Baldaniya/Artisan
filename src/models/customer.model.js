import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Artisan', 'Customer', 'Admin'],
        default: 'Customer',
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: { type: String },
        city: { type: String },
        zip: { type: String },
        country: { type: String }
    },
    profileImage: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
    }
}, { timestamps: true });

customerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export const Customer = mongoose.model('Customer', customerSchema);
