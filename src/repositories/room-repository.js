const CrudRepository = require("./crud-repository");
const { prisma } = require("../config");

class RoomRepository extends CrudRepository {
  constructor() {
    super(prisma.room);
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
}

module.exports = RoomRepository;
