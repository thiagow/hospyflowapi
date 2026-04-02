import { Router } from 'express';
import { LogsController } from './logs.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const logsRouter = Router();
const controller = new LogsController();

logsRouter.use(authMiddleware);

logsRouter.get('/', roleGuard(['ADMIN', 'SAAS_ADMIN']), controller.getAll.bind(controller));

export default logsRouter;
