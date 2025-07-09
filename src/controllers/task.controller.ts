import { ObjectId } from 'mongoose';
import { Request, Response } from 'express';

import Task from '../models/task.model';
import User from '../models/user.model';

import { createTaskSchema, updateTaskSchema } from '../zod/task.schema';


export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find()
            .populate('assignedUser', 'name email')
            .populate('updatedBy', 'name email');

        res.status(200).json(tasks);

    } catch (error: any) {
        console.error('GetAllTask error:', error.message);
        res.status(500).json({ error: error.message });
    }
};


export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, assignedUser, status, priority } = createTaskSchema.parse(req.body);

        const task = await Task.create({
            title,
            status,
            priority,
            description,
            assignedUser,
            updatedBy: req.user?.id
        });

        res.status(201).json(task);

    } catch (error: any) {
        console.error('CreateTask error:', error.message);
        res.status(500).json({ error: error.message });
    }
};


export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = updateTaskSchema.parse(req.body);


        // handling conflict at database level with "updatedAt"
        const updatedTaskData = await Task.findOneAndUpdate(
            { _id: req.params.id, updatedAt: new Date(data.updatedAt!) },
            { $set: { ...data, updatedAt: new Date(), updatedBy: req.user?.id } },
            { new: true }
        );

        if (!updatedTaskData) {
            const task = await Task.findById(id);
            
            res.status(409).json({
                message: "Conflict detected",
                clientTask: data,
                serverTask: task
            });
            return;
        }

        res.status(200).json(updatedTaskData);

    } catch (error: any) {
        console.error('updateTask error:', error.message);
        res.status(500).json({ error: error.message });
    }
};



export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted' });

    } catch (error: any) {
        console.error('DeleteTask error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export const smartAssignTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const countMap: Record<string, number> = {};

        const userIds = await User.distinct('_id') as ObjectId[];
        const activeTasks = await Task.find({ status: { $ne: 'Done' } });

        userIds.forEach((uid: ObjectId) => {
            countMap[uid.toString()] = 0;
        })

        activeTasks.forEach((task) => {
            const uid = task.assignedUser?.toString();
            if (!uid) return;

            countMap[uid] += 1;
        })
        console.log(countMap)
        const userWithLeastTasks = Object.entries(countMap).sort((a, b) => a[1] - b[1])[0]?.[0];


        if (!userWithLeastTasks) {
            res.status(400).json({ message: 'No users to assign' });
            return;
        }

        const task = await Task.findByIdAndUpdate(
            id,
            { assignedUser: userWithLeastTasks, updatedAt: new Date(), updatedBy: req.user?.id },
            { new: true }
        );

        res.status(200).json(task);
    } catch (error: any) {
        console.error('smartAssignTask error:', error.message);
        res.status(500).json({ error: error.message });
    }
};
