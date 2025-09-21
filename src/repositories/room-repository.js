const CrudRepository = require("./crud-repository");
const { prisma } = require("../config");

class RoomRepository extends CrudRepository {
  constructor() {
    super(prisma.room);
  }
}

module.exports = RoomRepository;
