'use strict';
module.exports = function(sequelize, DataTypes) {
  var forumList = sequelize.define('forumList', {
    id = DataTypes.INTEGER,
    type = DataTypes.INTEGER,
    board = DataTypes.INTEGER,
    name = DataTypes.STRING,
    like = DataTypes.INTEGER,
    message = DataTypes.INTEGER,
    master = DataTypes.INTEGER,
    time = DataTypes.DATE,
    content = DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return forumList;
};
