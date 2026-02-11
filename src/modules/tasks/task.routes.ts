import { Router } from 'express';
import { TaskController } from './task.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const taskRouter = Router();
const controller = new TaskController();

taskRouter.use(authMiddleware);
// Tasks can be accessed by ADMIN, STAFF, RECEPTION (maybe), SAAS_ADMIN.
taskRouter.use(roleGuard(['ADMIN', 'SAAS_ADMIN', 'STAFF']));

taskRouter.post('/', controller.create.bind(controller));
taskRouter.get('/', controller.findAll.bind(controller));
taskRouter.get('/:id', controller.findById.bind(controller));
taskRouter.put('/:id', controller.update.bind(controller));
taskRouter.delete('/:id', controller.delete.bind(controller));
taskRouter.patch('/items/:itemId', controller.toggleItem.bind(controller));

export default taskRouter;
