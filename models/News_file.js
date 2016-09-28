'use strict';
module.exports = function(sequelize, DataTypes) {
    var News_file = sequelize.define('news_file', {
        news_key: DataTypes.INTEGER,
        type: DataTypes.STRING,
        file_name: DataTypes.STRING,
        file_src: DataTypes.STRING,
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        },
        tableName: 'news_files'
    });
    return News_file;
};
