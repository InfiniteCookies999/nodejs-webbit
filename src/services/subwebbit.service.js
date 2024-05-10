const db = require('../models');
const { HttpError } = require('../middleware');

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

    // If the subwebbit is not public then moderators should by
    // default be given access to using the subwebbit.
    if (dto.type != 'public') {
      await subWebbit.addAuthorizedUser(session.user.id);
    }
  }

  async updateSubWebbit(name, session, cb) {
    let subWebbit = await this.getSubWebbitByName(name);
    if (!subWebbit)
      throw new HttpError("SubWebbit doesn't exist", 404);
    
    const userId = session.user.id;
    if (!(await subWebbit.hasMod(userId)))
      throw new HttpError("User is not a moderator", 401);

    cb(subWebbit);
    await subWebbit.save();
  }

  async getSubWebbitByName(name) {
    return await db.SubWebbit.findOne({ where: { name: name } });
  }

  async deleteSubwebbitByName(session, name) {
    const subWebbit = await this.getSubWebbitByName(name);
    if (!subWebbit)
      throw new HttpError("SubWebbit doesn't exist", 404);

    if (!await subWebbit.hasMod(session.user.id))
      throw new HttpError("User is not a moderator", 401);

    await subWebbit.destroy();
  }
}

module.exports = new SubWebbitService();