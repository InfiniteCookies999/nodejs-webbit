module.exports = (sequalize, DataTypes) => {
  const PostMedia = sequalize.define('PostMedia', {
    file: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true
    }
  });
  PostMedia.associate = (db) => {
    PostMedia.belongsTo(db.Post);
  }
  return PostMedia;
};