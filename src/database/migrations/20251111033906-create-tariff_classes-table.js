"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tariff_classes", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false, // contoh: "R-1/TR 900 VA"
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true, // contoh: "R" (rumah tangga)
      },
      voltage: {
        type: Sequelize.STRING,
        allowNull: true, // contoh: "TR" (tegangan rendah)
      },
      capacity_va: {
        type: Sequelize.INTEGER,
        allowNull: true, // contoh: 900 (VA)
      },
      price_per_kwh: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false, // contoh: 1352.00 (Rp/kWh)
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
    await queryInterface.dropTable("tariff_classes");
  },
};
