const mongo = require('mongoose');

mongo.connect('mongodb://localhost:27017/apirest', { useNewUrlParser: true });
mongo.Promise = global.Promise;
console.log('.. Mongo Conectado');
module.exports = mongo;