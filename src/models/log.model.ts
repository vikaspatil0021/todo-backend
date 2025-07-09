import mongoose from 'mongoose';

const actionTypes = [
    'REGISTER',
    'LOGIN',
    'LOGOUT',
    'CREATE',
    'UPDATE',
    'DELETE',
    'ASSIGN',
    'DRAG_AND_DROP',
];

const logSchema = new mongoose.Schema({
    actionType: { type: String, enum: actionTypes, required: true },
    performedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Log', logSchema);