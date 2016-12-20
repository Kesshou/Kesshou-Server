'use strict';
module.exports = function(sequelize, DataTypes) {
    var News_collection = sequelize.define('News_collection', {
        student_id: DataTypes.INTEGER,
        news_id: DataTypes.STRING,
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        },
        tableName: 'news_collections'
    });
    return News_collection;
};
