const CrudRepository = require("./crud-repository");
const { prisma } = require("../config");
const { AppError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

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

  async getRoom(id) {
    const response = await this.model.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        roomCategory: true,
        hotel: true,
      },
    });

    if (!response) {
      throw new AppError(
        "Not able to find the resource",
        StatusCodes.NOT_FOUND
      );
    }

    return response;
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
