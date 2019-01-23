//special thanks to Daniel Shiffman's tutorials on youtube

var express = require('express');
var app = express();
var server = app.listen(8000);
app.use(express.static('public'));
console.log("Server is running!");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newPlayer);
var playerNum = 1;

function newPlayer(socket){
	console.log("New connection! "+socket.id);
	socket.emit("player", playerNum/2);
	playerNum++;
	socket.on("status", processStatus);
	socket.on("power", processPower);
	function processStatus(status){
		socket.broadcast.emit("status", status);
	}
	function processPower(power){
		socket.broadcast.emit("power", power);
	}
}