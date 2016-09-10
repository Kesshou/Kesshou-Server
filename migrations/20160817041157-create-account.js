'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pwd: {
        allowNull: false,
        type: Sequelize.STRING
      },
      group_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      school_account: {
        type: Sequelize.STRING
      },
      school_pwd: {
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nick: {
        allowNull: false,
        type: Sequelize.STRING
      },
      class: {
        type: Sequelize.STRING
      },
      entranceTime: {
        type: Sequelize.STRING
      },
      finish_year: {
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
    return queryInterface.dropTable('accounts');
  }
};
