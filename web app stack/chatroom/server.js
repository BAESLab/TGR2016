var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

app.use('/jquery',express.static(__dirname+'/node_modules/jquery/dist'));
app.use('/bootstrap',express.static(__dirname+'/node_modules/bootstrap/dist'));
app.use('/',express.static('public'));


http.listen(3000, function(){
  console.log('listening on *:3000');
});
