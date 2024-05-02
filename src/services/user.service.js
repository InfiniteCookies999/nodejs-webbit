const { User } = require('../models')
const bcrypt = require('bcrypt');

class UserService {
    
  async getUserByEmail(email) {
    return await User.findOne({ where: { email: email } });
  }

  async getUserByUsername(username) {
    return await User.findOne({ where: { username: username } });
  }

  async registerUser(email, username, password, gender) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const joinDate = new Date();
    await User.create({
      email: email,
      email_verified: false,
      username: username,
      join_date: joinDate,
      post_karma: 0,
      comment_karma: 0,
      password: hashedPassword,
      gender: gender
    });
  }

  async checkUserCredentials(usernameOrEmail, password, isEmail) {
      
    // First check to make sure that there exists a username or an email for
    // the given usernameOrEmail.
    let user = isEmail ? await User.findOne({ where: { email: usernameOrEmail } })
                       : await User.findOne({ where: { username: usernameOrEmail } });
    
    if (!user) return false;

    const hashedPassword = user.password;
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = new UserService();