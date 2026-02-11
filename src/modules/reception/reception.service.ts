import { UserRole, UserStatus, RoomStatus } from '@prisma/client';
import prisma from '../../shared/prisma';
import { AppError } from '../../shared/errors';
import bcrypt from 'bcrypt';

export class ReceptionService {
    async checkIn(data: any, tenantId: string) {
        const { name, mobile, cpf, roomId, guestCount, checkinDate, checkoutDate, email } = data;

        // Validate Room availability
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room || room.tenantId !== tenantId) {
            throw new AppError('Room not found', 404);
        }

        // Allow check-in if room is AVAILABLE or DIRTY (maybe allow forcing? strict for now)
        if (room.status !== RoomStatus.AVAILABLE && room.status !== RoomStatus.DIRTY) {
            // Maybe strict: only AVAILABLE.
            if (room.status === RoomStatus.OCCUPIED) throw new AppError('Room is occupied', 400);
        }

        // Default password is CPF (stripped)
        const password = cpf ? cpf.replace(/\D/g, '') : mobile.replace(/\D/g, '');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate email if not provided
        const guestEmail = email || `guest_${cpf ? cpf.replace(/\D/g, '') : mobile.replace(/\D/g, '')}@${tenantId}.local`;

        const guest = await prisma.user.create({
            data: {
                name,
                email: guestEmail,
                mobile,
                password: hashedPassword,
                role: UserRole.GUEST,
                status: UserStatus.ACTIVE,
                tenantId,
                cpf,
                roomId,
                guestCount: Number(guestCount),
                checkinDate: new Date(checkinDate),
                checkoutDate: new Date(checkoutDate),
            }
        });

        // Update Room Status
        await prisma.room.update({
            where: { id: roomId },
            data: { status: RoomStatus.OCCUPIED },
        });

        const { password: _, ...userWithoutPassword } = guest;
        return userWithoutPassword;
    }

    async checkOut(guestId: string, tenantId: string) {
        const guest = await prisma.user.findFirst({
            where: { id: guestId, tenantId, role: UserRole.GUEST },
        });

        if (!guest) throw new AppError('Guest not found', 404);

        // Update Room Status -> DIRTY
        if (guest.roomId) {
            await prisma.room.update({
                where: { id: guest.roomId },
                data: { status: RoomStatus.DIRTY },
            });
        }

        // Deactivate Guest and unlink room
        return prisma.user.update({
            where: { id: guestId },
            data: {
                roomId: null,
                status: UserStatus.INACTIVE,
            },
        });
    }
}
