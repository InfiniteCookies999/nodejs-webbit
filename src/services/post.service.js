const db = require('../models');
const { HttpError } = require('../middleware');
const SubWebbitService = require('./subwebbit.service');

class PostService {
  async createPost(subName, session, dto) {
    const subWebbit = await SubWebbitService.getSubWebbitByName(subName);
    if (!subWebbit)
      throw new HttpError("SubWebbit doesn't exist", 404);
    


  }
}