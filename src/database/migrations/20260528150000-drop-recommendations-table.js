"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable("recommendations");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable("recommendations", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      household_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "households",
          key: "id",
        },
      },
      device_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: "devices",
          key: "id",
        },
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      is_resolved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
};
