import { Request, Response, NextFunction } from 'express';
import { TaskService } from './task.service';
import { AuthenticatedRequest } from '../../types';
import { TaskStatus } from '@prisma/client';

export class TaskController {
    private service: TaskService;

    constructor() {
        this.service = new TaskService();
    }

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const task = await this.service.create(req.body, tenantId);
            res.status(201).json({ status: 'success', data: task });
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const filter: any = {};
            if (req.query.assignedToId) filter.assignedToId = req.query.assignedToId as string;
            if (req.query.roomId) filter.roomId = req.query.roomId as string;
            if (req.query.status) filter.status = req.query.status as TaskStatus;

            const tasks = await this.service.findAll(tenantId, filter);
            res.json({ status: 'success', data: tasks });
        } catch (err) {
            next(err);
        }
    }

    async findById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');
            const task = await this.service.findById(req.params.id as string, tenantId);
            res.json({ status: 'success', data: task });
        } catch (err) {
            next(err);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');
            const task = await this.service.update(req.params.id as string, req.body, tenantId);
            res.json({ status: 'success', data: task });
        } catch (err) {
            next(err);
        }
    }

    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');
            await this.service.delete(req.params.id as string, tenantId);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    async toggleItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');
            const { itemId } = req.params;
            const { checked } = req.body;

            const item = await this.service.toggleChecklistItem(itemId as string, checked, tenantId);
            res.json({ status: 'success', data: item });
        } catch (err) {
            next(err);
        }
    }
}
