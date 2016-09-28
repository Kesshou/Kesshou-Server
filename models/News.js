'use strict';
module.exports = function(sequelize, DataTypes) {
  var News = sequelize.define('News', {
    key: DataTypes.INTEGER,
    title: DataTypes.STRING,
    date: DataTypes.STRING,
    body: DataTypes.STRING,
    linked: DataTypes.STRING,
    author: DataTypes.STRING,
    lifttime: DataTypes.STRING,
    sort: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'news'
  });
  return News;
};
