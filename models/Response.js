'use strict';
module.exports = function(sequelize, DataTypes) {
  var response = sequelize.define('response', {
    article_id: DataTypes.INTEGER,
    sort: DataTypes.INTEGER,
    content: DataTypes.STRING,
    date: DataTypes.DATE,
    memid: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'response'
  });
  return response;
};
