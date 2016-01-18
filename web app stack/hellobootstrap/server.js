var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use('/jquery',express.static(__dirname+'/node_modules/jquery/dist'));
app.use('/bootstrap',express.static(__dirname+'/node_modules/bootstrap/dist'));

app.use('/',express.static('public'));

http.listen('3000',function(){
	console.log('Server up: http://localhost:3000');
});
