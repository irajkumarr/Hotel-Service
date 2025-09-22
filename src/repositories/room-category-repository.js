const CrudRepository = require("./crud-repository");
const { prisma } = require("../config");

class RoomCategoryRepository extends CrudRepository {
  constructor() {
    super(prisma.roomCategory);
  }
}

module.exports = RoomCategoryRepository;
