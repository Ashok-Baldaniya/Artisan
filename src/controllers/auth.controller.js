import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

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

        const customer = await User.findOne({ email });
        if (!customer) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid password' });
            return;
        }

        res.status(200).json(customer);
        return;
    } catch (error) {
        res.status(500).json({ error: error });
        return;
    }
}

export const verifyUserEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const customer = await User.findOne({ email });
        if (!customer) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        customer.isVerified = true;
        await customer.save();

        res.status(200).json(customer);
        return;
    } catch (error) {
        res.status(500).json({ error: error });
        return;
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const customer = await User.findOne({ email });
        if (!customer) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(customer);
        return;
    } catch (error) {
        res.status(500).json({ error: error });
        return;
    }
}


export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const customer = await User.findOne({ email });
        if (!customer) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        customer.password = password;
        await customer.save();

        res.status(200).json(customer);
        return;
    } catch (error) {
        res.status(500).json({ error: error });
        return;
    }
}