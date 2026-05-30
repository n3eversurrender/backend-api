"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("devices", "household_id", {
      type: Sequelize.BIGINT,
      allowNull: false,
      after: "user_id",
      references: {
        model: "households",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("devices", "household_id");
  },
};
