'use strict';
const { Model, DataTypes } = require("sequelize");
class WalletTransaction extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM('deposit', 'purchase', 'earning', 'refund'),
          allowNull: false,
        },
        currency: {
          type: DataTypes.ENUM('money', 'miles'),
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
        }
      },
      {
        sequelize,
        modelName: "WalletTransaction",
        tableName: "WalletTransactions",
      },
    )
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}

module.exports = WalletTransaction;

