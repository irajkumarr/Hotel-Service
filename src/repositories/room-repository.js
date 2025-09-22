const CrudRepository = require("./crud-repository");
const { prisma } = require("../config");

class RoomRepository extends CrudRepository {
  constructor() {
    super(prisma.room);
  }

  async getAllRooms(filter, sort) {
    return await this.model.findMany({
      // where: { filter, deletedAt: null },
      where: filter,
      orderBy: sort,
      include: {
        roomCategory: true,
        hotel: true,
      },
    });
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
