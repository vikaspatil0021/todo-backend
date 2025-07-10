
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';

import User from '../models/user.model';

import { loginSchema, registerSchema } from '../zod/auth.schema';

import { logAction } from '../utils/logger';


export const checkUser = (req: Request, res: Response) => {

    const user = req.user;
    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    res.status(200).json({
        success: true,
        user,
    });
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = registerSchema.parse(req.body);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: "Looks like you already have an account. Log in!" });
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashPassword
        });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.TOKEN_SECRET_KEY!, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        await logAction({
            actionType: "REGISTER",
            performedBy: user.id,
            description: `User ${user.name} (${user.email}) registered an account.`,
        });

        res.status(201).json({ success: true });

    } catch (error: any) {
        console.error('Registration error:', error.message);
        res.status(500).json({ error: error.message });
    }
};


export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            res.status(404).json({ error: 'User does not exist' });
            return;
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Incorrect password' });
            return;
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.TOKEN_SECRET_KEY!, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        await logAction({
            actionType: "LOGIN",
            performedBy: existingUser.id,
            description: `User ${existingUser.name} (${existingUser.email}) logged in.`,
        });

        res.status(200).json({ success: true });

    } catch (error: any) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: error.message });
    }

};


export const logoutUser = async (req: Request, res: Response) => {

    await logAction({
        actionType: "LOGOUT",
        performedBy: req.user?.id!,
        description: `User (${req.user?.email}) logged out.`,
    });

    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });


    res.status(200).json({ success: true });
};