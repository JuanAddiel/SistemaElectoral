const Sequelize = require('sequelize');
const sequelize = require('../context/appContext');

const Votos = sequelize.define('votos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Votos;