import { Request, Response, NextFunction } from 'express';
import { FeedbackService } from './feedback.service';
import { AuthenticatedRequest } from '../../types';

export class FeedbackController {
    private service: FeedbackService;

    constructor() {
        this.service = new FeedbackService();
    }

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const guestId = req.user?.id;
            if (!guestId) throw new Error('User ID required');

            // Ideally check if guest is checked in that room or was.
            // For now just allow creation.

            const feedback = await this.service.create({ ...req.body, guestId }, tenantId);
            res.status(201).json({ status: 'success', data: feedback });
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const feedbacks = await this.service.findAll(tenantId);
            res.json({ status: 'success', data: feedbacks });
        } catch (err) {
            next(err);
        }
    }
}
