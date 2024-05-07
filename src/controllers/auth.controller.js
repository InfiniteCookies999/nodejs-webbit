const { UserService } = require('../services');

class AuthController {

  async register(req, res, next) {
    const { email, username, password, gender } = req.body;

    try {
        if (await UserService.getUserByEmail(email)) {
          return res.json({ "status": "email taken" });
        }
        if (await UserService.getUserByUsername(username)) {
          return res.json({ "status": "username taken" });
        }

        await UserService.registerUser(email, username, password, gender);

        return res.json({ "status": "success" });
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