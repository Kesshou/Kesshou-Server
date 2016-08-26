'use strict';
module.exports = function(sequelize, DataTypes) {
  var userForum = sequelize.define('userForum', {
    id = DataTypes.INTEGER,
    post = DataTypes.STRING,
    collect = DataTypes.STRING,
    postCache = DataTypes.STRING,
    board = DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return userForum;
};
