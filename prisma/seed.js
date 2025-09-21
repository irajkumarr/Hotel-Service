const { PrismaClient, RoomType } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Seed Hotels
  const hotels = await prisma.hotel.createMany({
    data: [
      {
        name: "Hotel Everest",
        address: "Thamel, Kathmandu",
        location: "Kathmandu, Nepal",
      },
      {
        name: "Pokhara Lakeside Inn",
        address: "Lakeside Road",
        location: "Pokhara, Nepal",
      },
      {
        name: "Chitwan Jungle Lodge",
        address: "Sauraha",
        location: "Chitwan, Nepal",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Hotels seeded");

  // Fetch hotels to get their IDs
  const hotelList = await prisma.hotel.findMany();

  // Seed Room Categories
  const roomCategories = await prisma.roomCategory.createMany({
    data: [
      {
        hotelId: hotelList[0].id,
        price: 3000,
        roomType: RoomType.SINGLE,
        roomCount: 10,
      },
      {
        hotelId: hotelList[0].id,
        price: 5000,
        roomType: RoomType.DOUBLE,
        roomCount: 8,
      },
      {
        hotelId: hotelList[0].id,
        price: 12000,
        roomType: RoomType.SUITE,
        roomCount: 3,
      },
      {
        hotelId: hotelList[1].id,
        price: 4000,
        roomType: RoomType.SINGLE,
        roomCount: 12,
      },
      {
        hotelId: hotelList[1].id,
        price: 7000,
        roomType: RoomType.DELUXE,
        roomCount: 5,
      },
      {
        hotelId: hotelList[1].id,
        price: 15000,
        roomType: RoomType.FAMILY,
        roomCount: 2,
      },
      {
        hotelId: hotelList[2].id,
        price: 3500,
        roomType: RoomType.SINGLE,
        roomCount: 15,
      },
      {
        hotelId: hotelList[2].id,
        price: 6500,
        roomType: RoomType.DOUBLE,
        roomCount: 7,
      },
      {
        hotelId: hotelList[2].id,
        price: 14000,
        roomType: RoomType.SUITE,
        roomCount: 4,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Room categories seeded");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
