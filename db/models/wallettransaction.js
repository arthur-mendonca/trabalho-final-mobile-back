'use strict';
const { Model, DataTypes } = require("sequelize");
class WalletTransaction extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        userId: {
          type: DataTypes.UUID
        },
        type: {
          type: DataTypes.ENUM('deposit', 'purchase', 'earning', 'refund')
        },
        currency: {
          type: DataTypes.ENUM('money', 'miles')
        },
        amount: {
          type: DataTypes.DECIMAL
        },
        description: {
          type: DataTypes.STRING
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

