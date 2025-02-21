import bcrypt from "bcryptjs";
import { Customer } from "../models/customer.model.js";

export const registerUser = async (req, res) => {
    try {
        const { email } = req.body;

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        const createdCustomer = await Customer.create(req.body);
        res.status(200).json(createdCustomer);
        return;
    } catch (error) {
        res.status(500).json({ error: error });
        return;
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({ email });
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

        const customer = await Customer.findOne({ email });
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

        const customer = await Customer.findOne({ email });
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

        const customer = await Customer.findOne({ email });
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