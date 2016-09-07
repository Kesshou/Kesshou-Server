'use strict';
module.exports = function(sequelize, DataTypes) {
  var Calc = sequelize.define('Calc', {
    date: DataTypes.DATE,
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Calc;
};