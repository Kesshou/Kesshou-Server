'use strict';
module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.define('News_collection', {
        student_id: DataTypes.INTEGER,
        news_id: DataTypes.STRING,
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return Account;
};
