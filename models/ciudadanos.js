const Sequelize = require('sequelize');
const sequelize = require('../context/appContext');

const Ciudadanos = sequelize.define('ciudadanos', {
    documentoIdentidad: {
        type: Sequelize.STRING,
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
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

module.exports = Ciudadanos;