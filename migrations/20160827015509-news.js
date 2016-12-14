'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('news', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            key: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING
            },
            date: {
                allowNull: false,
                type: Sequelize.STRING
            },
            body: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            linked: {
                allowNull: false,
                type: Sequelize.STRING
            },
            author: {
                allowNull: false,
                type: Sequelize.STRING
            },
            lifttime: {
                allowNull: false,
                type: Sequelize.STRING
            },
            sort: {
                allowNull: false,
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
        return queryInterface.dropTable('news');
    }
};
