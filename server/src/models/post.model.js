module.exports = (sequalize, DataTypes) => {
  const Post = sequalize.define('Post', {
    title: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT('medium'),
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dislikes: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  Post.associate = (db) => {
    sequalize.define("PostLikes");
    sequalize.define("PostDislikes");
    Post.belongsToMany(db.User, { through: "PostLikes", as: "usersThatLiked" });
    Post.belongsToMany(db.User, { through: "PostDislikes", as: "usersThatDisliked" });
    Post.belongsTo(db.SubWebbit);
    Post.belongsTo(db.User);
    Post.hasMany(db.PostMedia);
    Post.hasMany(db.Comment);
  }
  return Post;
};