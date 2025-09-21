const { AppError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create({ data });
  }

  async getAll() {
    return await this.model.findMany({
      where: { deletedAt: null },
    });
  }

  async get(id) {
    const response = await this.model.findUnique({
      where: {
        id,
        deletedAt: null,
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

  async update(id, data) {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await this.model.delete({
      where: { id },
    });
  }

  async softDelete(id) {
    return await this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id) {
    return await this.model.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}

module.exports = CrudRepository;
