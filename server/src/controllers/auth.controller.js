const { HttpError } = require('../middleware');
const { UserService } = require('../services');

class AuthController {

  isLoggedIn(req, res, next) {
    res.json({ "loggedIn": req.session.user !== undefined });
  }

  async doesEmailExist(req, res, next) {
    try {
      const user = await UserService.getUserByEmail(req.params.email);
      res.json({ "exists": user !== null })
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    const { email, username, password } = req.body;

    try {
        if (await UserService.getUserByEmail(email)) {
          return res.json({ "status": "email taken" });
        }
        if (await UserService.getUserByUsername(username)) {
          return res.json({ "status": "username taken" });
        }

        const user = await UserService.registerUser(email, username, password);
        req.session.user = {
          id: user.id
        };

        res.json({ "status": "success" });
        
      } catch (error) {
        next(error);
      }
  }

  async updateGender(req, res, next) {
    try {

      const { gender } = req.body;
      
      if (!req.session.user) {
        throw new HttpError("Not logged in", 401);
      }

      const user = await UserService.getUserById(req.session.user.id);
      user.gender = gender;
      await user.save();

      res.end();

    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    const { emailOrUsername, password } = req.body;

    try {
      const isEmail = emailOrUsername.includes("@");
      if (await UserService.checkUserCredentials(emailOrUsername, password, isEmail)) {

        const user = isEmail ? await UserService.getUserByEmail(emailOrUsername)
                             : await UserService.getUserByUsername(emailOrUsername);
        
        req.session.user = {
          id: user.id
        };

        return res.json({ "status": "success" });
      } else {
        return res.json({ "status": "invalid credentials" });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();