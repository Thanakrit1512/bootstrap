var mongojs = require('mongojs');

var databaseUrl = 'mongodb://localhost/WUlighting';
var collections = ['test'];

var connect = mongojs(databaseUrl, collections);

module.exports = {
    connect: connect
};