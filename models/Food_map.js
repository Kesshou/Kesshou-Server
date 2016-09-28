'use strict';
module.exports = function(sequelize, DataTypes) {
  var Food_map = sequelize.define('food_map', {
    name: DataTypes.STRING,
    content: DataTypes.STRING,
    where: DataTypes.STRING,
    author_id: DataTypes.INTEGER,
    price: DataTypes.STRING,
    enabled: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Food_map;
};