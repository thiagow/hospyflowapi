import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';

export class TenantController {
    private tenantService: TenantService;

    constructor() {
        this.tenantService = new TenantService();
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, subdomain, planId, whatsapp, cnpj, adminUser } = req.body;

            if (!adminUser || !adminUser.email || !adminUser.password || !adminUser.name) {
                return res.status(400).json({ status: 'error', message: 'Admin user details are required' });
            }

            const tenant = await this.tenantService.create({ name, subdomain, planId, whatsapp, cnpj, adminUser });
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
            const userId = (req as any).user.id;
            const userRole = (req as any).user.role;
            const userTenantId = (req as any).user.tenantId;
            const requestedId = req.params.id as string;

            // Security check: If not SAAS_ADMIN, must be the user's own tenant
            if (userRole !== 'SAAS_ADMIN' && userTenantId !== requestedId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Forbidden: You do not have permission to access this tenant data'
                });
            }

            const tenant = await this.tenantService.findById(requestedId);
            res.json({
                status: 'success',
                data: tenant,
            });
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const userRole = (req as any).user.role;
            const userTenantId = (req as any).user.tenantId;
            const requestedId = req.params.id as string;

            // Security check: If not SAAS_ADMIN, must be the user's own tenant
            if (userRole !== 'SAAS_ADMIN' && userTenantId !== requestedId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Forbidden: You do not have permission to update this tenant data'
                });
            }

            const tenant = await this.tenantService.update(requestedId, req.body);
            res.json({
                status: 'success',
                data: tenant,
            });
        } catch (err) {
            next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.tenantService.delete(req.params.id as string);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}
