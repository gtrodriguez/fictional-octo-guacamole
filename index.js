const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const mongoDB = require('mongodb');
const mongoose = require('mongoose');
const mongoClient = mongoDB.MongoClient;
const ObjectID = mongoDB.ObjectID;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/example.html'));
});

http.listen(process.env.PORT || 3000);

var gameInstance = null;
var timeStamp = null;
var currentPlayer = null;
var GameSession = {
  gameInstance: null,
  id: 0,
  currentPlayer: 1, //starts with null
  player1: 'ip address',
  player2: 'ip address',
};

mongoose.connect('mongodb://localhost:27017/connectx');

var db = mongoose.connection; 
var dbCollection = db.collections;
var userSchema = mongoose.Schema({
  name: {
      type: String,
      lowercase: true
    }
}, { runSettersOnQuery: true });

var gameSchema = mongoose.Schema({
  id: Number,
  player1: String,
  player2: String,
  currentPlayer: String,
  scoreBoard: [Array],
  completed: Boolean,
  lastUpdated: Date
});

let User = mongoose.model('User', userSchema);
let Game = mongoose.model('Game', gameSchema);

io.on('connection', function(socket){
  console.log('made socket connection');

  socket.on('register',function(msg){
    console.log('message: ' + JSON.stringify(msg));

    User.find({ name: msg.username }, function (err, user) {
        if (err) return console.log(err);

        console.log(user);

        if (user === null) {
          let newUser = new User({
            name: msg.username,
            _id: new ObjectID()
          });

          newUser.save(function (err) {
              if(err) console.log(err);
          });

          socket.emit('initial-sync', {
            activeGames: []
          });
        } else {
          Game.find({ $or:[{player1: user.name}, {player2: user.name }]}, function(err, docs){
            socket.emit('initial-sync', {
              activeGames: docs              
            });            
          })
        }
    });
  });

  socket.on('select-game', function (msg) {
    Game.find({ 
      _id: msg._id
    }, function (err, gameInstance) { 
      if (err) console.log(err);
      socket.emit('initialize-game', {
        game: gameInstance
      });  
    });  
  })

  socket.on('player-submit-turn', function (msg) {
    Game.find({
      _id: msg._id,
    }, function (err, gameInstance){
        if (err) console.log(err);
        gameInstance.scoreBoard = msg.scoreBoard;
        gameInstance.currentPlayer = gameInstance.currentPlayer === gameInstance.player1 ? gameInstance.player2 : gameInstance.player1;
        gameInstance.save();

        socket.emit('sync-game', function() {
          gameInstance: gameInstance;
        }); 
    });
  });

  socket.on('initial', function (msg) {
      console.log('message: ' + JSON.stringify(msg));
  });
})

