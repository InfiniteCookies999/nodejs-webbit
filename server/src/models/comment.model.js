module.exports = (sequalize, DataTypes) => {
  const Comment = sequalize.define('Comment', {
    content: {
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
  Comment.associate = (db) => {
    sequalize.define("CommentLikes");
    sequalize.define("CommentDislikes");
    Comment.belongsToMany(db.User, { through: "CommentLikes", as: "usersThatLiked" });
    Comment.belongsToMany(db.User, { through: "CommentDislikes", as: "usersThatDisliked" });
    Comment.belongsTo(db.Post, { onDelete: 'CASCADE' });
    Comment.belongsTo(db.Comment, { as:  "reply" });
    Comment.belongsTo(db.SubWebbit, { onDelete: 'CASCADE' });
    Comment.belongsTo(db.User);
  }
  return Comment;
};