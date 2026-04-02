import { Router } from 'express';
import { PlanController } from './plan.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const planRouter = Router();
const planController = new PlanController();

planRouter.use(authMiddleware);
planRouter.use(roleGuard(['SAAS_ADMIN']));

planRouter.post('/', planController.create.bind(planController));
planRouter.get('/', planController.findAll.bind(planController));
planRouter.get('/:id', planController.findById.bind(planController));
planRouter.put('/:id', planController.update.bind(planController));
planRouter.delete('/:id', planController.delete.bind(planController));

export default planRouter;
