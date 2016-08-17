'use strict';
module.exports = function(sequelize, DataTypes) {
  var Announcement = sequelize.define('Announcement', {
    release_date: DataTypes.DATE,
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Announcement;
};