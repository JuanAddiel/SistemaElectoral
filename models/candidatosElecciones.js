const Sequelize = require('sequelize');
const sequelize = require('../context/appContext');

const CandidatoEleccion = sequelize.define('candidatoEleccion', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    votos:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = CandidatoEleccion;
