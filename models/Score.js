'use strict';
module.exports = function(sequelize, DataTypes) {
  var Score = sequelize.define('Score', {
    student_id: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    semester: DataTypes.INTEGER,
    value: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Score;
};