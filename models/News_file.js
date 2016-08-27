'use strict';
module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.define('News_file', {
        news_key: DataTypes.INTEGER,
        type: DataTypes.STRING,
        file_name: DataTypes.INTEGER,
        file_src: DataTypes.STRING,
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return Account;
};
