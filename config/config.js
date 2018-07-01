var config = require('./config.json');
config = config[process.argv[2] || 'development'];

module.exports = config;