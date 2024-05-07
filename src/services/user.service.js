const db = require('../models')
const bcrypt = require('bcryptjs');

class UserService {
    
  async getUserByEmail(email) {
    return await db.User.findOne({ where: { email: email } });
  }

  async getUserByUsername(username) {
    return await db.User.findOne({ where: { username: username } });
  }

  async registerUser(email, username, password, gender) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const joinDate = new Date();
    await db.User.create({
      email: email,
      emailVerified: false,
      username: username,
      joinDate: joinDate,
      postKarma: 0,
      commentKarma: 0,
      password: hashedPassword,
      gender: gender
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