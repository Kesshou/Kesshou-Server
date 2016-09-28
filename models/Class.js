'use strict';
module.exports = function(sequelize, DataTypes) {
  var Class = sequelize.define('class', {
    class_name: DataTypes.STRING,
    graduated_year: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Class;
};
