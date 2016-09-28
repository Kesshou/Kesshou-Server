'use strict';
module.exports = function(sequelize, DataTypes) {
  var School_qa = sequelize.define('school_qa', {
    question: DataTypes.STRING,
    answear: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'school_qa'
  });
  return School_qa;
};
