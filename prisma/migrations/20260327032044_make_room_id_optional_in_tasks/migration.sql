-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_roomId_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "roomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
