module.exports = (sequalize, DataTypes) => {
  const User = sequalize.define('user', {
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    profile_uri: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    post_karma: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment_karma: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    join_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('Woman', 'Man', 'Non-Binary', 'Not-Say'),
      allowNull: false
    }
  });
  return User;
}