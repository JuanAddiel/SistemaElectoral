const Sequelize = require('sequelize');
const sequelize = require('../context/appContext');

const Partidos = sequelize.define('partidos', {
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
    descripcion:{
        type: Sequelize.STRING,
        allowNull: false
    },
    logo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    estado:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
});

module.exports = Partidos;