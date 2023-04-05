const Sequelize = require('sequelize');
const sequelize = require('../context/appContext');

const Usuarios = sequelize.define('usuarios', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    apellido: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    nombreUser:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    estado:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
});

module.exports = Usuarios;