import { Request, Response, NextFunction } from 'express';
import { PlanService } from './plan.service';

export class PlanController {
    private planService: PlanService;

    constructor() {
        this.planService = new PlanService();
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const plan = await this.planService.create(req.body);
            res.status(201).json({ status: 'success', data: plan });
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const plans = await this.planService.findAll();
            res.json({ status: 'success', data: plans });
        } catch (err) {
            next(err);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const plan = await this.planService.findById(req.params.id as string);
            if (!plan) {
                return res.status(404).json({ status: 'error', message: 'Plan not found' });
            }
            res.json({ status: 'success', data: plan });
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const plan = await this.planService.update(req.params.id as string, req.body);
            res.json({ status: 'success', data: plan });
        } catch (err) {
            next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.planService.delete(req.params.id as string);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}
