const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/example.html'));
});

var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});

var io = socket(server);

io.on('connection', function(socket){
	console.log('made socket connection');
})
