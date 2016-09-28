'use strict';
module.exports = function(sequelize, DataTypes) {
  var Class = sequelize.define('Class', {
    class_name: DataTypes.STRING,
    graduated_year: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'classes'
  });
  return Class;
};
