import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const dashboardRouter = Router();
const controller = new DashboardController();

dashboardRouter.use(authMiddleware);

dashboardRouter.get('/admin', roleGuard(['ADMIN', 'RECEPTION']), controller.getAdminStats.bind(controller));
dashboardRouter.get('/saas', roleGuard(['SAAS_ADMIN']), controller.getSaaSStats.bind(controller));
dashboardRouter.get('/guest', roleGuard(['GUEST']), controller.getGuestStats.bind(controller));

export default dashboardRouter;
