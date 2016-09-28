'use strict';
module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('group', {
    name: DataTypes.STRING,
    comment: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Group;
};
