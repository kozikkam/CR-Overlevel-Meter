const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    const Player = sequelize.define('player', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        commons_median: {
            type: Sequelize.INTEGER
        },
        rares_median: {
            type: Sequelize.INTEGER
        },
        epics_median: {
            type: Sequelize.INTEGER
        },
        legendaries_median: {
            type: Sequelize.INTEGER
        },
        trophies: {
            type: Sequelize.INTEGER
        },
        creationDate: {
            type: Sequelize.DATE,
            defaultValue: Date.now()
        }
      });

      return Player;
}