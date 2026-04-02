import { Router } from 'express';
import { RoomTypeController } from './roomType.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const roomTypeRouter = Router();
const controller = new RoomTypeController();

roomTypeRouter.use(authMiddleware);
roomTypeRouter.use(roleGuard(['ADMIN', 'SAAS_ADMIN', 'RECEPTION']));

roomTypeRouter.post('/', controller.create.bind(controller));
roomTypeRouter.get('/', controller.findAll.bind(controller));
roomTypeRouter.get('/:id', controller.findById.bind(controller));
roomTypeRouter.put('/:id', controller.update.bind(controller));
roomTypeRouter.delete('/:id', controller.delete.bind(controller));

export default roomTypeRouter;
