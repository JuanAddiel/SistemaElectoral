const Sequelize = require("sequelize");
const path = require("path");

//Aqui puedes cambiar, para lo cualquier Gestor de base de datos que quieres usar.
//En este caso usamos MySQL
const sequelize = new Sequelize("EleccionesApp", "root", "1234", {
    dialect: "mysql",
    host: "localhost",
    port: 3306,
  });

module.exports = sequelize;