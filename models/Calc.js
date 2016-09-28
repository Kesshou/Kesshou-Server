'use strict';
module.exports = function(sequelize, DataTypes) {
  var Calc = sequelize.define('calc', {
    date: DataTypes.DATE,
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'calc'
  });
  return Calc;
};
