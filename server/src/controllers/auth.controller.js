const { UserService } = require('../services');

class AuthController {

  async getSessionUser(req, res, next) {
   const isLoggedIn = req.session.user !== undefined;
    res.json({
    "loggedIn": isLoggedIn,
    "user": isLoggedIn ? await UserService.getUserById(req.session.user.id) : undefined
   });
  }

  async updateEmail(req, res, next) {
    try {
      await UserService.
        updateEmail(req.session.user.id, req.body.email, req.body.password);
      res.json({ "status": "success" });
    } catch (error) {
      if (error.message === "Invalid password") {
        res.json({ "status": "wrong password" });
      } else if (error.message === "Email taken") {
        res.json({ "status": "email taken" });
      } else {
        next(error);
      }
    }
  }

  async updatePassword(req, res, next) {
    try {
    
      await UserService.
        updatePassword(req.session.user.id, req.body.newPassword, req.body.currentPassword);
    
      delete req.session.user;
  
      res.json({ "status": "success" });
    
    } catch (error) {
      if (error.message === "Invalid password") {
        res.json({ "status": "wrong password" });
      } else {
        next(error);
      }
    }
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

  logout(req, res, next) {
    delete req.session.user;
    res.end();
  }
}

module.exports = new AuthController();