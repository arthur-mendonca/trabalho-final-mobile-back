"use strict";

const { Model, DataTypes } = require("sequelize");

class Package extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        destination: {
          type: DataTypes.STRING,
          allowNull: false
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false
        },
        basePrice: {
          type: DataTypes.DECIMAL,
          allowNull: false
        },
        milesToEarn: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        transfer: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        hotel: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        tickets: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        img: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: "Package",
        tableName: "Packages",
      },
    );
  }

  static associate(models) {
    this.hasMany(models.Booking, {
      foreignKey: "packageId",
      as: "bookings",
    });
  }
}

module.exports = Package;
