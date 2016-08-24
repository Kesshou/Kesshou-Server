'use strict';
module.exports = function(sequelize, DataTypes) {
  var Setting = sequelize.define('Setting', {
    item: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Setting;
};