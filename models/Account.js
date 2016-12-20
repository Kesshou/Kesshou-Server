'use strict';
module.exports = function(sequelize, DataTypes) {
  var Account = sequelize.define('Account', {
    email: DataTypes.STRING,
    pwd: DataTypes.STRING,
    group_id: DataTypes.INTEGER,
    school_account: DataTypes.STRING,
    school_pwd: DataTypes.STRING,
    name: DataTypes.STRING,
    nick: DataTypes.STRING,
    class: DataTypes.STRING,
    finish_year: DataTypes.INTEGER,
    fcm_token: DataTypes.STRING(1000),
    is_noti: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'accounts'
  });
  return Account;
};
