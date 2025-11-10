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
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        destination: DataTypes.STRING,
        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE,
        basePrice: DataTypes.DECIMAL,
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
