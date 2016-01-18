var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/jquery', express.static(__dirname + "/node_modules/jquery/dist"));
app.use('/bootstrap', express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use('/', express.static(__dirname + "/public"));

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('reqMessage', function (msg) {
        console.log('REQ:' + msg);
        io.emit('resMessage', "Hello Client! Are you say \"" + msg + "\" ?");
    });
});

setInterval(function () {
    var realtime = new Date().toLocaleString();
    io.emit('realtimeMessage',realtime);
}, 1000);

http.listen(3000, function () {
    console.log('Server up: *:3000');
});
