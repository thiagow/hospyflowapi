import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';

export class TenantController {
    private tenantService: TenantService;

    constructor() {
        this.tenantService = new TenantService();
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const tenant = await this.tenantService.create(req.body);
            res.status(201).json({
                status: 'success',
                data: tenant,
            });
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantService.findAll();
            res.json({
                status: 'success',
                data: tenants,
            });
        } catch (err) {
            next(err);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const tenant = await this.tenantService.findById(req.params.id as string);
            res.json({
                status: 'success',
                data: tenant,
            });
        } catch (err) {
            next(err);
        }
    }
}
