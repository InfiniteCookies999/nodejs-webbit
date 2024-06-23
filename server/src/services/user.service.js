const { HttpError } = require('../middleware');
const db = require('../models')
const bcrypt = require('bcryptjs');

class UserService {
    
  async getUserByEmail(email) {
    return await db.User.findOne({
      where: { email: email },
      attributes: { exclude: ['password'] }
    });
  }

  async getUserByUsername(username) {
    return await db.User.findOne({
      where: { username: username },
      attributes: { exclude: ['password'] }
    });
  }

  async getUserById(id) {
    return await db.User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }

  async updateEmail(id, email, password) {
    const user = await db.User.findByPk(id);
    const hashedPassword = user.password;
    if (!(await bcrypt.compare(password, hashedPassword))) {
      throw new HttpError("Invalid password", 401);
    }
    user.email = email;
    await user.save();
  }

  async updatePassword(id, newPassword, password) {
    const user = await db.User.findByPk(id);
    const hashedPassword = user.password;
    if (!(await bcrypt.compare(password, hashedPassword))) {
      throw new HttpError("Invalid password", 401);
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();
  }

  async registerUser(email, username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await db.User.create({
      email: email,
      emailVerified: false,
      username: username,
      postKarma: 0,
      commentKarma: 0,
      password: hashedPassword,
      gender: "Not-Say"
    });
  }

  async checkUserCredentials(usernameOrEmail, password, isEmail) {
      
    // First check to make sure that there exists a username or an email for
    // the given usernameOrEmail.
    let user = isEmail ? await db.User.findOne({ where: { email: usernameOrEmail } })
                       : await db.User.findOne({ where: { username: usernameOrEmail } });
    
    if (!user) return false;

    const hashedPassword = user.password;
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = new UserService();