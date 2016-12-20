'use strict';
module.exports = function(sequelize, DataTypes) {
  var track = sequelize.define('track', {
    sort: DataTypes.INTEGER,
    track_id: DataTypes.INTEGER,
    memid: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'track'
  });
  return track;
};
