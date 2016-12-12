'use strict';
module.exports = function(sequelize, DataTypes) {
  var Feedback = sequelize.define('Feedback', {
    feedClass: DataTypes.STRING,
    commit: DataTypes.STRING,
    stu_id: DataTypes.INTEGER,
    checked: DataTypes.BOOLEAN,
    system: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Feedback;
};
