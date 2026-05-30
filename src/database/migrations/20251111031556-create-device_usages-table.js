"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("device_usages", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      device_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "devices",
          key: "id",
        },
      },
      usage_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      usage_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      estimated_kwh: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("device_usages");
  },
};
