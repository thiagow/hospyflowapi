import { Router } from 'express';
import { RoomController } from './room.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const roomRouter = Router();
const controller = new RoomController();

roomRouter.use(authMiddleware);
roomRouter.use(roleGuard(['ADMIN', 'SAAS_ADMIN', 'RECEPTION', 'STAFF']));

roomRouter.post('/', controller.create.bind(controller));
roomRouter.get('/', controller.findAll.bind(controller));
roomRouter.get('/:id', controller.findById.bind(controller));
roomRouter.put('/:id', controller.update.bind(controller));
roomRouter.delete('/:id', controller.delete.bind(controller));

export default roomRouter;
