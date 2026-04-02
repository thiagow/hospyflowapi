import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { AuthenticatedRequest } from '../../types';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required'); // Should be handled by guard/middleware usually

            const user = await this.userService.create(req.body, tenantId);
            res.status(201).json({ status: 'success', data: user });
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userRole = req.user?.role;
            let tenantId = req.user?.tenantId;

            // If SAAS_ADMIN, they can optionally provide a tenantId filter, otherwise they see all
            if (userRole === 'SAAS_ADMIN') {
                tenantId = (req.query.tenantId as string) || undefined;
            } else if (!tenantId) {
                throw new Error('Tenant ID required');
            }

            const role = req.query.role as string;

            const users = await this.userService.findAll(tenantId, role);
            res.json({ status: 'success', data: users });
        } catch (err) {
            next(err);
        }
    }

    async findById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const user = await this.userService.findById(req.params.id as string, tenantId);
            res.json({ status: 'success', data: user });
        } catch (err) {
            next(err);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const user = await this.userService.update(req.params.id as string, req.body, tenantId);
            res.json({ status: 'success', data: user });
        } catch (err) {
            next(err);
        }
    }

    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            await this.userService.delete(req.params.id as string, tenantId);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    async checkIn(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const { roomId } = req.body;
            if (!roomId) throw new Error('Room ID required');

            await this.userService.checkIn(req.params.id as string, roomId, tenantId);
            res.status(200).json({ status: 'success', message: 'Check-in successful' });
        } catch (err) {
            next(err);
        }
    }

    async checkOut(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            await this.userService.checkOut(req.params.id as string, tenantId);
            res.status(200).json({ status: 'success', message: 'Check-out successful' });
        } catch (err) {
            next(err);
        }
    }
}
