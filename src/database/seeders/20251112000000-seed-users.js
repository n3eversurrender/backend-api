"use strict";

const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const tableName = "users";

module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash("12345678", saltRounds);

    await queryInterface.bulkInsert(tableName, [
      {
        name: "Administrator",
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: 1,
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        name: "Default User",
        username: "user",
        email: "user@example.com",
        password: hashedPassword,
        role: 0,
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, {
      username: {
        [Op.in]: ["admin", "user"],
      },
    });
  },
};
