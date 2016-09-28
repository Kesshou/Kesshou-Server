'use strict';
module.exports = function(sequelize, DataTypes) {
  var Grade_table = sequelize.define('Grade_table', {
    name: DataTypes.STRING,
    finish_year: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'grade_tables'
  });
  return Grade_table;
};
