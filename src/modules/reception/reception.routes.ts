import { Router } from 'express';
import { ReceptionController } from './reception.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const receptionRouter = Router();
const controller = new ReceptionController();

receptionRouter.use(authMiddleware);
receptionRouter.use(roleGuard(['ADMIN', 'SAAS_ADMIN', 'RECEPTION']));

receptionRouter.post('/check-in', controller.checkIn.bind(controller));
receptionRouter.post('/check-out/:guestId', controller.checkOut.bind(controller));

export default receptionRouter;
