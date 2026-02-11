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
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const users = await this.userService.findAll(tenantId);
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
}
