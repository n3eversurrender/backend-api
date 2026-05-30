"use strict";

const tableName = "tariff_classes";

module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();

    const tariffData = [
      {
        code: "R-1/450 VA",
        type: "Rumah Tangga",
        voltage: "TR",
        capacity_va: 450,
        price_per_kwh: 415.00,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        code: "R-1/900 VA",
        type: "Rumah Tangga",
        voltage: "TR",
        capacity_va: 900,
        price_per_kwh: 605.00,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        code: "R-1/900 VA-RTM",
        type: "Rumah Tangga",
        voltage: "TR",
        capacity_va: 900,
        price_per_kwh: 1352.00,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        code: "R-1/1300 VA",
        type: "Rumah Tangga",
        voltage: "TR",
        capacity_va: 1300,
        price_per_kwh: 1444.70,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        code: "R-1/2200 VA",
        type: "Rumah Tangga",
        voltage: "TR",
        capacity_va: 2200,
        price_per_kwh: 1444.70,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        code: "R-2/3500 VA",
        type: "Rumah Tangga",
        voltage: "TR",
        capacity_va: 3500,
        price_per_kwh: 1699.53,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        code: "R-2/4400 VA",
        type: "Rumah Tangga",
        voltage: "TR",
        capacity_va: 4400,
        price_per_kwh: 1699.53,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        code: "R-2/5500 VA",
        type: "Rumah Tangga",
        voltage: "TR",
        capacity_va: 5500,
        price_per_kwh: 1699.53,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        code: "R-3/6600 VA",
        type: "Rumah Tangga",
        voltage: "TR",
        capacity_va: 6600,
        price_per_kwh: 1699.53,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        code: "R-3/11000 VA",
        type: "Rumah Tangga",
        voltage: "TR",
        capacity_va: 11000,
        price_per_kwh: 1699.53,
        created_at: timestamp,
        updated_at: timestamp,
      },
    ];

    await queryInterface.bulkInsert(tableName, tariffData);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
