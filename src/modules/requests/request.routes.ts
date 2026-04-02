import { Router } from 'express';
import { RequestController } from './request.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const requestRouter = Router();
const controller = new RequestController();

requestRouter.use(authMiddleware);

// Create: GUEST, STAFF, RECEPTION, ADMIN, SAAS_ADMIN
requestRouter.post('/', roleGuard(['GUEST', 'STAFF', 'RECEPTION', 'ADMIN', 'SAAS_ADMIN']), controller.create.bind(controller));

// Convert to Task: ADMIN, RECEPTION
requestRouter.post('/:id/convert', roleGuard(['ADMIN', 'RECEPTION', 'SAAS_ADMIN']), controller.convertToTask.bind(controller));

// List: ADMIN, STAFF, RECEPTION, SAAS_ADMIN (Guest can see their own? logic in controller/service needed for guest view)
// For now, let's assume this endpoint is for staff/admin. Guest view might be separate or filtered.
requestRouter.get('/', roleGuard(['ADMIN', 'STAFF', 'RECEPTION', 'SAAS_ADMIN']), controller.findAll.bind(controller));

// Update: ADMIN, STAFF, RECEPTION
requestRouter.put('/:id', roleGuard(['ADMIN', 'STAFF', 'RECEPTION', 'SAAS_ADMIN']), controller.update.bind(controller));

// Delete: ADMIN, SAAS_ADMIN
requestRouter.delete('/:id', roleGuard(['ADMIN', 'SAAS_ADMIN']), controller.delete.bind(controller));

export default requestRouter;
