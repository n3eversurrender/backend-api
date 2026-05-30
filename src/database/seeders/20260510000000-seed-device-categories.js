"use strict";

const tableName = "device_categories";

module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();

    await queryInterface.bulkInsert(tableName, [
      {
        name: "Air Conditioner (AC)",
        description: "Cooling and heating systems for room temperature control.",
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        name: "Television",
        description: "Entertainment display units.",
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        name: "Refrigerator",
        description: "Kitchen appliance for food preservation.",
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        name: "Washing Machine",
        description: "Appliance used to wash laundry.",
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        name: "Lighting",
        description: "Lamps, bulbs, and other lighting fixtures.",
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        name: "Computer/Laptop",
        description: "Personal computing devices.",
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        name: "Other",
        description: "Miscellaneous electronic devices.",
        created_at: timestamp,
        updated_at: timestamp,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
