import { PrismaClient, UserRole, UserStatus, TenantStatus, BillingCycle } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Check if default SaaS Admin exists
    const existingAdmin = await prisma.user.findFirst({
        where: { email: 'admin@hospyflow.com' },
    });

    if (!existingAdmin) {
        // Create default plan
        const defaultPlan = await prisma.plan.create({
            data: {
                name: 'Basic',
                price: 0,
                billingCycle: BillingCycle.MONTHLY,
                maxUsers: 5,
                maxRooms: 10,
                features: ['basic'],
                isActive: true,
            },
        });

        // Create default tenant
        const defaultTenant = await prisma.tenant.create({
            data: {
                name: 'HospyFlow Demo',
                subdomain: 'demo',
                planId: defaultPlan.id,
                status: TenantStatus.ACTIVE,
            },
        });

        // Create SaaS Admin user
        await prisma.user.create({
            data: {
                name: 'SaaS Admin',
                email: 'admin@hospyflow.com',
                mobile: '1234567890',
                password: hashedPassword,
                role: UserRole.SAAS_ADMIN,
                status: UserStatus.ACTIVE,
                // tenantId: defaultTenant.id, // SaaS Admin should be global (null)
            },
        });

        console.log('Seed completed: Created admin@hospyflow.com / admin123');
    } else {
        console.log('Seed skipped: Admin user already exists');
    }

    // --- Users from Frontend Mocks ---
    const defaultTenant = await prisma.tenant.findUnique({ where: { subdomain: 'demo' } });
    if (defaultTenant) {
        const password = await bcrypt.hash('password123', 10);

        const users = [
            { name: 'Carlos Gerente', email: 'admin@hotel.com', mobile: '11999990001', role: UserRole.ADMIN },
            { name: 'Ana Recepção', email: 'recepcao@hotel.com', mobile: '11999990002', role: UserRole.RECEPTION },
            { name: 'Matheus Silva', email: 'staff@hotel.com', mobile: '11999990003', role: UserRole.STAFF },
            { name: 'Ricardo Hóspede', email: 'hospede@gmail.com', mobile: '11999990004', role: UserRole.GUEST, whatsapp: '11999999999' },
            { name: 'Admin SaaS', email: 'saas@hospyflow.com', mobile: '11999990005', role: UserRole.SAAS_ADMIN }
        ];

        for (const u of users) {
            const exists = await prisma.user.findFirst({ where: { email: u.email } });
            if (!exists) {
                await prisma.user.create({
                    data: {
                        name: u.name,
                        email: u.email,
                        mobile: u.mobile,
                        password,
                        role: u.role,
                        tenantId: u.role === UserRole.SAAS_ADMIN ? null : defaultTenant.id,
                        status: UserStatus.ACTIVE,
                        whatsapp: u.whatsapp
                    }
                });
                console.log(`Created user: ${u.name}`);
            }
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
