import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes';
import tenantRouter from '../modules/tenants/tenant.routes';
import userRouter from '../modules/users/user.routes';
import roomTypeRouter from '../modules/room-types/roomType.routes';
import roomRouter from '../modules/rooms/room.routes';
import checklistTemplateRouter from '../modules/checklist-templates/checklistTemplate.routes';
import taskRouter from '../modules/tasks/task.routes';
import receptionRouter from '../modules/reception/reception.routes';
import requestRouter from '../modules/requests/request.routes';
import feedbackRouter from '../modules/feedbacks/feedback.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/tenants', tenantRouter);
router.use('/users', userRouter);
router.use('/room-types', roomTypeRouter);
router.use('/rooms', roomRouter);
router.use('/checklist-templates', checklistTemplateRouter);
router.use('/tasks', taskRouter);
router.use('/reception', receptionRouter);
router.use('/requests', requestRouter);
router.use('/feedbacks', feedbackRouter);

export default router;
