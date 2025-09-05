'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tickets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('Abierto', 'En Proceso', 'Cerrado', 'Resuelto'),
        defaultValue: 'Abierto'
      },
      subject: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      priority: {
        type: Sequelize.ENUM('Baja', 'Media', 'Alta', 'Crítica'),
        defaultValue: 'Media'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW
      }
    });

    // Índices
    await queryInterface.addIndex('tickets', ['status'], { name: 'idx_tickets_status' });
    await queryInterface.addIndex('tickets', ['priority'], { name: 'idx_tickets_priority' });
    await queryInterface.addIndex('tickets', ['category'], { name: 'idx_tickets_category' });
    await queryInterface.addIndex('tickets', ['user_id'], { name: 'idx_tickets_user_id' });
    await queryInterface.addIndex('tickets', ['created_at'], { name: 'idx_tickets_created_at' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tickets');
  }
};