module.exports = (sequalize, DataTypes) => {
  const Post = sequalize.define('Post', {
    title: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT('medium'),
      allowNull: false
    }
  });
  Post.associate = (db) => {
    Post.belongsTo(db.SubWebbit);
    Post.belongsTo(db.User);
    Post.hasMany(db.PostMedia);
    Post.hasMany(db.Comment);
  }
  return Post;
};