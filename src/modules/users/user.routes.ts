import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleGuard } from '../../middlewares/roleGuard.middleware';

const userRouter = Router();
const userController = new UserController();

userRouter.use(authMiddleware);
// Only ADMIN and SAAS_ADMIN (and potentially RECEPTION for guests?) can manage users.
// For now, lets allow RECEPTION so they can list staff/guests and checkin/checkout.
userRouter.use(roleGuard(['ADMIN', 'SAAS_ADMIN', 'RECEPTION']));

userRouter.post('/', userController.create.bind(userController));
userRouter.get('/', userController.findAll.bind(userController));
userRouter.get('/:id', userController.findById.bind(userController));
userRouter.put('/:id', userController.update.bind(userController));
userRouter.delete('/:id', userController.delete.bind(userController));
userRouter.post('/:id/checkin', userController.checkIn.bind(userController));
userRouter.post('/:id/checkout', userController.checkOut.bind(userController));

export default userRouter;
