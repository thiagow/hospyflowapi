import 'dotenv/config';
import { PrismaClient, UserRole, UserStatus, TenantStatus, BillingCycle } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
                role: UserRole.SAAS_ADMIN, // Ensure this role exists in schema
                status: UserStatus.ACTIVE,
                tenantId: defaultTenant.id, // Associate with tenant
            },
        });

        console.log('Seed completed: Created admin@hospyflow.com / admin123');
    } else {
        console.log('Seed skipped: Admin user already exists');
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
