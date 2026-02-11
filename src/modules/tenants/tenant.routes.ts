import { Router } from 'express';
import { TenantController } from './tenant.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const tenantRouter = Router();
const tenantController = new TenantController();

// Only SAAS_ADMIN can manage tenants
tenantRouter.use(authMiddleware);
tenantRouter.use(roleGuard(['SAAS_ADMIN']));

tenantRouter.post('/', tenantController.create.bind(tenantController));
tenantRouter.get('/', tenantController.findAll.bind(tenantController));
tenantRouter.get('/:id', tenantController.findById.bind(tenantController));

export default tenantRouter;
