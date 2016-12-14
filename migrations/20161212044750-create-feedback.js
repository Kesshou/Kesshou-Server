'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Feedbacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      feedClass: {
        type: Sequelize.STRING
      },
      commit: {
        type: Sequelize.STRING
      },
      stu_id: {
        type: Sequelize.INTEGER
      },
      checked: {
        type: Sequelize.BOOLEAN
      },
      system: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Feedbacks');
  }
};
