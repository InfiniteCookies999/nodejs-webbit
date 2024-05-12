module.exports = (sequalize, DataTypes) => {
  const User = sequalize.define('User', {
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    profileURI: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    postKarma: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commentKarma: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    joinDate: {
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
  User.associate = (db) => {
    sequalize.define("CommentLikes");
    sequalize.define("CommentDislikes");
    sequalize.define("PostLikes");
    sequalize.define("PostDislikes");
    User.hasMany(db.Post);
    User.hasMany(db.Comment);
    User.belongsToMany(db.Comment, { through: "CommentLikes", as: "commentLikes" });
    User.belongsToMany(db.Comment, { through: "CommentDislikes", as: "commentDislikes" });
    User.belongsToMany(db.Post, { through: "PostLikes", as: "postLikes" });
    User.belongsToMany(db.Post, { through: "PostDislikes", as: "postDislikes" });
  };
  return User;
}