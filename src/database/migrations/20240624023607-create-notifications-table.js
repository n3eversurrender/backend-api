'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'notifications',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
          },
          type: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          notified_user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
          },
          data: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          message: {
            type: Sequelize.TEXT,
            allowNull: true,
            defaultValue: '',
          },
          read_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
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
        },
        { transaction },
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('notifications', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
