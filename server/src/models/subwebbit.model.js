module.exports = (sequalize, DataTypes) => {
  const SubWebbit = sequalize.define('SubWebbit', {
    name: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.ENUM('public', 'restricted', 'private')
    },
    adultRated: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false 
    },
    bannerFile: {
      type: DataTypes.STRING(200)
    },
    backgroundFile: {
      type: DataTypes.STRING(200)
    },
    communityFile: {
      type: DataTypes.STRING(200)
    }
  });
  SubWebbit.associate = (db) => {
    sequalize.define('Moderators');
    sequalize.define('AuthorizedUsers');
    SubWebbit.belongsToMany(db.User,
      { 
        through: 'Moderators',
        as: 'mod',
        onDelete: 'cascade'
      });
    SubWebbit.belongsToMany(db.User,
      {
        through: 'AuthorizedUsers',
        as: 'authorizedUser',
        onDelete: 'cascade'
      });
    SubWebbit.hasMany(db.Post, { onDelete: 'cascade' });
  };
  return SubWebbit;
}