const db = require('../models');

class SubWebbitService {

  async createSubWebbit(session, dto) {
    const dateCreated = new Date();
    const subWebbit = await db.SubWebbit.create({
      name: dto.name,
      type: dto.type,
      adultRated: dto.adultRated,
      description: "",
      dateCreated: dateCreated
    });
    // Setting the user who created the sub-webbit as a
    // moderator.
    await subWebbit.addMod(session.user.id);
  }

  async updateSubWebbit(name, session, cb) {
    let subWebbit = await this.getSubWebbitByName(name);
    if (subWebbit) {
      const userId = session.user.id;
      if (!(await subWebbit.hasMod(userId))) {
        let error = new Error("User is not a moderator");
        error.statusCode = 401;
        throw error;
      }

      cb(subWebbit);
      await subWebbit.save();
    } else{
      let error = new Error("SubWebbit doesn't exist");
      error.statusCode = 404;
      throw error;
    }
  }

  async getSubWebbitByName(name) {
    return await db.SubWebbit.findOne({ where: { name: name } });
  }
}

module.exports = new SubWebbitService();