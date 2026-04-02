import { Router } from 'express';
import { ChecklistTemplateController } from './checklistTemplate.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const checklistTemplateRouter = Router();
const controller = new ChecklistTemplateController();

checklistTemplateRouter.use(authMiddleware);
// Manage: admin only
checklistTemplateRouter.post('/', roleGuard(['ADMIN', 'SAAS_ADMIN']), controller.create.bind(controller));
checklistTemplateRouter.put('/:id', roleGuard(['ADMIN', 'SAAS_ADMIN']), controller.update.bind(controller));
checklistTemplateRouter.delete('/:id', roleGuard(['ADMIN', 'SAAS_ADMIN']), controller.delete.bind(controller));

// Read: admin and reception
checklistTemplateRouter.get('/', roleGuard(['ADMIN', 'SAAS_ADMIN', 'RECEPTION']), controller.findAll.bind(controller));
checklistTemplateRouter.get('/:id', roleGuard(['ADMIN', 'SAAS_ADMIN', 'RECEPTION']), controller.findById.bind(controller));


export default checklistTemplateRouter;
