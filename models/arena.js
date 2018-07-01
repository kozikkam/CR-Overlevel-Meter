const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    const Arena = sequelize.define('arena', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        arena_name: {
            type: Sequelize.STRING
        },
        trophy_low: {
            type: Sequelize.INTEGER
        },
        trophy_high: {
            type: Sequelize.INTEGER
        }
    });
    
    return Arena;
}