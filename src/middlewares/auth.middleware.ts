import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

import { Request, Response, NextFunction } from "express";


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: "Authentication token not found" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY!) as { id: ObjectId; email: string; };
        req.user = decoded;
        next();
    } catch (err: any) {
        console.log(err.message)
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
