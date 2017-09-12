const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

app.use('/public', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/example.html'));
});

/*var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});*/

http.listen(process.env.PORT || 3000);

var gameInstance = null;
var timeStamp = null;
var currentPlayer = null;

io.on('connection', function(socket){
	console.log('made socket connection');

	socket.on('initial', function(msg){
    	console.log('message: ' + JSON.stringify(msg));

    	var syncResponse = {};


    	if(timeStamp === null){
    		syncResponse =  {
    			gameInstance: msg.gameInstance,
    			currentPlayer:  msg.currentPlayer,
    			timeStamp: new Date(),
    			yourPlayer: 1
    		};
    	}else if(msg.timeStamp === null){
    		syncResponse =  {
    			gameInstance: gameInstance,
    			timeStamp: timeStamp,
    			currentPlayer: currentPlayer,
    			yourPlayer: 1
    		};
    	}else if(msg.timeStamp > timeStamp){
    		gameInstance = msg.gameInstance;
    		currentPlayer = msg.currentPlayer;
    		syncResponse = {
    			gameInstance: gameInstance,
    			timeStamp: timeStamp,
    			currentPlayer: currentPlayer,
    			yourPlayer: 1
    		};
    	}else{
    		syncResponse = {
    			gameInstance: gameInstance,
    			timeStamp: timeStamp,
    			currentPlayer: currentPlayer,
	   			yourPlayer: 1
    		};
    	}

		socket.emit('initial-sync', syncResponse);
  	});
})

