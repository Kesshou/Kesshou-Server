'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('responses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      article_id: {
        type: Sequelize.INTEGER
      },
      sort: {
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.STRING
      },
      hidden: {
        type: Sequelize.BOOLEAN
      },
      date: {
        type: Sequelize.DATE
      },
      memid: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('responses');
  }
};
