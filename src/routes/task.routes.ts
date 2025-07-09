import { Router } from 'express';

import {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    smartAssignTask
} from '../controllers/task.controller';

const router = Router();


router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/smart-assign', smartAssignTask);

export default router;
