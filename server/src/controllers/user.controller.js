const { HttpError } = require('../middleware');
const { UserService, FileUploaderService } = require('../services');

class UserController {
  
  async getUserByUsername(req, res, next) {
    try {

      const user = await UserService.getUserByUsername(req.params.username);
      if (!user) {
        throw new HttpError("User does not exist");
      }

      res.json(user);

    } catch (error) {
      next(error);
    }
  }

  async updateGender(req, res, next) {
    try {

      const { gender } = req.body;
      
      const user = await UserService.getUserById(req.session.user.id);
      user.gender = gender;
      await user.save();

      res.end();

    } catch (error) {
      next(error);
    }
  }

  async updateProfilePicture(req, res, next) {
    try {

      const user = await UserService.getUserById(req.session.user.id);

      const file = FileUploaderService
          .moveFileAndGenRandomName(user.id,
                                    req.file,
                                    'static/uploads/users/profile_pictures',
                                    user.profileFile);
      user.profileFile = file;
      await user.save();
      
      res.end();

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();