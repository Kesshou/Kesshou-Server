'use strict';
module.exports = function(sequelize, DataTypes) {
  var Subject = sequelize.define('Subject', {
    name: DataTypes.STRING,
    required: DataTypes.BOOLEAN,
    credit: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'subjects'
  });
  return Subject;
};
