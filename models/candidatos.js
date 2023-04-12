const Sequelize = require('sequelize');
const sequelize = require('../context/appContext');

const Candidatos = sequelize.define('candidatos', {
    id: {
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
    foto:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    estado:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
});

module.exports = Candidatos;