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
    Comment.belongsTo(db.Post, { onDelete: 'CASCADE' });
    Comment.belongsTo(db.Comment, { as:  "reply" });
    Comment.belongsTo(db.SubWebbit, { onDelete: 'CASCADE' });
    Comment.belongsTo(db.User);
  }
  return Comment;
};