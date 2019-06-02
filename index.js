var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var playerController = require('./private/player-controller.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));



io.on('connection', function(socket){
  console.log('a user connected');
  playerController.newConnection(socket);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});