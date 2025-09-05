module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('Abierto', 'En Proceso', 'Cerrado', 'Resuelto'),
      defaultValue: 'Abierto'
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('Baja', 'Media', 'Alta', 'Crítica'),
      defaultValue: 'Media'
    },
    description: {
      type: DataTypes.TEXT
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'tickets',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });

  Ticket.associate = function(models) {
    Ticket.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User',
      onDelete: 'CASCADE'
    });
  };

  return Ticket;
};