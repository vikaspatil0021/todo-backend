import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value: string) {
                const forbidden = ['todo', 'in progress', 'done'];
                return !forbidden.includes(value.toLowerCase());
            },
            message: (props: { value: string }) => `"${props.value}" is a reserved word. Title cannot be 'Todo', 'In Progress', or 'Done'.`
        }
    },
    description: { type: String },
    assignedUser: { type: mongoose.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Task', taskSchema);
