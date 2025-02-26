import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { config } from '../config/env.js';

export const registerUser = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const createdUser = await User.create(req.body);
        return res.status(200).json({ data: createdUser, message: 'User sign-up success' });
    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

        return res.status(200).json({ token, message: 'User login successfully!' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const verifyUserEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).json({ message: 'Email verified!!' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        user.password = password;
        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}