'use strict';
module.exports = function(sequelize, DataTypes) {
  var Setting = sequelize.define('setting', {
    item: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'setting'
  });
  return Setting;
};
