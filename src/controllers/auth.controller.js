import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { config } from '../config/env.js';
import { sendEmail } from "../services/email.service.js";
import { generateVerificationToken } from "../services/auth.service.js";

export const signupUser = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const verificationToken = generateVerificationToken(20);

        const verificationLink = `${config.domain}/api/auth/verify-email?token=${verificationToken}`;

        const emailPromise = sendEmail(req.body.email, req.body.name, verificationLink);

        req.body.verificationToken = verificationToken;
        const createUserPromise = User.create(req.body);

        await Promise.all([emailPromise, createUserPromise]);

        return res.status(200).json({ message: 'User sign-up successfully, please check mail to verify!' });
    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
}

export const verifyUserEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        return res.status(200).json({ message: 'Email verified!!' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ error: 'Please verify email first to login' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

        return res.status(200).json({ token, message: 'User login successfully!' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email not found!' });
        }

        const verificationToken = generateVerificationToken(20);

        user.verificationToken = verificationToken;

        await user.save();

        const verificationLink = `${config.domain}/api/auth/reset-password?token=${verificationToken}`;

        await sendEmail(email, user.name, verificationLink);

        return res.status(200).json({ message: 'Please check your email to reset password!' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (req.user.email !== email) {
            return res.status(400).json({ error: 'User has need to login first to generate token' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        user.password = password;

        await user.save();

        return res.status(200).json({ data: user, message: 'Password reset successfully!' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}