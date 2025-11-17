"use strict";

const { Model, DataTypes } = require("sequelize");

class Booking extends Model {
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
        packageId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        quotedPrice: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },
        paymentMethod: {
          type: DataTypes.ENUM("money", "miles", "mixed"),
          allowNull: false,
        },
        moneyPaid: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },
        milesUsed: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Booking",
        tableName: "Bookings",
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    this.belongsTo(models.Package, {
      foreignKey: "packageId",
      as: "package",
    });
    this.hasMany(models.WalletTransaction, {
      foreignKey: "bookingId",
      as: "walletTransactions",
    });
  }
}

module.exports = Booking;
