'use strict';
module.exports = function(sequelize, DataTypes) {
  var RelatedLink = sequelize.define('RelatedLink', {
    name: DataTypes.STRING,
    link: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return RelatedLink;
};
