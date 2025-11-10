"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      packageId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Packages",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quotedPrice: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.ENUM("money", "miles", "mixed"),
        allowNull: false
      },
      moneyPaid: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      milesUsed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "confirmed", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Bookings");
  },
};
