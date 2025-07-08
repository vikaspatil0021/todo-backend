import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type User = {
    id: string;
    email: string;
}

interface AuthRequest extends Request {
    user?: User;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: "Authentication token not found" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User;
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
