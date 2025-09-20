const CrudRepository = require("./crud-repository");
const { prisma } = require("../config");

class HotelRepository extends CrudRepository {
  constructor() {
    super(prisma.hotel);
  }
}

module.exports = HotelRepository;
