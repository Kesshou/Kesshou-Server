'use strict';
module.exports = function(sequelize, DataTypes) {
  var forumMessage = sequelize.define('forumMessage', {
    forumId = DataTypes.INTEGER,
    forumId = DataTypes.INTEGER,
    floor = DataTypes.INTEGER,
    content = DataTypes.STRING,
    time = DataTypes.DATE,
    like = DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return forumMessage;
};
