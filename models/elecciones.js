const Sequelize = require('sequelize');
const sequelize = require('../context/appContext');

const Elecciones = sequelize.define('elecciones', {
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
    fechaRealizacion:{
        type: Sequelize.STRING,
        allowNull: false
    },
    estado:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
});

module.exports= Elecciones;