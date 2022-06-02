const { DataTypes } = require("sequelize");
const { db } = require("../Utils/database");

const Repair = db.define("repair", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  computerNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
  imgPath: {
    type: DataTypes.STRING,
  },
  userId: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});

module.exports = { Repair };
