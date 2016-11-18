'use strict';
module.exports = function(sequelize, DataTypes) {
  var article = sequelize.define('article', {
    forum_id: DataTypes.INTEGER,
    sort: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    hidden: DataTypes.BOOLEAN,
    date: DataTypes.DATE,
    memid: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'article'
  });
  return article;
};
