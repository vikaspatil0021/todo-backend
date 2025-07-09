import { ObjectId } from 'mongoose';

import Log from '../models/log.model';

type ActionType =
    | 'REGISTER'
    | 'LOGIN'
    | 'LOGOUT'
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'ASSIGN'
    | 'DRAG_AND_DROP';

type LogActionParams = {
    actionType: ActionType;
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