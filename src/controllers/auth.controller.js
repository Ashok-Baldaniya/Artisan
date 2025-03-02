import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { config } from '../config/env.js';
import { emailTypes, sendEmail } from "../services/email.service.js";
import { generateVerificationToken } from "../services/auth.service.js";

export const signupUser = async (req, res) => {
    try {
        const { email, name } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const verificationToken = generateVerificationToken(20);

        req.body.verificationToken = verificationToken;

        await User.create(req.body);

        const verificationLink = `${config.domain}/api/auth/verify-email?token=${verificationToken}`;
        await sendEmail(email, name, emailTypes.verification, verificationLink);

        return res.status(200).json({ message: 'User sign-up successfully, please check mail to verify!' });
    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
};

export const verifyUserEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({ verificationToken: token });
        if (user.isVerified) {
            return res.status(400).json({ error: 'User is already verified' });
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
            return res.status(404).json({ error: 'User not exist!' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ error: 'Please verify email first to login', isVerified: false });
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
            return res.status(404).json({ error: "User doesn't exist with given email!" });
        }

        const verificationToken = generateVerificationToken(20);

        user.verificationToken = verificationToken;

        await user.save();

        const verificationLink = `${config.domain}/api/auth/confirm-forgot-password?token=${verificationToken}`;

        await sendEmail(email, user.name, emailTypes.forgotPassword, verificationLink);

        return res.status(200).json({ message: 'Please check your email to reset the password' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const confirmForgotPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { password } = req.body;

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ error: 'Invalid token' });
        }

        user.password = password;
        user.verificationToken = undefined;
        await user.save();

        await sendEmail(user.email, user.name, emailTypes.resetPassword);

        return res.status(200).json({ message: 'Password reset successfully!' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;

        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: 'Error updating password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Please enter valid old password' });
        }

        if (password === newPassword) {
            return res.status(400).json({ error: 'New password are match with old password' });
        }

        user.password = newPassword;

        await user.save();

        await sendEmail(user.email, user.name, emailTypes.resetPassword);

        return res.status(200).json({ message: 'Password reset successfully!' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}