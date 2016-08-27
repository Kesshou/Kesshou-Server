'use strict';
module.exports = function(sequelize, DataTypes) {
  var Account = sequelize.define('Account', {
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
    }
  });
  return Account;
};
