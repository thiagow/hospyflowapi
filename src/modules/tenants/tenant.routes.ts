import { Router } from 'express';
import { TenantController } from './tenant.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const tenantRouter = Router();
const tenantController = new TenantController();

// Only authenticated users can access tenant routes
tenantRouter.use(authMiddleware);

// Routes managed by SAAS_ADMIN
tenantRouter.get('/', roleGuard(['SAAS_ADMIN']), tenantController.findAll.bind(tenantController));
tenantRouter.post('/', roleGuard(['SAAS_ADMIN']), tenantController.create.bind(tenantController));

// Routes accessible by both SAAS_ADMIN and ADMIN (with ownership check in controller)
tenantRouter.get('/:id', roleGuard(['SAAS_ADMIN', 'ADMIN']), tenantController.findById.bind(tenantController));
tenantRouter.put('/:id', roleGuard(['SAAS_ADMIN', 'ADMIN']), tenantController.update.bind(tenantController));

tenantRouter.delete('/:id', roleGuard(['SAAS_ADMIN']), tenantController.delete.bind(tenantController));

export default tenantRouter;
