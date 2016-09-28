'use strict';
module.exports = function(sequelize, DataTypes) {
  var Food_commit = sequelize.define('food_commit', {
    author_id: DataTypes.INTEGER,
    map_id: DataTypes.INTEGER,
    content: DataTypes.STRING,
    score: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'food_commits'
  });
  return Food_commit;
};
