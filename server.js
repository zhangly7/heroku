var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./routes/main.js')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var uri = 'mongodb://zhangly7:335506Mongo!@luyaomongo1-shard-00-00-mscg2.mongodb.net:27017,' +
	'luyaomongo1-shard-00-01-mscg2.mongodb.net:27017,' +
	'luyaomongo1-shard-00-02-mscg2.mongodb.net:27017/donar' +
	'?ssl=true&replicaSet=luyaoMongo1-shard-0&authSource=admin';

mongoose.connect(uri,{useMongoClient: true});

// router.use(function(req, res, next) {
// 	console.log('routing now!');
// 	next();
// });

app.use('/',routes);
app.use(express.static(__dirname + '/public')); 
app.listen(port);
console.log('Magic happens on port ' + port);