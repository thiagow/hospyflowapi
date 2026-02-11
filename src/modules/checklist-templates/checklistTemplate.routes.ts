import { Router } from 'express';
import { ChecklistTemplateController } from './checklistTemplate.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const checklistTemplateRouter = Router();
const controller = new ChecklistTemplateController();

checklistTemplateRouter.use(authMiddleware);
checklistTemplateRouter.use(roleGuard(['ADMIN', 'SAAS_ADMIN']));

checklistTemplateRouter.post('/', controller.create.bind(controller));
checklistTemplateRouter.get('/', controller.findAll.bind(controller));
checklistTemplateRouter.get('/:id', controller.findById.bind(controller));
checklistTemplateRouter.delete('/:id', controller.delete.bind(controller));

export default checklistTemplateRouter;
