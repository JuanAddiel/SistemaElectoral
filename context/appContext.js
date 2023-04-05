const Sequelize = require("sequelize");
const path = require("path");


const sequelize = new Sequelize("EleccionesApp", "root", "1234", {
    dialect: "mysql",
    host: "localhost",
    port: 3306,
  });

module.exports = sequelize;