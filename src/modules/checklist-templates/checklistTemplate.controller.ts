import { Request, Response, NextFunction } from 'express';
import { ChecklistTemplateService } from './checklistTemplate.service';
import { AuthenticatedRequest } from '../../types';

export class ChecklistTemplateController {
    private service: ChecklistTemplateService;

    constructor() {
        this.service = new ChecklistTemplateService();
    }

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const template = await this.service.create({ ...req.body, tenantId });
            res.status(201).json({ status: 'success', data: template });
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const templates = await this.service.findAll(tenantId);
            res.json({ status: 'success', data: templates });
        } catch (err) {
            next(err);
        }
    }

    async findById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const template = await this.service.findById(req.params.id as string, tenantId);
            res.json({ status: 'success', data: template });
        } catch (err) {
            next(err);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const template = await this.service.update(req.params.id as string, req.body, tenantId);
            res.json({ status: 'success', data: template });
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
