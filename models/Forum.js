'use strict';
module.exports = function(sequelize, DataTypes) {
  var Forum = sequelize.define('Forum', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'forum'
  });
  return Forum;
};
