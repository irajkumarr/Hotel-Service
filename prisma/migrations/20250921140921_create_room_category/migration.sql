-- CreateEnum
CREATE TYPE "public"."RoomType" AS ENUM ('SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'FAMILY');

-- CreateTable
CREATE TABLE "public"."room_categories" (
    "id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "room_type" "public"."RoomType" NOT NULL,
    "room_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "room_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."room_categories" ADD CONSTRAINT "room_categories_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
