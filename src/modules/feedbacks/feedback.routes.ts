import { Router } from 'express';
import { FeedbackController } from './feedback.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const feedbackRouter = Router();
const controller = new FeedbackController();

feedbackRouter.use(authMiddleware);

// Guest creates feedback
feedbackRouter.post('/', roleGuard(['GUEST', 'ADMIN']), controller.create.bind(controller));

// Admin/Staff/SaaS Admin read feedback
feedbackRouter.get('/', roleGuard(['ADMIN', 'STAFF', 'SAAS_ADMIN']), controller.findAll.bind(controller));

export default feedbackRouter;
