/*
  Warnings:

  - A unique constraint covering the columns `[booking_id]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."rooms" ADD COLUMN     "booking_id" INTEGER,
ADD COLUMN     "is_booked" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "rooms_booking_id_key" ON "public"."rooms"("booking_id");
