const CrudRepository = require("./crud-repository");
const { prisma } = require("../config");

class RoomRepository extends CrudRepository {
  constructor() {
    super(prisma.room);
  }

  async getAllRooms(filter, sort, skip, limit) {
    const [rooms, totalCount] = await prisma.$transaction([
      this.model.findMany({
        where: filter,
        orderBy: sort,
        skip,
        take: limit,
        include: {
          roomCategory: true,
          hotel: true,
        },
      }),
      this.model.count({ where: filter }),
    ]);

    return { rooms, totalCount };
  }

  async findByRoomCategoryIdAndDate(roomCategoryId, currentDate) {
    return await this.model.findFirst({
      where: {
        roomCategoryId,
        dateOfAvailability: currentDate,
        deletedAt: null,
      },
    });
  }

  async bulkCreate(rooms) {
    return await this.model.createMany({
      data: rooms,
      skipDuplicates: true,
    });
  }

  async findLatestDatesForAllCategories() {
    const results = await this.model.groupBy({
      by: ["roomCategoryId"],
      where: {
        deletedAt: null,
      },
      _max: {
        dateOfAvailability: true,
      },
    });

    return results.map((result) => ({
      roomCategoryId: result.roomCategoryId,
      latestDate: result._max.dateOfAvailability,
    }));
  }
}

module.exports = RoomRepository;
