'use strict';
module.exports = function(sequelize, DataTypes) {
  var School_qa = sequelize.define('School_qa', {
    question: DataTypes.STRING,
    answear: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return School_qa;
};