'use strict';
module.exports = function(sequelize, DataTypes) {
  var QandA = sequelize.define('QandA', {
    Q: DataTypes.STRING,
    A: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return QandA;
};