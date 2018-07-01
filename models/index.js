const Sequelize = require('sequelize');
const path = require('path').dirname(require.main.filename);
const config = require('../config/config');

const sequelize = new Sequelize(config['database'], config['username'], config['password'], {
    host: config['host'],
    dialect: config['dialect'],
    operatorsAliases: false,
    logging: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // For now we are going to assume only sqlite as dialect
    storage: path+'/models/database/data.sqlite'
});

const db = {};

const Player = require('./player')(sequelize);
db[Player.name] = Player;
const Arena = require('./arena')(sequelize);
db[Arena.name] = Arena;
Arena.hasMany(Player, {as: 'Players'});

db['sequelize'] = sequelize;
db['Sequelize'] = Sequelize;

sequelize.sync({force: false});

module.exports = db