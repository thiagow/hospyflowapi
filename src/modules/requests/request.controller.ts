import { Request, Response, NextFunction } from 'express';
import { RequestService } from './request.service';
import { AuthenticatedRequest } from '../../types';
import { RequestStatus } from '@prisma/client';

export class RequestController {
    private service: RequestService;

    constructor() {
        this.service = new RequestService();
    }

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            // Guest creates request. guestId comes from token.
            const guestId = req.user?.id;
            if (!guestId) throw new Error('User ID required');

            // RoomId should come from token or body?
            // Guest usually has one room.
            // But body might specify it.
            // Let's assume body has it, or we look it up.
            // Better look up from user to be safe.
            // For now, assume body sends it but we verify in service.

            const request = await this.service.create({ ...req.body, guestId }, tenantId);
            res.status(201).json({ status: 'success', data: request });
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const filter: any = {};
            if (req.query.status) filter.status = req.query.status as RequestStatus;
            if (req.query.roomId) filter.roomId = req.query.roomId as string;

            const requests = await this.service.findAll(tenantId, filter);
            res.json({ status: 'success', data: requests });
        } catch (err) {
            next(err);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const request = await this.service.update(req.params.id as string, req.body, tenantId);
            res.json({ status: 'success', data: request });
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
}
