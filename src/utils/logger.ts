import { ObjectId } from 'mongoose';

import Log from '../models/log.model';

type LogActionParams = {
    actionType: string;
    performedBy: ObjectId;
    description: string;
}

export const logAction = async ({ actionType, performedBy, description }: LogActionParams) => {
    try {
        await Log.create({
            actionType,
            performedBy,
            description,
        });
    } catch (err: any) {
        console.error('Failed to log action:', err?.message);
    }
};