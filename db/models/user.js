'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        githubId: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
        },
        role: {
          type: DataTypes.ENUM('cliente', 'agente'),
          allowNull: false,
          defaultValue: 'cliente',
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        indexes: [
          { unique: true, fields: ['email'] },
          { unique: true, fields: ['githubId'] },
        ],
        hooks: {
          beforeSave: async (user) => {
            if (user.changed('password')) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          },
        },
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Booking, {
      foreignKey: 'userId',
      as: 'bookings',
    });
  }
}

module.exports = User;