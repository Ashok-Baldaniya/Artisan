import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
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
        required: true,
        unique: true
    },
    address: {
        street: { type: String },
        city: { type: String },
        zip: { type: String },
        country: { type: String }
    },
    profileImage: {
        type: String,
        required: false
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    verificationToken: {
        type: String,
        required: false
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export const User = mongoose.model('User', userSchema);
