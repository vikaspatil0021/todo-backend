import { Request, Response } from "express";

import Log from '../models/log.model';


export const getRecentLogs = async (req: Request, res: Response) => {
    try {
        const logs = await Log.find()
            .sort({ timestamp: -1 })
            .limit(20)
            .populate('performedBy', 'name email');

        res.status(200).json(logs);

    } catch (error: any) {
        console.error('getRecentLogs error:', error.message);
        res.status(500).json({ error: error.message });
    }
}